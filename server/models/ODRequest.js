const mongoose = require('mongoose');

const odRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentNumber: {
    type: String,
    required: true,
    trim: true
  },
  subjectCode: {
    type: String,
    required: true,
    trim: true
  },
  facultyCode: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  timeFrom: {
    type: String,
    required: true,
    trim: true
  },
  timeTo: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ODRequest', odRequestSchema); 