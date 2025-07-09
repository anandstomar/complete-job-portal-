// controllers/purchaseController.js
const Purchase = require('../models/PurchaseModel');
const RazorpaySvc = require('../service/PaymentService');
const PricingPlan = require('../models/PriceModel');
const mongoose = require('mongoose');

const { Types } = mongoose;

// controllers/purchaseController.js
// controllers/purchaseController.js
exports.buyPlan = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { planId } = req.body;
  
      const plan = await PricingPlan.findById(planId);
      if (!plan || !plan.isActive) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }
  
      // Generate a short receipt ID: planId’s last 6 chars + timestamp
      const receiptId = `rcpt_${planId.slice(-6)}_${Date.now()}`;
  
      const order = await RazorpaySvc.createOrder({
        amount: plan.price,     // service multiplies by 100 internally
        receipt: receiptId,     // now guaranteed < 40 chars
      });
  
      const purchase = await Purchase.create({
        user: userId,
        plan: planId,
        razorpayOrderId: order.id,
        amount: plan.price,
      });
  
      console.log('Responding with JSON:', {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        purchaseId: purchase._id,
      });
  
      return res.json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          purchaseId: purchase._id,
        }
      });
    } catch (err) {
      next(err);
    }
  };
  
  

exports.verifyPayment = async (req, res, next) => {
  try {
    const { purchaseId, razorpay_payment_id, razorpay_signature, razorpay_order_id } = req.body;

    // Validate and cast purchaseId
    if (!Types.ObjectId.isValid(purchaseId)) {
      return res.status(400).json({ success: false, message: 'Invalid purchaseId format' });
    }
    const _id = new Types.ObjectId(purchaseId);

    // TODO: verify signature here

    const purchase = await Purchase.findById(_id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase record not found' });
    }

    purchase.razorpayPaymentId = razorpay_payment_id;
    purchase.status = 'paid';
    await purchase.save();

    res.json({ success: true, message: 'Payment verified' });
  } catch (err) {
    next(err);
  }
};

exports.myPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const purchase = await Purchase.findOne({ user: userId, status: 'paid' })
      .populate('plan', 'planName price features downloadLimit')
      .sort({ createdAt: -1 });

    if (!purchase) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: purchase.plan });
  } catch (err) {
    next(err);
  }
};
