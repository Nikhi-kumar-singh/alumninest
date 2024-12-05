const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const Student = require('./modals/studentschema.js');
const Alumni = require('./modals/alumnischema.js');
const Faculty = require('./modals/facultyschema.js');

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
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const{ saveRedirectUrl } = require("./middleware.js");

main().then(() => {
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/alumninxt');
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/boilerplate');
app.engine('ejs', ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,  // Fixed maxAge typo
    httpOnly: true,
  },
};

// Session middleware should come before Passport initialization
app.use(session(sessionOption));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js with local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use(flash());

// Middleware to set local variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;  // This will now work correctly
  console.log(res.locals.currUser);
  next();
});


//home page route
app.get('/', (req, res)=>{
  res.render("home/homepage2.ejs", {
    title:"Home",
    css:'',
    js: ''
    // <link rel="stylesheet" href="/css/style.css">
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

      // Save student to database
      await newStudent.save().then(()=>{
        console.log("data daved");
      });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to Alumninest");
        res.redirect('/'); // Adjust the redirect as necessary
      })

  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/alumninext/register/student");
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
      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to Alumninest");
        res.redirect('/'); // Adjust the redirect as necessary
      })



  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/alumninext/register/alumni");
  }
});


//faculty route registration

app.get('/faculty/register', (req, res) => {
  res.render('register/faculty.ejs'); // Render the EJS template for the form
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

      // Save the faculty instance to the database
      await newFaculty.save();
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to Alumninest");
        res.redirect('/'); 
      }) 
  } catch (error) {
      req.flash("error", error.message);
      res.redirect("/faculty/register");
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
app.post('/login', saveRedirectUrl, passport.authenticate('local', {failureRedirect:'/login', failureFlash:true}), async(req, res)=>{
  req.flash("success", "Logged in successfully!");
  
 
  let redirectUrl = res.locals.redirectUrl || "/";
  res.redirect(redirectUrl);
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
 res.render('events/event.ejs',{
  css: '<link rel="stylesheet" href="/css/event.css">',
  js: ''  // Pass an empty string or a script tag)
});
});



//trials

app.get('/events/all', isLoggedIn, async (req, res) => {
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
      
      // Get the category from the query parameter
      const selectedCategory = req.query.category || '';

      console.log(groupedEvents);

      // Pass the grouped events and selected category to the view
      res.render('events/showall.ejs', {
         groupedEvents, 
         selectedCategory,
         css: '<link rel="stylesheet" href="/css/style.css">',
         js: ''  // Pass an empty string or a script tag)
        }); 
  } catch (error) {
      res.status(500).send({ message: 'Error retrieving events', error });
  }
});


//group route

app.get('/groups/register', isLoggedIn, async(req,res)=>{
  res.render('group/creategroup.ejs');
})

app.post('/groups/create', isLoggedIn, async (req, res) => {
  const { groupName, description, profilePhoto } = req.body;

  // Validate the incoming request
  if (!groupName || !description || !profilePhoto) {
      return res.status(400).json({ message: 'All fields (groupName, description, profilePhoto) are required.' });
  }

  try {
      const loggedUserName = req.user.username; // Fetch logged-in user
      const loggedUserType = req.user.type;

      // Function to fetch user ObjectId based on user ID and type
      async function fetchUserObjectId() {
          let user;

          switch (loggedUserType) {
              case 'Alumni':
                  user = await Alumni.findOne({ username: loggedUserName });
                  break;
              case 'Student':
                  user = await Student.findOne({ username: loggedUserName });
                  break;
              case 'Faculty':
                  user = await Faculty.findOne({ username: loggedUserName });
                  break;
              default:
                  throw new Error('Invalid user type');
          }

          if (!user) {
              throw new Error(`${loggedUserType} not found with username: ${loggedUserName}`);
          }

          return user._id; // Return the ObjectId of the found user
      }

      // Fetch the user ObjectId
      const userObjectId = await fetchUserObjectId();

      // Create new group
      const newGroup = new Group({
          groupName: groupName,
          description: description,
          createdBy: userObjectId,
          createdByType: loggedUserType, // Get user type from request
          profilePhoto: profilePhoto,
      });

      // Save the group to the database
      await newGroup.save();

      // Update the user document to add the new group
      const updateUserGroup = {
          $push: { group_joined: { group_id: newGroup._id, group_name: newGroup.groupName } }
      };

      switch (loggedUserType) {
          case 'Alumni':
              await Alumni.findByIdAndUpdate(userObjectId, updateUserGroup, { new: true });
              break;
          case 'Student':
              await Student.findByIdAndUpdate(userObjectId, updateUserGroup, { new: true });
              break;
          case 'Faculty':
              await Faculty.findByIdAndUpdate(userObjectId, updateUserGroup, { new: true });
              break;
          default:
              throw new Error('Invalid user type');
      }

      // Return success response
      //req.flash("success", "Group created successfully");
      res.redirect('/groups')
  } catch (error) {
      // Log the error for debugging
      console.error('Error creating group:', error);
      //req.flash("error",error.message);
      res.redirect('/groups')
      
  }
});




