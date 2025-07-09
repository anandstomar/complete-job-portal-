const mongoose = require('mongoose');

const BasicInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  linkedin: { type: String },
  github: { type: String },
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String },
  achievements: [{ type: String }],
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  gpa: { type: String },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  link: { type: String },
  github: { type: String },
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  basicInfo: { type: BasicInfoSchema, required: true },
  summary: { type: String },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  skills: [{ type: String }],
  projects: [ProjectSchema],
  template: { type: String },
  colorScheme: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resumedata', ResumeSchema);
