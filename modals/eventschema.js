const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Workshop', 'Seminar', 'Conference', 'Webinar', 'Meetup','Hackathon', 'Cultural Events', 'TedTalk','Startup Showcase','Panel Discussion and Talk', 'Orientation'], 
    required: true 
  },
  date: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  location: { type: String, required: true },

  organiser_type: {
    type: String,
    enum: ['Alumni', 'Faculty'],  // Specify the type of organizer
    required: true
  },
  organiser_name: { type: String, required: true },

  capacity: { type: Number, required: true },
  no_of_registered_attendees: { type: Number, default: 0 },
  
  // Speakers array
  speakers: [
    {
      name: { type: String, required: true },
      bio: { type: String }
    }
  ],

  // Price and registration
  price: { type: Number, default: 0 },
  registration_deadline: { type: Date, required: true },

  // Image field with default value
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'  // You can replace this with any default image URL
  },

  // Attendees array
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update updatedAt
eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
