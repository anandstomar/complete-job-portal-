const Resume = require('../models/Resume');

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.userId });
    if (!resume) {
      return res.json({
        basicInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        template: 'modern',
        colorScheme: 'blue'
      });
    }
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const data = req.body;
    const resume = await Resume.findOneAndUpdate(
      { user: req.user.userId },
      { ...data, user: req.user.userId, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(resume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 