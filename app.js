const express = require('express');
const path = require('path'); // Import the 'path' module to work with file paths
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const Student = require('./modals/studentschema.js');
const Alumni = require('./modals/alumnischema.js');
const Event = require('./modals/eventschema.js');
const expressLayouts = require('express-ejs-layouts');
const ejsMate = require("ejs-mate");
const { constrainedMemory } = require('process');


main().then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/alumninxt');

}


// Set the path to the 'views' folder (if it's in a custom location)
app.set('views', path.join(__dirname, 'views'));


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('layout', 'layouts/boilerplate'); // Set layout without "views" in the path
app.engine('ejs', ejsMate);



// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(expressLayouts);







//home page route
app.get('/', (req, res)=>{
  res.render("home/homepage.ejs")
})

app.get('/alumninext/register/student',(req, res)=>{
  res.render('register/student.ejs', { 
    title: 'Student Registration',
    css: '<link rel="stylesheet" href="/css/studentregistration.css">',
    js: ''
}); // Render the register.ejs file from the register folder
})

// POST request to handle student registration
app.post('/alumninext/register/student/submit', async (req, res) => {
  try {
      // Extract data from request body
      const { first_name, last_name, email, password, phone_number, gender,college_name,student_id,profile_picture } = req.body;
      console.log(req.body);

     // Create new student instance
      const newStudent = new Student({
          name: { first_name:first_name,
          last_name: last_name },
          email: email,
          password: password,          
          phone_number: phone_number,
          gender: gender,
          college_name:college_name,
          student_id:student_id,
          profile_picture:profile_picture||undefined
      
      });

      // Save student to database
      await newStudent.save().then(()=>{
        console.log("data daved");
      });
      
      // Send success response
      res.redirect("/");
  } catch (error) {
      // Handle errors (like duplicate email, validation errors)
      res.status(500).send('Error registering student: ' + error.message);
  }
});


//get request to for alumni registration
app.get('/alumninext/register/alumni', (req, res) => {
  res.render('register/alumni.ejs', { 
    title: 'Alumni Registration',
    css: '<link rel="stylesheet" href="/css/alumniregistration.css">',
    js: ''  // Pass an empty string or a script tag
  });
});


app.post('/alumninext/register/alumni/submit', async (req, res) => {
  try {
      // Extract data from the form submission (req.body)
      const { first_name, last_name, email, password, phone_number, gender, graduation_year, degree, job_sector, alumni_id, college_name, profile_picture,linkedin } = req.body;

      // Check if email already exists
      const existingAlumni = await Alumni.findOne({ email });
      if (existingAlumni) {
          return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new alumni instance
      const newAlumni = new Alumni({
          name: { first_name:first_name,
             last_name:last_name},
          email:email,
          password:password,  
          phone_number:phone_number,
          gender:gender,
          graduation_year:graduation_year,
          degree:degree,
          job_sector:job_sector,
          alumni_id:alumni_id,
          college_name:college_name,
          profile_picture:profile_picture||undefined,
          socialMedia: { // Sub-document for social media links
            linkedin:linkedin 
          },
      });

      // Save the new alumni to the database
      await newAlumni.save().then((res)=>{
        console.log(res);
      }).catch((err)=>{
        console.log(err);
      });

      // Send a response to the client after successful registration
      res.redirect('/');

  } catch (error) {
      console.error('Error registering alumni:', error);
      res.status(500).json({ error: 'Server error, please try again later.' });
  }
});


//faculty route registration

app.get('/faculty/register', (req, res) => {
  res.render('register/facultyregistration.ejs'); // Render the EJS template for the form
});

// Route to handle the form submission
app.post('/faculty/register/submit',  async (req, res) => {
  try {
      const { first_name, last_name, email, password, phone_number, department, designation, profile_picture, linkedin } = req.body;

      // Create a new faculty instance
      const newFaculty = new Faculty({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          phone_number: phone_number,
          department: department,
          designation: designation,
          socialMedia: { // Sub-document for social media links
            linkedin:linkedin 
          },
          profile_picture:profile_picture||undefined 
      });

      // Save the faculty instance to the database
      await newFaculty.save();

      // Redirect to a success page or another route
      res.redirect('/success'); // Adjust the redirect as necessary
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // Handle error appropriately
  }
});


//event show route
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find({}); // Fetch all events from the database
    console.log(events);
    res.render('events/showall.ejs', { events }); // Render 'eventPage.ejs' and pass the events data
  } catch (error) {
    res.status(500).send('Error fetching events: ' + error.message);
  }
});



//trials

app.get('/events2', async (req, res) => {
  try {
      const events = await Event.find();
      
      // Group events by category
      const groupedEvents = events.reduce((acc, event) => {
          const category = event.type;
          if (!acc[category]) {
              acc[category] = []; // Initialize the array for new category
          }
          acc[category].push(event); // Push event to the category array
          return acc;
      }, {});

      res.render('events/testshow.ejs', { groupedEvents }); // Pass the grouped events to the view
  } catch (error) {
      res.status(500).send({ message: 'Error retrieving events', error });
  }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

