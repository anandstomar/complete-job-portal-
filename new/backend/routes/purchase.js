// routes/purchaseRoutes.js
const express = require('express');
const {
  buyPlan,
  verifyPayment,
  myPlan,
} = require('../controllers/purchaseController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.use(authMiddleware);
router.post('/buy', buyPlan);
router.post('/verify', verifyPayment);
router.get('/my-plan', myPlan);

module.exports = router;