// //show group
// app.get('/groups', isLoggedIn,async(req, res)=>{

//   const allGroup = await Group.find({});
//   console.log(allGroup)
//   res.render('group/showgroup2', { allGroup })
// })


// Route to show groups (joined and not joined)
app.get('/groups', isLoggedIn, async (req, res) => {
  try {
    const user = req.user; // Fetch logged-in user
    let userDetails;

    // Fetch user details based on their type
    if (user.type === 'Alumni') {
      userDetails = await Alumni.findOne({ username: user.username }).populate('group_joined.group_id');
    } else if (user.type === 'Student') {
      userDetails = await Student.findOne({ username: user.username }).populate('group_joined.group_id');
    } else if (user.type === 'Faculty') {
      userDetails = await Faculty.findOne({ username: user.username }).populate('group_joined.group_id');
    }

    if (!userDetails) {
      return res.status(404).send("User not found");
    }

    // Get all groups
    const allGroups = await Group.find({});

    // Extract the list of joined group IDs from the user's details
    const joinedGroups = userDetails.group_joined.map(group => group.group_id);

    // Filter the groups into 'joined' and 'not joined'
    const notJoinedGroups = allGroups.filter(group => 
      !joinedGroups.some(joinedGroup => joinedGroup._id.equals(group._id))
    );
    console.log(notJoinedGroups);
    // res.send("hii");

    // Send the data to the frontend for rendering
    res.render('group/showgroup.ejs', { 
      
      joinedGroups,
      notJoinedGroups,
      css: '<link rel="stylesheet" href="/css/showgroup.css">',
      js: ''  // Pass an empty string or a script tag)
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching groups");
  }
});


app.post("/groups/join/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id); // Ensure group data is awaited
    const group_name = group.groupName; // Extract the group name
    const loggedUser = req.user.username; // Get logged-in user
    const userType = req.user.type;
    
    console.log(userType);
    console.log(id);
    console.log(group);
    console.log(loggedUser);

    let updatedUser;

    switch (userType) {
      case 'Alumni':
        updatedUser = await Alumni.findOneAndUpdate(
          { username: loggedUser }, // Use the actual variable here
          { $push: { group_joined: { group_id: id, group_name: group_name } } }, // Update
          { new: true, runValidators: true } // Options
        );
        break;

      case 'Student':
        updatedUser = await Student.findOneAndUpdate(
          { username: loggedUser }, // Use the actual variable here
          { $push: { group_joined: { group_id: id, group_name: group_name } } }, // Update
          { new: true, runValidators: true } // Options
        );
        break;

      case 'Faculty':
        updatedUser = await Faculty.findOneAndUpdate(
          { username: loggedUser }, // Use the actual variable here
          { $push: { group_joined: { group_id: id, group_name: group_name } } }, // Update
          { new: true, runValidators: true } // Options
        );
        break;

      default:
        throw new Error('Invalid user type');
    }

    if (updatedUser) {
      res.redirect('/groups')
    } else {
      res.status(404).send("User not found!");
    }

  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).send("An error occurred while joining the group.");
  }
});


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
  res.render('startup/showidea2.ejs', { 
    title: 'Startups',
    css: '<link rel="stylesheet" href="/css/showstartup.css">',
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
  res.render('jobportal/showjob2.ejs', { 
    title: 'Jobportal',
    css: '<link rel="stylesheet" href="/css/showjob.css">',
    js: '',
    allJob,
    n:1
  });
})


