// models/Interview.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const StatusHistorySchema = new Schema({
  status:  { type: String, required: true, trim: true },
  date:    { type: Date, default: Date.now },
  notes:   { type: String }
}, { _id: false });

const InterviewSchema = new Schema({
  candidate:     { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: true },
  interviewer:   { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: true },
  job:           { type: Schema.Types.ObjectId, ref: 'JobSchema', required: true },

  // Optional: Link to the related application record
  application:   { type: Schema.Types.ObjectId, ref: 'Application' },

  scheduledAt:   { type: Date,   required: true },
  type:          { 
    type: String, 
    enum: ['Video Call','In-Person','Phone Call'], 
    default: 'Video Call',
    required: true 
  },
  duration:      { type: Number, required: true },  // in minutes

  status: {
    type: String,
    enum: ['Scheduled','In Progress','Completed','Cancelled'],
    default: 'Scheduled'
  },
  history:       [StatusHistorySchema],

  // Optional extras
  outcome:       { type: String, enum: ['Pending','Passed','Failed','On Hold'], default: 'Pending' },
  notes:         { type: String },
  feedback:      { type: String },
  interviewerName: { type: String }, // cached for performance (optional)

}, {
  collection: 'interviews',
  timestamps: true
});

// Virtuals for date & time display
InterviewSchema.virtual('date').get(function(){
  return this.scheduledAt.toISOString().slice(0,10);
});
InterviewSchema.virtual('time').get(function(){
  return this.scheduledAt.toTimeString().split(' ')[0];
});

export default mongoose.model('Interview', InterviewSchema);
