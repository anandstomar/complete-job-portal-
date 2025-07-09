const mongoose = require('mongoose');

const resumePDFSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usernames',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  resumeData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  template: {
    type: String,
    default: 'modern'
  },
  colorScheme: {
    type: String,
    default: 'blue'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
resumePDFSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
resumePDFSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ResumePDF', resumePDFSchema); 