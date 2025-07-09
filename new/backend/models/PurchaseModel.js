
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PurchaseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'PricingPlan', required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
  },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
