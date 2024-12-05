const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  type: { 
    type: String, 
    default: 'Faculty'  // Store 'Alumni' as a default value
  },
    name: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true }
      },
  email: { type: String, required: true, unique: true }, // Ensures no duplicate emails
  username:{type:String, required:true, unique:true},
  phone: { type: String, required: true },

  group_joined: [{
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grpup' },
    group_name: { type: String }
  }],
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
  qualifications: [{ type: String, required: true }], // Array of qualifications (Multiple degrees)
  year_of_experience: { type: Number, required: true }, // Number of years of experience
  institutions_taught: [{ type: String, required: true }], // Array of institutions where the faculty has taught
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
  connections_students: [{
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    status: { type: String, enum: ['pending', 'connected', 'rejected'], default: 'pending' }
  }],
  connections_alumni: [{
    alumni_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
    status: { type: String, enum: ['pending', 'connected', 'rejected'], default: 'pending' }
  }],
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
