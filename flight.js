const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 7004;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));

const FlightSchema = new mongoose.Schema({
  name: String,
  startingStop: String,
  endingStop: String,
  daysOfWeek: [String],
  // startingTime :String,
  // StopTime:String,
  inBetweenStops: [
    {
      name: String,
      arrivalTime: String,
      day1: Number,
      day: Number,
      exitTime: String,
    },
  ],
  fare: Number,
  Mobile1: Number, // Potential issue
  Mobile2: Number, // Potential issue
  combinations: [{
    from: String, // Potential issue
    to: String,   // Potential issue
  }],
  tripFares: Array,
});
// const FlightAdminModel = mongoose.model('FlightAdmin', FlightAdminSchema); 
const FlightModel = mongoose.model('Flight ', FlightSchema); 
// Add a connection event listener
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
app.get('/api/FlightDetails', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    console.log('Received request with from:', from, 'and to:', to);
    // Query the MongoDB collection for Flight details
    const FlightDetails = await FlightModel.find({
      'startingStop': from,
      'endingStop': to,
    });

    // Check if FlightDetails is empty or not found and handle accordingly
    if (!FlightDetails || FlightDetails.length === 0) {
        res.status(404).json({ error: `Flight details not found for combination: ${from} to ${to}` });

    } else {
      res.json(FlightDetails);
      console.log(FlightDetails);
    }
  } catch (error) {
    console.error('Error fetching Flight details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/addFlight', async (req, res) => {
  try {
    // Parse the request body to get the Flight data
    const FlightData = req.body;

    // Save the Flight data to your database (e.g., MongoDB)
    // Replace the following code with your database logic
    const savedFlight = await FlightModel.create(FlightData);

    res.status(201).json(savedFlight); // Respond with the saved Flight data
  } catch (error) {
    console.error('Error adding Flight:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// 1{/* Important   Flightes */}

// const FlightAdminSchema = new mongoose.Schema({
//   name:String,
//   Mobile:Number,
//   email:String,
//   Password:Number,
//   PIN : Number,}) 


 
// app.get('/api/Login_Flight_admin', async (req, res) => {
//   try {
//     console.log('hii iam underWater')
//     const { email, password, PIN } = req.query;
//     console.log('Received request with email:', email, 'to connect to the Database');
    
//     // Query the MongoDB collection for Flight details
//     const FlightDetails = await FlightAdminModel.find({
//       email: email,
//       password: password,
//       PIN:PIN
//     });

//     // Check if FlightDetails is empty or not found and handle accordingly
//     if (!FlightDetails || FlightDetails.length === 0) {
//       res.status(404).json({ error: 'Flight details not found for the provided credentials' });
//       console.log('sahi nahi ho rha h')
//     } else {
//       // Send the FlightDetails in the response
//       res.json(FlightDetails);
//       console.log(FlightDetails);
//     }
    
//   } catch (error) {
//     console.error('Error fetching Flight details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.get('/api/create_Flight_admin', async (req, res) => {
//   try {
//     const { email, password, PIN } = req.query;
//     console.log('Received request with email:', email, 'to connect to the Database');

//     // Query the MongoDB collection for Flight details
//     const FlightDetails = await FlightAdminModel.findOne({ email: email });
//     // console.log('Received email:', email);
//     // console.log('Received password:', password);
//     // console.log('Received PIN:', PIN);
//     console.log(FlightDetails.email)
//     // console.log('Stored password:', FlightDetails.Password);
//     // console.log('Stored PIN:', FlightDetails.PIN);
//     // console.log(FlightDetails)
//     // Check if FlightDetails is empty or not found and handle accordingly
//     if (FlightDetails) {
//       console.log('hii everyone');
//       res.json(FlightDetails);
//       if ( FlightDetails.Password ===FlightDetails.PIN) {
//         console.log('here')
//         // console.log(FlightDetails);
    
//     } else {
//       // Check if the provided password matches the stored password
//       console.log('error')
//       res.status(404).json({ error: 'User with provided email not found' });
//       }} else { 
//         console.log('where');
//         res.status(401).json({ error: 'Incorrect password or PIN' });
//       }
    
//   } catch (error) {
//     console.error('Error fetching Flight details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/api/create_Flight_admin', async (req, res) => {
//   try {
//     console.log('USe ')
//     const FlightAdmin = req.body;

//     const savedFlightAdmin = await FlightAdminModel.create(FlightAdmin);

//     res.status(201).json(savedFlightAdmin); // Respond with the saved Flight data
//   } catch (error) {
//     console.error('Error adding Flight:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });