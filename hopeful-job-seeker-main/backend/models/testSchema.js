import mongoose from 'mongoose';
const { Schema } = mongoose;

const testSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: String,
  duration: { type: Number, required: true }, // in minutes
  questions: [{
    question: String,
    options: [String],
    answer: Number // index of correct option
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: false }
}, { timestamps: true });

export default mongoose.model('Test', testSchema); 