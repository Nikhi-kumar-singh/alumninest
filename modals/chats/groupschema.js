const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { 
    type: String, 
    required: true 
  },  // Group name

  description: { 
    type: String 
  },  // Group description

  // Reference to the user (Alumni, Student, or Faculty) who created the group
  createdByType: {
    type: String, 
    required: true, 
    enum: ['Alumni', 'Student', 'Faculty']  // Type of user who created the group
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Will be dynamically populated based on createdByType
  },
  
  profilePhoto: {
    type: String, 
    default: ''  // URL to the profile photo of the group
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },  // Timestamp when the group was created
});

groupSchema.methods.populateCreatedBy = function () {
  return this.populate({
    path: 'createdBy',
    model: this.createdByType // Dynamically choose the model based on createdByType
  }).execPopulate();
};

module.exports = mongoose.model('Group', groupSchema);