// Home route to render the chat page
// Route for rendering chat page for a group
app.get("/groups/chat/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const loggedUser = req.user.username;
    
    // Fetch group details using groupId from the database
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).send("Group not found!");
    }

    // Render chat page and pass group details to the template
    res.render("chat/chat.ejs", {
      groupId: group._id,
      groupName: group.groupName,
      groupProfile:group.profilePhoto,
      loggedUsername:loggedUser,
      title: 'Jobportal',
      css: '<link rel="stylesheet" href="/css/chat.css">',
      js: '',
    });

  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).send("An error occurred");
  }
});
app.get("/connections/chat", isLoggedIn, async (req, res) => {
  try {
    const { name } = req.query; // Use req.query to get the query parameters
    console.log(name);

    const loggedUser = req.user.username;

    // Render chat page and pass group details to the template
    res.render("connection/chat2.ejs", {
      groupName: name,  // groupName will be the name from the query
      loggedUsername: loggedUser,
      title: 'Connection',
      css: '<link rel="stylesheet" href="/css/chat.css">',
      js: '',
    });

  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).send("An error occurred");
  }
});



const handleStudentToAlumniConnection = async (studentUsername, alumniId) => {
  try {
    // Find the student by username
    const student = await Student.findOne({ username: studentUsername });
    if (!student) throw new Error('Student not found');

    // Find the alumni by username
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      throw new Error('Student not found');
    }

    console.log('Before:', student.connections_alumni);

    // Add the alumni to the student's connections
    student.connections_alumni.push({ alumni_id: alumni._id, status: 'pending' });
    student.markModified('connections_alumni');

    // Add the student to the alumni's connections
    alumni.connections_students.push({ student_id: student._id, status: 'pending' });
    alumni.markModified('connections_students');

    // Save both student and alumni
    await student.save();
    await alumni.save();

    console.log('After save:', student.connections_alumni);
  } catch (error) {
    console.error('Error creating Student-Alumni connection:', error.message);
  }
};

const handleStudentToFacultyConnection = async (studentUsername, facultyId) => {
  try {
    // Find the student by username
    const student = await Student.findOne({ username: studentUsername });
    if (!student) throw new Error('Student not found');

    // Find the faculty by username
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      throw new Error('Student not found');
    }

    console.log('Before:', student.connections_faculty);

    // Add the faculty to the student's connections
    student.connections_faculty.push({ faculty_id: faculty._id, status: 'pending' });
    student.markModified('connections_faculty');

    // Add the student to the faculty's connections
    faculty.connections_students.push({ student_id: student._id, status: 'pending' });
    faculty.markModified('connections_students');

    // Save both student and faculty
    await student.save();
    await faculty.save();

    console.log('After save:', student.connections_faculty);
  } catch (error) {
    console.error('Error creating Student-Faculty connection:', error.message);
  }
};

const handleAlumniToStudentConnection = async (alumniUsername, studentId) => {
  try {
    // Find the alumni by username
    const alumni = await Alumni.findOne({ username: alumniUsername });
    if (!alumni) {
      throw new Error('Alumni not found');
    }

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // Check if the connection already exists
    const existingStudentConnection = alumni.connections_students.find(
      connection => connection.student_id.toString() === student._id.toString()
    );
    if (existingStudentConnection) {
      throw new Error('Connection already exists');
    }

    // Add the student to the alumni's connections
    alumni.connections_students.push({ student_id: student._id, status: 'pending' });

    // Add the alumni to the student's connections
    student.connections_alumni.push({ alumni_id: alumni._id, status: 'pending' });
    student.markModified('connections_alumni');
    // Save the updated alumni and student documents
    await alumni.save();
    await student.save();

    console.log('Connection created successfully');
  } catch (error) {
    console.error('Error creating connection:', error.message);
  }
};

const handleAlumniToFacultyConnection = async (alumniUsername, facultyId) => {
  try {
    // Find Alumni by username
    const alumni = await Alumni.findOne({ username: alumniUsername });
    if (!alumni) throw new Error('Alumni not found');

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      throw new Error('Student not found');
    }

    console.log('Before:', alumni.connections_faculty);

    // Add Faculty to Alumni's connections
    alumni.connections_faculty.push({ faculty_id: faculty._id, status: 'pending' });
    alumni.markModified('connections_faculty');

    // Add Alumni to Faculty's connections
    faculty.connections_alumni.push({ alumni_id: alumni._id, status: 'pending' });
    faculty.markModified('connections_alumni');

    // Save both Alumni and Faculty updates
    await alumni.save();
    await faculty.save();

    console.log('After save:', alumni.connections_faculty);
  } catch (error) {
    console.error('Error handling alumni to faculty connection:', error.message);
  }
};

