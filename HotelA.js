// app.post('/hotel_admin_login', async (req, res) => {

//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email, password });

//     if (user) {
//       res.json({ message: 'Success' });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.post('/create_hotel_admin', async (req, res) => {
//     const { name, mobileNumber, email, password } = req.body;
//     console.log("recieved req from " + email );

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       res.status(400).json({ message: 'User already exists' });
//     } else {
//       const newUser = new User({ name, mobileNumber, email, password });
//       await newUser.save();
//       res.json({ message: 'Success' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const PORT = 3001;
app.use(cors());
app.use(bodyParser.json());

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
    rooms:[{ date:[{

        type:String,   date:Date,
        Email:String,Mobile:Number,Amount :Number ,
        name :String,booking_id :Number,
    }]

        
    }]
  },
  Refund :[ {    date:Date , bookid :String ,Email:String,Mobile:Number,Amount :Number ,Cancellation_Id:Number,
  }],
  Rēmaining:{rooms:[{  date:[{
    type:String ,
    nu :Number, 
    }]
  }]}
});
const hotelSchema = new mongoose.Schema({
  hotelId: String, 
  name: String,
  rooms:Array,
  Mobile1: Number,
  Mobile2: Number,
  latitude: Number,
  longitude: Number,
  email: String,
  country: String,
  state: String,
  city: String,
  images:Array,
  bookings: {
    hotels: [
      {
        date: [
          {
            type: String,
            Date: Date,
            Email: String,
            Mobile: Number,
            Amount: Number,
            name: String,
            booking_id: Number,
          },
        ],
      },
    ],
  },
 
  Cancellation : {buses: [],
    trains: [], hotels: [], flights: [],Package :[],others:[]
  },
  Refund : {buses: [],
    trains: [], hotels: [], flights: [],Package :[],others:[]
  },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

const User = mongoose.model('User', userSchema);





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
