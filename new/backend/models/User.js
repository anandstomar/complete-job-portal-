const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  jobTitle: { type: String },
  location: { type: String },
  aboutMe: { type: String },
  linkedinUrl: { type: String },
  profileImage: { type: String },
  skills: [{ type: String }],
  experience: [{
    id: { type: String },
    position: { type: String },
    company: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    description: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Usernames', UserSchema); 