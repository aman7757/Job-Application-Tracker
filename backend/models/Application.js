// models/Application.js
// This defines what a single "Job Application" entry looks like in the database.

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // links this application to whichever user created it
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'], // only these values allowed
    default: 'Applied',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String, // job posting link, optional
  },
  notes: {
    type: String, // any personal notes, optional
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);