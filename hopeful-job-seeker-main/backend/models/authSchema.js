// models/User.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const authSchema = new Schema({
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },
  role:        { 
    type: String, 
    enum: ['candidate','interviewer','admin'],   // ← added "Interviewer" here
    default: 'candidate',
    required: true 
  },

  // for User Management UI:
  status:      { type: String, enum: ['Active','Inactive'], default: 'Active' },
  phone:       { type: String, default: '' },
  location:    { type: String, default: '' },
  lastLogin:   { type: Date, default: null },
  profilePct:  { type: Number, min: 0, max: 100, default: 0 }
}, {
  collection: 'JobPortalUsers',
  timestamps: true
});

// Virtual for joinDate:
authSchema.virtual('joinDate').get(function(){
  return this.createdAt;
});

export default mongoose.model('JobPortalUsers', authSchema);

