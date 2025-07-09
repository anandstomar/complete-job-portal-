import mongoose from 'mongoose';
const { Schema } = mongoose;

const assignedTestSchema = new Schema({
  test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: false },
  status: { type: String, enum: ['Assigned', 'Completed'], default: 'Assigned' },
  startedAt: Date,
  completedAt: Date,
  score: Number,
  answers: [{
    question: String,
    selected: Number,
    correct: Boolean
  }]
}, { timestamps: true });

export default mongoose.model('AssignedTest', assignedTestSchema); 