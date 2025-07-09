import Job from '../models/UserJobSchema.js';

export const getAllJobs = async (req, res) => {
  const filters = {};
  if (req.query.location) filters.location = req.query.location;
  if (req.query.type)     filters.type = req.query.type;

  try {
    const jobs = await Job.find(filters).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!job.applicants) job.applicants = [];
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already applied' });
    }

    job.applicants.push(req.user._id);
    await job.save();
    res.json({ message: 'Application successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.user._id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user._id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { getJobById as getJobByIdAdmin };

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
