const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },  // Group where the message was sent
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupMembership', required: true },  // The user who sent the message
  messageType: { 
    type: String, 
    enum: ['text', 'photo', 'video', 'file'], 
    default: 'text' 
  },  // Defines the type of message: text, photo, video, or file
  content: { 
    type: String, 
    required: function() { return this.messageType === 'text'; } 
  },  // Message content for text messages
  mediaUrl: {
    type: String,
    required: function() { return this.messageType !== 'text'; }
  },  // URL for photo, video, or file, required for non-text messages
  sentAt: { type: Date, default: Date.now },  // Timestamp when the message was sent
});

module.exports = mongoose.model('Message', messageSchema);
