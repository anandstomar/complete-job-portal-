// src/controllers/applicationController.js
import Application from '../models/jobApplicationSchema.js';

/**
 * GET /api/applications
 * List applications (with optional filters ?status=&jobTitle=)
 */
export const listApplications = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status)   filter.currentStatus = req.query.status;
    if (req.query.jobTitle) filter.jobTitle     = req.query.jobTitle;
    if (req.query.userId)   filter.userId       = req.query.userId;

    const apps = await Application.find(filter)
      .sort({ appliedDate: -1 })
      .lean();

    // map to JSON shape your UI expects
    const payload = apps.map(a => ({
      id:             a._id,
      applicantName:  a.applicantName,
      applicantEmail: a.applicantEmail,
      applicantPhone: a.applicantPhone,
      applicantLocation: a.applicantLocation,
      jobTitle:       a.jobTitle,
      company:        a.company,
      appliedDate:    a.appliedDate,
      status:         a.currentStatus,
      experience:     a.experience,
      skills:         a.skills,
      bio:            a.bio,
      resumeUrl:      a.resumeUrl,
      coverLetter:    a.coverLetter,
      history:        a.history || []
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/:id
 * Fetch one application
 */
export const getApplication = async (req, res, next) => {
  try {
    const a = await Application.findById(req.params.id).lean();
    if (!a) return res.status(404).json({ message: 'Not found' });

    return res.json({
      id:             a._id,
      ...a
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/applications
 * Create new application
 */
export const createApplication = async (req, res, next) => {
  try {
    const app = new Application({
      ...req.body,
      history: [{ status: req.body.currentStatus || 'New', notes: 'Created' }]
    });
    const saved = await app.save();
    return res.status(201).json({ id: saved._id, ...saved.toObject() });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/applications/:id
 * Update application (including status transitions)
 */
export const updateApplication = async (req, res, next) => {
  try {
    const { currentStatus, notes, ...rest } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });

    if (currentStatus && currentStatus !== app.currentStatus) {
      app.history.push({ status: currentStatus, notes: notes || '' });
      app.currentStatus = currentStatus;
    }

    Object.assign(app, rest);
    const updated = await app.save();
    return res.json({ id: updated._id, ...updated.toObject() });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/applications/:id
 */
export const deleteApplication = async (req, res, next) => {
  try {
    const result = await Application.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
