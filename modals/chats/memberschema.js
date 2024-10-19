const groupMembershipSchema = new mongoose.Schema({
    group: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Group', 
      required: true 
    },  // Reference to the group
    name:{type:String, required:true},
  
    memberType: { 
      type: String, 
      required: true, 
      enum: ['Alumni', 'Student', 'Faculty']  // Type of member: Alumni, Student, or Faculty
    }, 
  
    member: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      // Dynamically populated based on memberType 
    },  
  
    joinedAt: { 
      type: Date, 
      default: Date.now 
    },  // Timestamp when the user joined the group
  
    // Reference to the user who created the membership
    createdByType: {
      type: String, 
      required: true, 
      enum: ['Alumni', 'Student', 'Faculty']  // Type of creator (Alumni, Student, Faculty)
    },
  
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Will be dynamically populated based on createdByType
    },
  
  });
  
  // Method to dynamically populate the member
  groupMembershipSchema.methods.populateMember = function () {
    return this.populate({
      path: 'member',
      model: this.memberType // Dynamically choose the model based on memberType
    }).execPopulate();
  };
  


  
  module.exports = mongoose.model('GroupMembership', groupMembershipSchema);
  