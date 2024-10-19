const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    default: 'Student'  // Store 'Alumni' as a default value
  },
    name: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    username:{type:String, required:true, unique:true},
    password: { type: String, required: true },  // Store hashed password
    phone_number: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    college_name:{type: String, enum:['United Institute of Technology(UIT)','United College of Engineering and Research(UCER)','United College of Pharmacy', 'United Institute of Management(FUGS)','Others'], required:true},
    student_id: { 
      type: Number, 
      required: true, 
      min: 0   // Ensures only natural numbers (1 and above) are allowed 
  },
  
    // Fields specific to the Student schema
    enrollment_year: { type: Number },
    graduation_year: { type: Number },
    userId: {
      type: String, 
      required: true, 
      unique: true,  // Ensure this field is unique
    },
    degree: { type: String , enum: [
      'B.Tech',
      'BBA',
      'BCA',
      'B Pharma',
      'MCA',
      'M.Tech',
      'Others'
  ]},
    department: { type: String },
    skills: [String],
    interests: [String],
    events_attended: [{
      event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      event_name: { type: String }
    }],
    profile_picture: { type: String,
      default:"https://images.pexels.com/photos/27041405/pexels-photo-27041405/free-photo-of-a-view-of-the-ocean-from-a-pier.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
     },  // URL for profile picture
    social_links: {
      linkedin: { type: String },
      github: { type: String }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Student', studentSchema);
  