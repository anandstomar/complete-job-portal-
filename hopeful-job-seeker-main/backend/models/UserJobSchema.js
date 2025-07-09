import mongoose from 'mongoose';
const { Schema } = mongoose;

const JobSchema = new Schema({
  title:        { type: String, required: true, trim: true },
  company:      { type: String, required: true, trim: true },
  location:     { type: String, required: true, trim: true },
  type:         { type: String, enum: ['Full-time','Part-time','Contract','Internship'], default: 'Full-time' },
  salary:       { min: Number, max: Number },
  experience:   {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 }
  },
  description:  { type: String, required: true },
  requirements: [{ type: String }],

  // who posted it:
  postedBy:     { type: Schema.Types.ObjectId, ref: 'JobPortalUsers', required: true },

  // you'll push applicant IDs when they apply:
  applicants:   [{ type: Schema.Types.ObjectId, ref: 'JobPortalUsers' }]
}, {
  collection: 'JobSchema',
  timestamps: true
});

export default mongoose.model('JobSchema', JobSchema);
