const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensures no duplicate emails
  phone: { type: String, required: true },
  department: { 
    type: String,
    enum: [
      'Computer Science',
      'Information Technology',
      'Electronics and Communication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Pharmacy',
      'Management',
      'Business Administration'
    ], // Specify the departments
    required: true 
  },
  designation: { 
    type: String, 
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'], // Define possible designations
    required: true 
  },
  bio: { type: String }, // Optional field for a short biography
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Reference to Event model
  profile_picture: {
    type: String,
    default: 'https://images.pexels.com/photos/27041405/pexels-photo-27041405/free-photo-of-a-view-of-the-ocean-from-a-pier.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Default profile image URL
  },
  socialMedia: { // Sub-document for social media links
    linkedin: { type: String },
    twitter: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update updatedAt
facultySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
