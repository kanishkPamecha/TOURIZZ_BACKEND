 const express = require('express');
 const mongoose = require('mongoose');
 const bodyParser = require('body-parser');
 const app = express();
 app.use(bodyParser.json());
 const cors = require('cors');
//   ...

 app.use(cors());


//   Connect to MongoDB (update the connection string)
mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));

//   Create MongoDB models (Assuming you have User and Hotel models)
 const User = mongoose.model('employees', {  email: String ,  bookings: [Object],});
 const Hotel = mongoose.model('Hotel', { name: String, email: String, bookings: Array })
 ;
//   Endpoint to handle successful payment
//   Endpoint to handle successful payment
 app.post('/api/successful-payment', async (req, res) => {
    // Endpoint to handle successful payment

     console.log('Successful Payment Endpoint Reached');
    
    
     try {
       const { userEmail, products, roomsData, startDate, endDate } = req.body;
       console.log('Request Body:', req.body);  
   console.log('hello');
    //   Find the user based on their email
     const user = await User.findOne({ email: userEmail });

     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }

    //   Update user bookings
     user.bookings.push({ products, roomsData, startDate, endDate });

    //   Save the updated user document
     await user.save();

    //   Update hotel bookings
     const hotel = await Hotel.findOne({ email: userEmail });

     if (!hotel) {
       return res.status(404).json({ error: 'Hotel not found' });
     }

    //   Update hotel bookings
     hotel.bookings.push({ products, roomsData, startDate, endDate });

    //   Save the updated hotel document
     await hotel.save();

     res.json({ message: 'Booking updated successfully!' });
   } catch (error) {
     console.error('Error handling successful payment:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });

 const PORT = process.env.PORT || 7001;app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});



 

 
 
 
//   Create MongoDB models
 const userSchema = new mongoose.Schema({
   email: String,
   bookings: {
     buses: [], 
     trains: [],
     hotels: [{ roomsData: String, startDate: String, endDate: String }],
     flights: []
   }
 });

 

 app.use(cors());

//   Endpoint to handle successful payment
 app.post('/api/successful-payment', async (req, res) => {
   console.log('Successful Payment Endpoint Reached');

   try {
     const { userEmail, products, roomsData, startDate, endDate } = req.body;
     console.log('Request Body:', req.body);

    //   Find the user based on their email
     console.log('Email to find:', userEmail);
     const user = await User.findOne({ email: { $regex: new RegExp('^' + userEmail + '$', 'i') } });
     console.log('Found user:', user);
    

     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }

    //   Update user bookings
     user.bookings.hotels.push({ roomsData, startDate, endDate });

    //   Save the updated user document
     await user.save();

     res.json({ message: 'Booking updated successfully!' });
   } catch (error) {
     console.error('Error handling successful payment:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });




// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require("cors");
// const axios = require('axios');  Import axios if not already imported

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

//  Create a mongoose schema for the user
// const userSchema = new mongoose.Schema({
//     name: String,
//     mobileNumber: { type: Number, unique: true },
//     email: { type: String, unique: true },
//     password: String,
//     hotels: [],
//     bookings: {
//         rooms: [{
//             date: [{
//                 type: String, date: Date,
//                 Email: String, Mobile: Number, Amount: Number,
//                 name: String, booking_id: Number,
//             }]
//         }]
//     },
//     Refund: [{
//         date: Date, bookid: String, Email: String, Mobile: Number, Amount: Number, Cancellation_Id: Number,
//     }],
//     Rēmaining: {
//         rooms: [{
//             date: [{
//                 type: String,
//                 nu: Number,
//             }]
//         }]
//     }
// });

//  Connect to MongoDB
// mongoose.connect('mongodb:127.0.0.1/hotel_booking', {
   
// });
// const User = mongoose.model('bookings', userSchema);

// app.get('/api/fetch_bookings', async (req, res) => {
//   try {
//       const bookings = await User.find({});
//       res.json(bookings);
//   } catch (error) {
//       console.error('GET Bookings Error:', error);
//       res.status(500).send('Internal Server Error');
//   }
// });



// app.post('/api/bookings/new', async (req, res) => {
//   const newBookingData = req.body;

//   try {
//        Use the create method and handle the result with async/await
//       const createdBooking = await User.create(newBookingData);
//       res.json(createdBooking);
//   } catch (error) {
//       console.error('POST Booking Error:', error);
//       res.status(500).send('Internal Server Error');
//   }
  
// });




// const PORT = process.env.PORT || 7001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
//  const express = require('express');
//  const mongoose = require('mongoose');
//  const bodyParser = require('body-parser');
//  const cors = require("cors");

//  const app = express();

//  app.use(cors());
//  app.use(bodyParser.json());

//   Create a mongoose schema for the user
//  const userSchema = new mongoose.Schema({
//    name: String,
//    mobileNumber: { type: Number, unique: true },
//    email: { type: String, unique: true },
//    password: String,
//    hotels: [],
//    bookings: {
//      rooms: [{
//        date: [{
//          type: String, date: Date,
//          Email: String, Mobile: Number, Amount: Number,
//          name: String, booking_id: Number,
//        }]
//      }]
//    },
//    Refund: [{
//      date: Date, bookid: String, Email: String, Mobile: Number, Amount: Number, Cancellation_Id: Number,
//    }],
//    Rēmaining: {
//      rooms: [{
//        date: [{
//          type: String,
//          nu: Number,
//        }]
//      }]
//    }
//  });

//   Connect to MongoDB
//  mongoose.connect('mongodb:127.0.0.1/hotel_booking', {

//  });

//  const User = mongoose.model('bookings', userSchema);

//  app.get('/api/fetch_bookings', async (req, res) => {
//    try {
//      const bookings = await User.find({});
//      res.json(bookings);
//    } catch (error) {
//      console.error('GET Bookings Error:', error);
//      res.status(500).send('Internal Server Error');
//    }
//  });

//  app.post('/api/bookings/new', async (req, res) => {
//    const newBookingData = req.body;

//    try {
//       Use the create method and handle the result with async/await
//      const createdBooking = await User.create(newBookingData);
//      res.json(createdBooking);
//    } catch (error) {
//      console.error('POST Booking Error:', error);
//      res.status(500).send('Internal Server Error');
//    }
//  });

//  const PORT = process.env.PORT || 7001;
//  app.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}`);
//  });
