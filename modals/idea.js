const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Idea Schema
const IdeaSchema = new Schema({
  idea_title: {
    type: String,
    required: true,
    maxLength: 150,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000,
    trim: true
  },
  impact: {
    type: String,
    required: true,
    maxLength: 500,
    trim: true
  },
  target_audience: {
    type: String,
    required: true,
    maxLength: 300,
    trim: true
  },
  idea_pdf: {
    type: String,
    required: true,
    description: "URL of the uploaded PDF document"
  },
  video_explanation: {
    type: String,
    required: true,
    trim: true,
    description: "URL of the video explaining the idea"
  },
  expected_price: { type: Number, default: null },
  linkedin_profile: {
    type: String,
    required: true,
    description: "LinkedIn profile URL"
  },
  submission_date: {
    type: Date,
    default: Date.now,
    description: "Date when the idea was submitted"
  }
});

// Export the Idea model
module.exports = mongoose.model('Idea', IdeaSchema);
