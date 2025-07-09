import mongoose from 'mongoose';
const { Schema } = mongoose;

const StatusHistorySchema = new Schema({
  status: { type: String, required: true, trim: true },
  date:   { type: Date,   default: Date.now },
  notes:  { type: String }
}, { _id: false });

const ApplicationSchema = new Schema({
  // snapshot fields for "Candidates" UI:
  applicantName:     { type: String, required: true },
  applicantEmail:    { type: String, required: true },
  applicantPhone:    { type: String, default: '' },
  applicantLocation: { type: String, default: '' },

  jobTitle:          { type: String, required: true },
  company:           { type: String, required: true },

  appliedDate:       { type: Date, default: Date.now },
  currentStatus: {
    type: String,
    enum: ['New','Under Review','Interview Scheduled','Offered','Rejected'],
    default: 'New'
  },
  history:           [StatusHistorySchema],

  experience:        { type: String, required: true },
  skills:            [{ type: String }],
  bio:               { type: String, default: '' },
  resumeUrl:         { type: String, required: true },
  coverLetter:       { type: String, default: '' },
  userId:            { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: true }
}, {
  collection: 'applications',
  timestamps: true
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;