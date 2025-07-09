const express = require('express');
const router = express.Router();
const { getResume, updateResume } = require('../controllers/resumeController');
// const auth = require('../middlewares/authMiddleware');

router.get('/',  getResume);
router.post('/', updateResume);

module.exports = router; 