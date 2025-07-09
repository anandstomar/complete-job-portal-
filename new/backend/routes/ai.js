const express = require('express');
const router = express.Router();
const { 
  generateSummary, 
  improveJobDescription, 
  suggestSkills, 
  generateProjectDescription, 
  optimizeForATS 
} = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

// Generate professional summary
router.post('/generate-summary', generateSummary);

// Improve job descriptions and achievements
router.post('/improve-job-description', improveJobDescription);

// Suggest skills based on experience
router.post('/suggest-skills', suggestSkills);

// Generate project descriptions
router.post('/generate-project-description', generateProjectDescription);

// Optimize resume for ATS
router.post('/optimize-ats', optimizeForATS);

module.exports = router; 