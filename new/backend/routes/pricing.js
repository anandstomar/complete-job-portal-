// routes/pricingRoutes.js
const express = require('express');
const { listPlans, createPlan } = require('../controllers/pricingContoller');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

router.get('/', listPlans);
router.post('/', createPlan);

module.exports = router;
