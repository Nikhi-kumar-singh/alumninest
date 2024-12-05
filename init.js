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
  // Workshops
  {
    name: "Web Development Workshop",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    type: "Workshop",
    date: {
      start: new Date("2024-10-28T09:00:00"),
      end: new Date("2024-10-28T17:00:00")
    },
    location: "Main Auditorium",
    organiser_type: "Faculty",
    organiser_name: "Dr. Smith",
    capacity: 50,
    no_of_registered_attendees: 20,
    speakers: [{ name: "John Doe", bio: "Expert Web Developer" }],
    price: 500,
    registration_deadline: new Date("2024-10-26"),
    image: "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Data Science Workshop",
    description: "An introductory workshop on data science and machine learning.",
    type: "Workshop",
    date: {
      start: new Date("2024-11-05T09:00:00"),
      end: new Date("2024-11-05T17:00:00")
    },
    location: "Room 101",
    organiser_type: "Alumni",
    organiser_name: "Alice Johnson",
    capacity: 30,
    no_of_registered_attendees: 10,
    speakers: [{ name: "Mark Lee", bio: "Data Scientist" }],
    price: 400,
    registration_deadline: new Date("2024-11-03"),
    image: "https://images.pexels.com/photos/3321791/pexels-photo-3321791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "AI Workshop",
    description: "Hands-on workshop to learn about AI and its applications.",
    type: "Workshop",
    date: {
      start: new Date("2024-11-15T10:00:00"),
      end: new Date("2024-11-15T16:00:00")
    },
    location: "Lab 2",
    organiser_type: "Faculty",
    organiser_name: "Dr. Karen Wright",
    capacity: 40,
    no_of_registered_attendees: 15,
    speakers: [{ name: "Steven Harris", bio: "AI Engineer" }],
    price: 600,
    registration_deadline: new Date("2024-11-14"),
    image: "https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Cybersecurity Workshop",
    description: "Learn about cybersecurity threats and protection mechanisms.",
    type: "Workshop",
    date: {
      start: new Date("2024-11-22T09:00:00"),
      end: new Date("2024-11-22T17:00:00")
    },
    location: "Conference Room B",
    organiser_type: "Alumni",
    organiser_name: "Michael Brown",
    capacity: 60,
    no_of_registered_attendees: 25,
    speakers: [{ name: "Jessica White", bio: "Cybersecurity Analyst" }],
    price: 500,
    registration_deadline: new Date("2024-11-20"),
    image: "https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Mobile App Development Workshop",
    description: "Build your first mobile app using Flutter.",
    type: "Workshop",
    date: {
      start: new Date("2024-12-01T09:00:00"),
      end: new Date("2024-12-01T17:00:00")
    },
    location: "Room 203",
    organiser_type: "Faculty",
    organiser_name: "Prof. Linda Green",
    capacity: 45,
    no_of_registered_attendees: 20,
    speakers: [{ name: "Daniel Lee", bio: "Mobile Developer" }],
    price: 700,
    registration_deadline: new Date("2024-11-29"),
    image: "https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },

  // Seminars
  {
    name: "AI in Healthcare Seminar",
    description: "Discussing the impact of AI technology in the healthcare industry.",
    type: "Seminar",
    date: {
      start: new Date("2024-11-05T14:00:00"),
      end: new Date("2024-11-05T16:00:00")
    },
    location: "Conference Room A",
    organiser_type: "Alumni",
    organiser_name: "Jane Doe",
    capacity: 100,
    no_of_registered_attendees: 30,
    speakers: [{ name: "Dr. Emily White", bio: "AI Researcher at Tech Co." }],
    price: 300,
    registration_deadline: new Date("2024-11-03"),
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "The Future of Tech Seminar",
    description: "Exploring upcoming trends in technology and innovation.",
    type: "Seminar",
    date: {
      start: new Date("2024-11-12T14:00:00"),
      end: new Date("2024-11-12T16:00:00")
    },
    location: "Auditorium 1",
    organiser_type: "Faculty",
    organiser_name: "Dr. John White",
    capacity: 120,
    no_of_registered_attendees: 40,
    speakers: [{ name: "Mike Smith", bio: "Tech Innovator" }],
    price: 250,
    registration_deadline: new Date("2024-11-10"),
    image: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Mental Health Awareness Seminar",
    description: "A seminar focused on mental health and wellness in tech.",
    type: "Seminar",
    date: {
      start: new Date("2024-11-19T14:00:00"),
      end: new Date("2024-11-19T16:00:00")
    },
    location: "Room 202",
    organiser_type: "Alumni",
    organiser_name: "Rachel Adams",
    capacity: 80,
    no_of_registered_attendees: 35,
    speakers: [{ name: "Dr. Susan Green", bio: "Psychologist" }],
    price: 200,
    registration_deadline: new Date("2024-11-17"),
    image: "https://images.pexels.com/photos/431722/pexels-photo-431722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Blockchain and Its Applications Seminar",
    description: "Understanding blockchain technology and its uses in various sectors.",
    type: "Seminar",
    date: {
      start: new Date("2024-11-26T14:00:00"),
      end: new Date("2024-11-26T16:00:00")
    },
    location: "Room 105",
    organiser_type: "Faculty",
    organiser_name: "Prof. Amy Johnson",
    capacity: 90,
    no_of_registered_attendees: 45,
    speakers: [{ name: "Tom Brown", bio: "Blockchain Expert" }],
    price: 300,
    registration_deadline: new Date("2024-11-24"),
    image: "https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Women in Tech Seminar",
    description: "Celebrating and promoting women in technology and STEM fields.",
    type: "Seminar",
    date: {
      start: new Date("2024-12-03T14:00:00"),
      end: new Date("2024-12-03T16:00:00")
    },
    location: "Auditorium 2",
    organiser_type: "Alumni",
    organiser_name: "Linda Green",
    capacity: 100,
    no_of_registered_attendees: 50,
    speakers: [{ name: "Dr. Karen Johnson", bio: "Advocate for Women in STEM" }],
    price: 250,
    registration_deadline: new Date("2024-12-01"),
    image: "https://images.pexels.com/photos/2747446/pexels-photo-2747446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },

  // Conferences
  {
    name: "Tech Innovations Conference 2024",
    description: "An annual conference focusing on the latest trends and innovations in technology.",
    type: "Conference",
    date: {
      start: new Date("2024-12-10T09:00:00"),
      end: new Date("2024-12-12T17:00:00")
    },
    location: "Convention Center",
    organiser_type: "Alumni",
    organiser_name: "David Martin",
    capacity: 500,
    no_of_registered_attendees: 200,
    speakers: [
      { name: "Dr. Alice Brown", bio: "Tech Industry Leader" },
      { name: "John Smith", bio: "CTO at Innovate Corp." }
    ],
    price: 1500,
    registration_deadline: new Date("2024-12-05"),
    image: "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Global Tech Summit 2024",
    description: "A summit gathering tech leaders from around the world to discuss future trends.",
    type: "Conference",
    date: {
      start: new Date("2024-12-15T09:00:00"),
      end: new Date("2024-12-17T17:00:00")
    },
    location: "Grand Hall",
    organiser_type: "Faculty",
    organiser_name: "Dr. Sarah Lee",
    capacity: 600,
    no_of_registered_attendees: 250,
    speakers: [
      { name: "Steve Jobs", bio: "Visionary Entrepreneur" },
      { name: "Sheryl Sandberg", bio: "Former COO of Facebook" }
    ],
    price: 2000,
    registration_deadline: new Date("2024-12-10"),
    image: "https://images.pexels.com/photos/761543/pexels-photo-761543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Future of AI Conference",
    description: "A conference dedicated to exploring the future and ethics of AI.",
    type: "Conference",
    date: {
      start: new Date("2024-12-20T09:00:00"),
      end: new Date("2024-12-22T17:00:00")
    },
    location: "Innovation Center",
    organiser_type: "Alumni",
    organiser_name: "Linda Walker",
    capacity: 400,
    no_of_registered_attendees: 150,
    speakers: [
      { name: "Dr. James Cameron", bio: "AI Ethicist" },
      { name: "Lisa Frank", bio: "Data Privacy Advocate" }
    ],
    price: 1800,
    registration_deadline: new Date("2024-12-15"),
    image: "https://images.pexels.com/photos/167478/pexels-photo-167478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Cybersecurity Conference 2024",
    description: "A global conference focused on the latest in cybersecurity.",
    type: "Conference",
    date: {
      start: new Date("2025-01-10T09:00:00"),
      end: new Date("2025-01-12T17:00:00")
    },
    location: "Expo Center",
    organiser_type: "Faculty",
    organiser_name: "Dr. Mark King",
    capacity: 700,
    no_of_registered_attendees: 300,
    speakers: [
      { name: "Rachel Adams", bio: "Cybersecurity Expert" },
      { name: "Tom Hardy", bio: "Security Consultant" }
    ],
    price: 1600,
    registration_deadline: new Date("2025-01-05"),
    image: "https://images.pexels.com/photos/28976224/pexels-photo-28976224/free-photo-of-elegant-wedding-venue-entrance-with-floral-decoration.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
  {
    name: "Big Data Conference 2024",
    description: "A comprehensive conference on big data analytics and its applications.",
    type: "Conference",
    date: {
      start: new Date("2025-01-20T09:00:00"),
      end: new Date("2025-01-22T17:00:00")
    },
    location: "Hall B",
    organiser_type: "Alumni",
    organiser_name: "Sarah Thompson",
    capacity: 500,
    no_of_registered_attendees: 250,
    speakers: [
      { name: "John Doe", bio: "Big Data Specialist" },
      { name: "Mary Smith", bio: "Data Analyst" }
    ],
    price: 1700,
    registration_deadline: new Date("2025-01-15"),
    image: "https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    attendees: [],
  },
];



// Save the events to the database
const seedEvents = async () => {
  try {
    await Event.insertMany(eventData);
    console.log("Event data seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding event data:", error);
    mongoose.connection.close();
  }
  const events = await Event.find({});
console.log(events);
};


seedEvents();
