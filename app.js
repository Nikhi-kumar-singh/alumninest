const express = require('express');
const path = require('path'); // Import the 'path' module to work with file paths
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const Student = require('./modals/studentschema.js');
const Alumni = require('./modals/alumnischema.js');
const Event = require('./modals/eventschema.js');
const Idea = require('./modals/idea.js');
const Job = require('./modals/job.js');
const User = require('./modals/userschema.js');
const {isLoggedIn} = require("./middleware.js");
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

const Group = require('./modals/chats/groupschema.js');
const expressLayouts = require('express-ejs-layouts');
const ejsMate = require("ejs-mate");
const { constrainedMemory } = require('process');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");




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


const sessionOption = {
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() +7*24*60*60*1000,
    maxAge7: 7*24*60*60*1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//home page route
app.get('/', (req, res)=>{
  res.render("home/homepage.ejs", {
    title:"Home",
    css:'<link rel="stylesheet" href="/css/style.css">',
    js: ''
  })
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
      const { first_name, last_name, email, username, password, phone_number, gender,college_name,student_id,profile_picture } = req.body;
      console.log(req.body);

     // Create new student instance
      const newStudent = new Student({
          name: { first_name:first_name,
          last_name: last_name },
          email: email,
          username:username,
          password: password,          
          phone_number: phone_number,
          gender: gender,
          college_name:college_name,
          student_id:student_id,
          profile_picture:profile_picture||undefined
      
      });

      
      const newUser = new User({
        email:email,
        username:username,
        type:'Student',
      })
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      // Save student to database
      await newStudent.save().then(()=>{
        console.log("data daved");
      });
      
      // Send success response
      req.flash("success", "New Student Registered!");
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
      const { first_name, last_name,username , email, password, phone_number, gender, graduation_year, degree, job_sector, alumni_id, college_name, profile_picture,linkedin } = req.body;

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
          username:username,
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

      const newUser = new User({
        email:email,
        username:username,
        type:'Alumni',
      })

  

      // Save the new alumni to the database
      await newAlumni.save().then((res)=>{
        console.log(res);
      }).catch((err)=>{
        console.log(err);
      });

      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      // Send a response to the client after successful registration
      req.flash("success", "New Alumni Registered!");
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
      const { first_name, last_name, email, username, password, phone_number, department, designation, profile_picture, linkedin } = req.body;

      // Create a new faculty instance
      const newFaculty = new Faculty({
          first_name: first_name,
          last_name: last_name,
          email: email,
          username:username,
          password: password,
          phone_number: phone_number,
          department: department,
          designation: designation,
          socialMedia: { // Sub-document for social media links
            linkedin:linkedin 
          },
          profile_picture:profile_picture||undefined 
      });

      
      const newUser = new User({
        email:email,
        username:username,
        type:'Faculty',
      })
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      // Save the faculty instance to the database
      await newFaculty.save();

      // Redirect to a success page or another route
      res.redirect('/'); // Adjust the redirect as necessary
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // Handle error appropriately
  }
});


//login
app.get('/login', (req, res)=>{
  res.render('login/login.ejs',  { 
    title: 'Login',
    css: '<link rel="stylesheet" href="/css/login.css">',
    js: ''  // Pass an empty string or a script tag)
});
});
app.post('/login', passport.authenticate('local', {failureRedirect:'/login', failureFlash:true}), async(req, res)=>{
  req.flash("success", "Logged in successfully!");
  console.log(req.user);
  res.redirect("/");
});

//logout
app.get("/logout", (req, res, next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/");
  });
});

// create event

app.get('/events/create', isLoggedIn, async(req, res)=>{
  res.render("register/event.ejs", { 
    title: 'Event Creation',
    css: '<link rel="stylesheet" href="/css/createevent.css">',
    js: ''  // Pass an empty string or a script tag)
  
 });
  console.log("success");
});

//event show route
app.get('/events', isLoggedIn, async (req, res) => {
  try {
    const events = await Event.find({}); // Fetch all events from the database
    console.log(events);
    res.render('events/showall.ejs', { events }); // Render 'eventPage.ejs' and pass the events data
  } catch (error) {
    res.status(500).send('Error fetching events: ' + error.message);
  }
});



//trials