const handleFacultyToStudentConnection = async (facultyUsername, studentId) => {
  try {
    // Find Faculty by username
    const faculty = await Faculty.findOne({ username: facultyUsername });
    if (!faculty) throw new Error('Faculty not found');

    // Find Student by ID
     // Find the student by ID
     const student = await Student.findById(studentId);
     if (!student) {
       throw new Error('Student not found');
     }

    console.log('Before:', faculty.connections_students);

    // Add Student to Faculty's connections
    faculty.connections_students.push({ student_id: student._id, status: 'pending' });
    faculty.markModified('connections_students');

    // Add Faculty to Student's connections
    student.connections_faculty.push({ faculty_id: faculty._id, status: 'pending' });
    student.markModified('connections_faculty');

    // Save both Faculty and Student updates
    await faculty.save();
    await student.save();

    console.log('After save:', faculty.connections_students);
  } catch (error) {
    console.error('Error handling faculty to student connection:', error.message);
  }
};

const handleFacultyToAlumniConnection = async (facultyUsername, alumniId) => {
  try {
    // Find Faculty by username
    const faculty = await Faculty.findOne({ username: facultyUsername });
    if (!faculty) throw new Error('Faculty not found');

    // Find Alumni by username
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      throw new Error('Student not found');
    }

    console.log('Before:', faculty.connections_alumni);

    // Add Alumni to Faculty's connections
    faculty.connections_alumni.push({ alumni_id: alumni._id, status: 'pending' });
    faculty.markModified('connections_alumni');

    // Add Faculty to Alumni's connections
    alumni.connections_faculty.push({ faculty_id: faculty._id, status: 'pending' });
    alumni.markModified('connections_faculty');

    // Save both Faculty and Alumni updates
    await faculty.save();
    await alumni.save();

    console.log('After save:', faculty.connections_alumni);
  } catch (error) {
    console.error('Error handling faculty to alumni connection:', error.message);
  }
};


const updateConnectionForStudent = async (studentId, connectionId, status) => {
  const student = await Student.findById(studentId);
  const connection = student.connections_alumni.id(connectionId) || student.connections_faculty.id(connectionId);
  if (connection) {
    connection.status = status;
    await student.save();
  } else {
    throw new Error('Connection not found');
  }
};
const updateConnectionForAlumni = async (alumniId, connectionId, status) => {
  const alumni = await Alumni.findById(alumniId);
  const connection = alumni.connections_students.id(connectionId) || alumni.connections_faculty.id(connectionId);
  if (connection) {
    connection.status = status;
    await alumni.save();
  } else {
    throw new Error('Connection not found');
  }
};
const updateConnectionForFaculty = async (facultyId, connectionId, status) => {
  const faculty = await Faculty.findById(facultyId);
  const connection = faculty.connections_students.id(connectionId) || faculty.connections_alumni.id(connectionId);
  if (connection) {
    connection.status = status;
    await faculty.save();
  } else {
    throw new Error('Connection not found');
  }
};



