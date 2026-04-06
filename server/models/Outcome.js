const mongoose = require('mongoose');

const OutcomeSchema = new mongoose.Schema({
  subject: String,
  assignmentMarks: { type: Number, default: 0 },
  assignmentTitle: String,
  internalMarks: { type: Number, default: 0 },
  labCourse: String,
  labExperiment: String,
  title: { type: String, required: true },
  description: String,
  status: String,
  progress: { type: Number, default: 0 },
  category: String
}, { timestamps: true });

module.exports = mongoose.model('Outcome', OutcomeSchema);
