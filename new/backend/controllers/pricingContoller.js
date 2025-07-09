// controllers/pricingController.js
const PricingPlan = require('../models/PriceModel');

exports.createPlan = async (req, res, next) => {
    try {
      const { planName, price, features, isActive, downloadLimit } = req.body;
      const plan = await PricingPlan.create({ planName, price, features, isActive, downloadLimit });
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  };

exports.listPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.find({ isActive: true }).select('-__v');
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
};
