const mongoose = require('mongoose');
const Event = require('./modals/eventschema.js');  // Path to your Event model
require('dotenv').config();

// MongoDB connection
main().then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/alumninxt');

}

// Sample event data
const eventData = [
  {
    name: "JavaScript for Beginners",
    description: "A hands-on workshop to learn the basics of JavaScript.",
    type: "Workshop",
    date: {
      start: new Date('2024-11-01T10:00:00'),
      end: new Date('2024-11-01T16:00:00')
    },
    location: "Room 101, Computer Science Department",
    organiser_type: "Faculty",
    organiser_name: "Dr. A.K. Sharma",
    capacity: 50,
    no_of_registered_attendees: 20,
    speakers: [{ name: "John Doe", bio: "Senior Developer at XYZ Corp." }],
    price: 500,
    registration_deadline: new Date('2024-10-28T23:59:00'),
    image: "https://cdn.pixabay.com/photo/2017/08/10/07/32/workshop-2619420_960_720.jpg"
  },
  {
    name: "AI in Healthcare",
    description: "An informative seminar on the impact of AI in the healthcare industry.",
    type: "Seminar",
    date: {
      start: new Date('2024-11-10T09:00:00'),
      end: new Date('2024-11-10T12:00:00')
    },
    location: "Auditorium, Main Building",
    organiser_type: "Alumni",
    organiser_name: "Ravi Kapoor",
    capacity: 100,
    no_of_registered_attendees: 75,
    speakers: [{ name: "Dr. Meena Verma", bio: "AI Specialist in Healthcare" }],
    price: 0,
    registration_deadline: new Date('2024-11-05T23:59:00'),
    image: "https://cdn.pixabay.com/photo/2016/11/19/14/00/hall-1836204_960_720.jpg"
  },
  {
    name: "Remote Work Best Practices",
    description: "A webinar discussing the best practices for working remotely in tech.",
    type: "Webinar",
    date: {
      start: new Date('2024-11-15T15:00:00'),
      end: new Date('2024-11-15T17:00:00')
    },
    location: "Online - Zoom",
    organiser_type: "Alumni",
    organiser_name: "Sonia Verma",
    capacity: 500,
    no_of_registered_attendees: 300,
    speakers: [
      { name: "Michael Lee", bio: "Remote Work Consultant" }
    ],
    price: 200,
    registration_deadline: new Date('2024-11-10T23:59:00'),
    image: "https://cdn.pixabay.com/photo/2015/09/18/20/21/conference-949118_960_720.jpg"
  },
  {
    name: "Tech Alumni Meetup",
    description: "An informal meetup for tech alumni to network and share ideas.",
    type: "Meetup",
    date: {
      start: new Date('2024-12-05T18:00:00'),
      end: new Date('2024-12-05T21:00:00')
    },
    location: "Cafe Lounge, Downtown",
    organiser_type: "Alumni",
    organiser_name: "Rahul Singh",
    capacity: 30,
    no_of_registered_attendees: 25,
    speakers: [
      { name: "N/A", bio: "" }  // No speakers for this meetup
    ],
    price: 100,
    registration_deadline: new Date('2024-12-03T23:59:00'),
    image: "https://cdn.pixabay.com/photo/2020/11/24/10/36/online-5773416_960_720.jpg"
  },
  {
    name: "Tech Innovations Conference 2024",
    description: "A two-day conference on the latest technology innovations.",
    type: "Conference",
    date: {
      start: new Date('2024-12-01T09:00:00'),
      end: new Date('2024-12-02T18:00:00')
    },
    location: "Grand Hall, Hotel XYZ",
    organiser_type: "Faculty",
    organiser_name: "Prof. S.K. Agarwal",
    capacity: 200,
    no_of_registered_attendees: 150,
    speakers: [
      { name: "Jane Smith", bio: "CEO of TechWorld" },
      { name: "Alan Blake", bio: "CTO at Innovate Ltd." }
    ],
    price: 1500,
    registration_deadline: new Date('2024-11-25T23:59:00'),
    image: "https://cdn.pixabay.com/photo/2016/03/26/13/09/startup-1283164_960_720.jpg"
  }
  
  
  
  // Add more events here
];

// Save the events to the database
const seedEvents = async () => {
  // try {
  //   await Event.insertMany(eventData);
  //   console.log("Event data seeded successfully!");
  //   mongoose.connection.close();
  // } catch (error) {
  //   console.error("Error seeding event data:", error);
  //   mongoose.connection.close();
  // }
  const events = await Event.find({});
console.log(events);
};


seedEvents();