app.get('/events2', isLoggedIn, async (req, res) => {
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


//group route

app.get('/group/register', isLoggedIn, async(req,res)=>{
  res.render('group/creategroup.ejs');
})

app.post('/group/create', async (req, res) => {
  const { groupName, description, createdById, createdByType, profilePhoto } = req.body;

  try {
      // Function to fetch user ObjectId based on user ID and type
      async function fetchUserObjectId(userId, userType) {
          let user;

          switch (userType) {
              case 'Alumni':
                  user = await Alumni.findOne({ userId: userId }); // Use userId passed to the function
                  break;
              case 'Student':
                  user = await Student.findOne({ userId: userId }); // Use userId passed to the function
                  break;
              case 'Faculty':
                  user = await Faculty.findOne({ userId: userId }); // Use userId passed to the function
                  break;
              default:
                  throw new Error('Invalid user type');
          }

          if (!user) {
              throw new Error(`${userType} not found with user ID: ${userId}`);
          }

          return user._id; // Return the ObjectId of the found user
      }

      // Fetch the user ObjectId
      const userObjectId = await fetchUserObjectId(createdById, createdByType); // Pass createdBy and createdByType
      console.log(Alumni.findById(userObjectId));

      // Create new group
      const newGroup = new Group({
          groupName: groupName, // Use the correct field name in the Group schema
          description: description,
          createdBy: userObjectId, // Use the fetched ObjectId
          createdByType: createdByType, // Correct the field name to store the type
          profilePhoto: profilePhoto,
      });

      // Save the group to the database
      await newGroup.save();
      return res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
      return res.status(500).json({ message: 'Error creating group', error: error.message });
  }
});


//show group
app.get('/groups', isLoggedIn,async(req, res)=>{

  const allGroup = await Group.find({});
  console.log(allGroup)
  res.render('group/showgroup', { allGroup })
})

//startup route
app.get('/startups/idea/register', isLoggedIn,async (req, res)=>{
  res.render('startup/register.ejs', { 
    title: 'Idea Registration',
    css: '<link rel="stylesheet" href="/css/registeridea.css">',
    js: ''  // Pass an empty string or a script tag
  });
})

app.post('/startups/idea/submit', isLoggedIn, async (req, res) => {
  try {
    // Destructure form data from req.body
    const { idea_title, description, impact, target_audience, expected_price, linkedin_profile, idea_pdf, video_explanation } = req.body;

    const newIdea = new Idea({
      idea_title:idea_title,
      description:description,
      impact:impact,
      target_audience:target_audience,
      expected_price: expected_price,
      linkedin_profile: linkedin_profile,
      idea_pdf:idea_pdf,        
      video_explanation:video_explanation
    });

    await newIdea.save();


    res.send('created'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Handle error appropriately
  }
});

app.get('/startups', isLoggedIn, async (req,res)=>{
  const allIdea = await Idea.find({});
  res.render('startup/showidea.ejs', { 
    title: 'Startups',
    css: '<link rel="stylesheet" href="/css/style.css">',
    js: '',
    allIdea
  });
})


//job portal

app.get('/jobportal/register', isLoggedIn, async(req, res)=>{
  res.render('jobportal/register.ejs', { 
    title: 'job registration',
    css: '<link rel="stylesheet" href="/css/jobregister.css">',
    js: ''
  });
})

app.post('/jobportal/register/submit', isLoggedIn, async(req, res)=>{
  try{const { job_title, description, company_name, last_registration_date, job_link } = req.body;
  const newJob = new Job({
    job_title:job_title,
    description:description,
    company_name:company_name,
    last_registration_date:last_registration_date,
    job_link:job_link
  });

  await newJob.save()
  console.log('saved');
  res.redirect('/jobportal');
}catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error'); // Handle error appropriately
}
})

app.get('/jobportal', isLoggedIn, async(req, res)=>{

  const allJob = await Job.find({});
  res.render('jobportal/showjob.ejs', { 
    title: 'Jobportal',
    css: '<link rel="stylesheet" href="/css/style.css">',
    js: '',
    allJob
  });
})


// Home route to render the chat page
app.get('/chat', (req, res) => {
  res.render('chat/chat.ejs');
});




io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for message events
  socket.on('sendMessage', (messageData) => {
      io.emit('receiveMessage', messageData);  // Broadcast message to all clients
  });

  // Listen for file upload events
  socket.on('uploadFile', (fileData) => {
      io.emit('receiveFile', fileData);  // Broadcast file to all clients
  });

  // Listen for poll creation events
  socket.on('createPoll', (pollData) => {
      io.emit('receivePoll', pollData);  // Broadcast poll to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