// Get connections of the logged-in user by username
app.get('/connections',isLoggedIn, async (req, res) => {
  try {
    const username = req.user.username; // Get the logged-in user's username

    let connections = [];
    let allFaculty = [];
    let allStudents = [];
    let allAlumni = [];

    // Find the user based on the username
    const user = await User.findOne({ username }); // Assuming you have a User model

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' }); // Render error view if user not found
    }

    // Fetch connections based on user type
    if (user.type === 'Student') {
      const student = await Student.findOne({ username: username }) // Fetch student based on username
        .populate('connections_alumni.alumni_id', 'name email company job_title') // Populate alumni info
        .populate('connections_faculty.faculty_id', 'name email');  // Populate faculty info

      // Transform connections to a flat structure
      connections = [
        ...student.connections_alumni.map(conn => ({
          first_name: conn.alumni_id.name.first_name,
          last_name: conn.alumni_id.name.last_name,
          email: conn.alumni_id.email,
          company: conn.alumni_id.company,
          job_title: conn.alumni_id.job_title
        })),
        ...student.connections_faculty.map(conn => ({
          first_name: conn.faculty_id.name.first_name,
          last_name: conn.faculty_id.name.last_name,
          email: conn.faculty_id.email
        }))
      ];
    } else if (user.type === 'Alumni') {
      const alumni = await Alumni.findOne({ username: username }) // Fetch alumni based on username
        .populate('connections_students.student_id', 'name email') // Populate student info
        .populate('connections_faculty.faculty_id', 'name email'); // Populate faculty info

      // Transform connections to a flat structure
      connections = [
        ...alumni.connections_students.map(conn => ({
          first_name: conn.student_id.name.first_name,
          last_name: conn.student_id.name.last_name,
          email: conn.student_id.email
        })),
        ...alumni.connections_faculty.map(conn => ({
          first_name: conn.faculty_id.name.first_name,
          last_name: conn.faculty_id.name.last_name,
          email: conn.faculty_id.email
        }))
      ];
    } else if (user.type === 'Faculty') {
      const faculty = await Faculty.findOne({ username: username }) // Fetch faculty based on username
        .populate('connections_students.student_id', 'name email') // Populate student info
        .populate('connections_alumni.alumni_id', 'name email company job_title'); // Populate alumni info

      // Transform connections to a flat structure
      connections = [
        ...faculty.connections_students.map(conn => ({
          first_name: conn.student_id.name.first_name,
          last_name: conn.student_id.name.last_name,
          email: conn.student_id.email
        })),
        ...faculty.connections_alumni.map(conn => ({
          first_name: conn.alumni_id.name.first_name,
          last_name: conn.alumni_id.name.last_name,
          email: conn.alumni_id.email,
          company: conn.alumni_id.company,
          job_title: conn.alumni_id.job_title
        }))
      ];
    }

    // Fetch all faculty, students, and alumni
    allFaculty = await Faculty.find({}, 'name email'); // Retrieve all faculty
    allStudents = await Student.find({}, 'name email'); // Retrieve all students
    allAlumni = await Alumni.find({}, 'name email'); // Retrieve all alumni

    // Render the connections view and pass the connections data
    res.render('connection/connection2.ejs', { 
      connected: connections,      // All connections of the user
      allFaculty: allFaculty,      // All faculty for connecting
      allStudents: allStudents,    // All students for connecting
      allAlumni: allAlumni,
      css: '<link rel="stylesheet" href="/css/connection.css">',
      js: '',        // All alumni for connecting
    }); 
  } catch (error) {
    console.error(error);
    return res.status(500).render('error', { message: 'Error fetching connections' }); // Render error view on error
  }
});




app.post('/connections/:id',isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const targetId = id;
    const targetType = req.query.type;
    const loggedUser = req.user;
    console.log(targetId);

    if (!['Alumni', 'Student', 'Faculty'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Handling connections based on logged user's type
    if (loggedUser.type === 'Student') {
      if (targetType === 'Alumni') {
        await handleStudentToAlumniConnection(loggedUser.username, targetId);
      } else if (targetType === 'Faculty') {
        await handleStudentToFacultyConnection(loggedUser.username, targetId);
      }
    } else if (loggedUser.type === 'Alumni') {
      if (targetType === 'Student') {
        await handleAlumniToStudentConnection(loggedUser.username, targetId);
      } else if (targetType === 'Faculty') {
        await handleAlumniToFacultyConnection(loggedUser.username, targetId);
      }
    } else if (loggedUser.type === 'Faculty') {
      if (targetType === 'Student') {
        await handleFacultyToStudentConnection(loggedUser.username, targetId);
      } else if (targetType === 'Alumni') {
        await handleFacultyToAlumniConnection(loggedUser.username, targetId);
      }
    }

    res.redirect("/connections");
  } catch (error) {
    console.error(error);
    res.redirect('connections');
  }
});

app.put('/connections', async (req, res) => {
  try {
    const { connectionId, status } = req.body;  // 'connectionId' is the ID of the connection, 'status' can be 'connected' or 'rejected'
    const loggedUser = req.user;
    const username = loggedUser.username; // Access username from req.user

    // Update connection based on the logged user's type using username instead of _id
    if (loggedUser.type === 'Student') {
      const student = await Student.findOne({ username });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      await updateConnectionForStudent(student._id, connectionId, status);
    } else if (loggedUser.type === 'Alumni') {
      const alumni = await Alumni.findOne({ username });
      if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
      await updateConnectionForAlumni(alumni._id, connectionId, status);
    } else if (loggedUser.type === 'Faculty') {
      const faculty = await Faculty.findOne({ username });
      if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
      await updateConnectionForFaculty(faculty._id, connectionId, status);
    }

    return res.status(200).json({ message: 'Connection updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating connection' });
  }
});


  //alumni
  app.get('/alumnis' ,async(req, res)=>{
    const allAlumni = await Alumni.find({});
    res.render('alumni.ejs',{allAlumni});   
  })
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

