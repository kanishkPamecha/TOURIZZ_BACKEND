// // server.js
// const express = require("express");
// const mongoose = require('mongoose');
// const cors = require("cors");
// const EmployeeModel = require('./models/Employee'); // Make sure to have your Employee model defined
// const bodyParser = require('body-parser');

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose.connect("mongodb://127.0.0.1:27017/employee");

// // Login endpoint
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Find user by email
//   // console.log('Received email for login:', email);
//   EmployeeModel.findOne({ email: email })
//     .then(user => {
//       if (user) {
//         // User found, check password
//         if (user.password === password)
//          {
//           res.json({ message: 'Success' });
//         } else {
//           res.json("The password is incorrect");
//         }
//       } else {
//         res.json("The email is not registered");
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });
// // 


// const PORT = process.env.PORT || 3001;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/your-database-name', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// const User = mongoose.model('User', {
//     email: String,
//     permission: String
// });

// const MongoClient = require('mongodb').MongoClient;

// app.post('/create_new_database', async (req, res) => {
//     try {
//         const email = req.body.email;
//         const url = 'mongodb://localhost:27017'; // MongoDB server URL
//         const dbName = `${email}_database`; // Database name based on email
//         const client = new MongoClient(url, { useUnifiedTopology: true });
        
//         await client.connect();
//         const db = client.db(dbName);

//         // Create collections, add permissions, and perform other setup as needed
        
//         res.status(201).json({ message: 'New database created successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred' });
//     } finally {
//         client.close();
//     }
// });

// // Inside your App component


// // JSX for rendering the "New" button and input field

// // 
// // Registration endpoint
// app.post('/register', (req, res) => {
//   const { name, email, password, mobileNumber } = req.body;

//   // Check if email already exists
//   EmployeeModel.findOne({ email: email })
//     .then(existingUser => {
//       if (existingUser) {
//         console.log('tu pehle bhi aya yha p hmko malum')
//         // alert('tu pehle bhi aya yha p hmko malum')
//         // Email already exists, respond with an error message
//         res.status(400).json({ error: 'Email already exists' });
//         console.log(error);
//       } else {
//         // Email does not exist, create a new user
//         const newUser = new EmployeeModel({
//           name: name,
//           email: email,
//           password: password,
//           mobile: mobileNumber
//         });

//         // Save the new user to the database
//         newUser.save()
//           .then(savedUser => {
//             res.json({ message: 'User registered successfully' });
//           })
//           .catch(error => {
//             console.error('Error saving user:', error);
//             res.status(500).json({ error: 'Internal server error' });
//           });
//       }
//     })
//     .catch(error => {
//       console.error('Error checking email:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });


// app.listen(3001, () => {
//   console.log("Server is running");
// });
