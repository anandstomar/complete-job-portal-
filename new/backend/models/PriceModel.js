const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const PricingPlanSchema = new Schema({
  pricingId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
    immutable: true,
  },
  planName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  features: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  downloadLimit: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('PricingPlan', PricingPlanSchema);
