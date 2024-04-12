const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));

// Define bus schema
const busSchema = new mongoose.Schema({
  name: String,
  startingStop: String,
  endingStop: String,
  daysOfWeek: [String],
  inBetweenStops: [{
    name: String,
    arrivalTime: String,
    day1: Number,
    day: Number,
    exitTime: String,
  }],
  fare: Number,
  Mobile1: String, // Storing mobile numbers as strings
  Mobile2: String,
  combinations: [{
    from: String,
    to: String,
    tripFares: Number,
  }],
  tripFares: Array,
});

// Define bus model
const BusModel = mongoose.model('Bus', busSchema);

// Define user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  pin: String,
  Buses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }],
  Bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  Price: Number,
});

// Define user model
const User = mongoose.model('User', userSchema);

// GET endpoint to fetch bus details
app.get('/api/busDetails', async (req, res) => {
  try {
    const { from, to } = req.query;
    console.log('Received request with from:', from, 'and to:', to);

    const busDetails = await BusModel.find({
      'combinations.from': from,
      'combinations.to': to,
    });

    if (!busDetails || busDetails.length === 0) {
      res.status(404).json({ error: `Bus details not found for combination: ${from} to ${to}` });
    } else {
      res.json(busDetails);
      console.log(busDetails);
    }
  } catch (error) {
    console.error('Error fetching bus details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to add a new bus
app.post('/api/addBus', async (req, res) => {
  try {
    const busData = req.body;

    const savedBus = await BusModel.create(busData);

    const email = 'xyzabc26111999@gmail.com'; // Corrected email format
   
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(404).json({ error: `Admin user not found with email: ${email}` });
    }

    if (!adminUser.Buses) {
      adminUser.Buses = [];
    }

    adminUser.Buses.push(savedBus);
    await adminUser.save();
    res.status(201).json(savedBus);
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
