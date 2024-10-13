const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    name: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Store hashed password
    phone_number: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    college_name:{type: String, enum:['United Institute of Technology(UIT)','United College of Engineering and Research(UCER)','United College of Pharmacy', 'United Institute of Management(FUGS)','Others'], required:true},
    alumni_id: { 
      type: Number,  
      min: 0   // Ensures only natural numbers (1 and above) are allowed 
    },
    job_sector: {
        type: String,
        enum: [
          'Software Development',
          'Information Technology (IT)',
          'Mechanical Engineering',
          'Civil Engineering',
          'Electrical Engineering',
          'Pharmaceuticals',
          'Healthcare',
          'Biotechnology',
          'Chemical Engineering',
          'Management Consulting',
          'Marketing',
          'Finance and Banking',
          'Human Resources',
          'Operations Management',
          'Entrepreneurship',
          'Education and Training',
          'Manufacturing',
          'Research and Development (R&D)',
          'Data Science and Analytics',
          'Artificial Intelligence and Machine Learning',
          'Digital Marketing',
          'Supply Chain Management',
          'Telecommunications',
          'Public Sector and Government Jobs',
          'Automobile Industry',
          'E-commerce',
          'Construction',
          'Environmental Engineering',
          'Energy Sector',
          'Logistics and Transportation',
          'Cybersecurity',
          'Public Health',
          'Retail and Sales',
          'Hospitality and Tourism',
          'Project Management'
        ],
        required: true
      },
      
  
    // Fields specific to the Alumni schema
    graduation_year: { type: Number, required:true },
    degree: {
        type: String,
        required: true,
        enum: [
            'B.Tech',
            'BBA',
            'BCA',
            'B Pharma',
            'MCA',
            'MBA',
            'M.Tech',
            'Others'
        ]
       },
       events: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event' 
      }],
    
    department: { type: String},
    job_title: { type: String },  // Current job title
    company: { type: String },  // Current company
    location: { type: String },  // Current location
    profile_picture: { type: String ,
      default:"https://images.pexels.com/photos/27041405/pexels-photo-27041405/free-photo-of-a-view-of-the-ocean-from-a-pier.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },  // URL for profile picture
    social_links: {
      linkedin: { type: String },
      github: { type: String },
      twitter: { type: String }
    },
    skills: [String],
    projects: [String],  // List of projects
    contributions: [String],  // Contributions to college, etc.
    is_verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Alumni', alumniSchema);
  