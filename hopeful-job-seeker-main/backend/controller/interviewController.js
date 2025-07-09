import Interview from '../models/interviewSchema.js';

/**
 * GET /api/interviews
 * List all interviews (optional filters: ?candidate=&interviewer=&status=)
 */
export const listInterviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.candidate)   filter.candidate   = req.query.candidate;
    if (req.query.interviewer) filter.interviewer = req.query.interviewer;
    if (req.query.status)      filter.status      = req.query.status;

    const interviews = await Interview.find(filter)
      .populate('interviewer')
      .populate('candidate')
      .sort({ scheduledAt: -1 })
      .lean();

    res.json(interviews);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interviews/:id
 * Fetch one interview by ID
 */
export const getInterview = async (req, res, next) => {
  try {
    const iv = await Interview.findById(req.params.id).lean();
    if (!iv) return res.status(404).json({ message: 'Not found' });
    res.json(iv);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/interviews
 * Schedule a new interview
 */
export const createInterview = async (req, res, next) => {
  try {
    const iv = new Interview(req.body);
    // initialize history with initial status
    iv.history = [{ status: iv.status, notes: 'Scheduled' }];
    const saved = await iv.save();
    res.status(201).json(saved.toObject());
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/interviews/:id
 * Update interview details or status (push to history if status changes)
 */
export const updateInterview = async (req, res, next) => {
  try {
    const { status, notes, ...rest } = req.body;
    const iv = await Interview.findById(req.params.id);
    if (!iv) return res.status(404).json({ message: 'Not found' });

    // handle status transition
    if (status && status !== iv.status) {
      iv.history.push({ status, notes: notes || '' });
      iv.status = status;
    }

    Object.assign(iv, rest);
    const updated = await iv.save();
    res.json(updated.toObject());
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/interviews/:id
 */
export const deleteInterview = async (req, res, next) => {
  try {
    const result = await Interview.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

