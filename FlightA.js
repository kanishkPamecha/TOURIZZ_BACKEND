const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const PORT = 4008;
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));


// Create a mongoose schema for the user
const userSchema = new mongoose.Schema({
  name: String,
  mobileNumber: { type: Number, unique: true },
  email: { type: String, unique: true },
  password: String,  
  hotels :[], 
  bookings: { 
    Flight:[{ date:[{
         
        type:String, 
          date:Date,
        email:String,
        Mobile:Number,
        Amount :Number ,
        name :String,
        booking_id :Number,
        Seat_Number:Number ,
    }]

        
    }]
  },
  Refund :[ {    date:Date , 
    bookid :String ,
    email:String,
    Mobile:Number,
    Amount :Number ,
    Cancellation_Id:Number,
  }],
  Rēmaining:{Bus:[{  date:[{
    type:String ,
    nu :Number, 
    }]
  }]}
});

const User = mongoose.model('User', userSchema);

app.post('/Flight_admin_login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', email, password);

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      console.log('Login successful');
      res.json({ message: 'Success' });
    } else {
      console.log('Login failed');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// app.get('/Flight_admin_login', async (req, res) => {

//   const {email , password } = req.body;
//   console.log('sending req' + email + password);
//   try {
//     const user = await User.findOne({ email, password });

//     if (user) {
//       console.log('succ')
//       res.json({ message: 'Success' });

//     } else {
//       console.log('fail')

//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

app.post('/create_Flight_admin', async (req, res) => {
    const { name, mobileNumber, email, password } = req.body;
    console.log("recieved req from " + email );

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ name, mobileNumber, email, password });
      await newUser.save();
      res.json({ message: 'Success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/Flight_bookings', async (req, res) => {
  const bookingData = req.body;

  try {
    const hotel = await Bus.findOne({ _id: bookingData.BusId });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Log the incoming request details
    console.log('Received new booking request:', bookingData);
    hotel.bookings.push(bookingData);
    await hotel.save();

    // Send the created booking as the response
    res.json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('POST Booking Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
