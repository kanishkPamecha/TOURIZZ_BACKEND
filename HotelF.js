const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
const shortid = require('shortid');

const multer = require('multer');
const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const bookingSchema = new mongoose.Schema({
  type: String,
  date: Date,
  Email: String,
  Mobile: Number,
  Amount: Number,
  name: String,
  booking_id: String,
});

const hotelSchema = new mongoose.Schema({
  hotelId: String,
  name: String,
  rooms: Array,
  Mobile1: Number,
  Mobile2: Number,
  latitude: Number,
  longitude: Number,
  email: String,
  country: String,
  state: String,
  city: String,
  images: Array,
  bookings: { type: Map, of: [bookingSchema], default: {} }, // Using Map for date-wise bookings
  Cancellation: {
    buses: [String],
    trains: [String],
    hotels: [String],
    flights: [String],
    Package: [String],
    others: [String]
  },
  Refund: {
    buses: [String],
    trains: [String],
    hotels: [String],
    flights: [String],
    Package: [String],
    others: [String]
  }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

// Define multer storage and upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'https://github.com/kanishkPamecha/TOURIZZ_BACKEND/tree/main/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route to handle hotel creation
app.post('/api/hotels', 
// upload.array('images', 5),
 async (req, res) => {
  try {
    const hotelData = req.body;
    // Generate hotelId
    hotelData.hotelId = shortid.generate();
    const hotel = await Hotel.create(hotelData);
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create hotel' });
  }
});

// Route to fetch all hotels
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve hotels' });
  }
});

// Route to fetch hotels by city
app.get('/api/hotels/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const hotels = await Hotel.find({ city: city });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve hotels' });
  }
});


app.post('/api/hotelRoom_bookings', async (req, res) => {
  const bookingData = req.body;

  try {
    const hotelId = bookingData.hotelId;
    const hotel = await Hotel.findOne({ hotelId });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const bookingDate = new Date(bookingData.date);
    const booking = {
      type: bookingData.type,
      date: bookingDate,
      Email: bookingData.Email,
      Mobile: bookingData.Mobile,
      Amount: bookingData.Amount,
      name: bookingData.name,
      booking_id: bookingData.booking_id,
    };

    if (!hotel.bookings.get(bookingDate.toDateString())) {
      hotel.bookings.set(bookingDate.toDateString(), [booking]);
    } else {
      hotel.bookings.get(bookingDate.toDateString()).push(booking);
    }

    await hotel.save();

    res.json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('POST Booking Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch hotel bookings by date
app.get('/api/hotel_bookings/:hotelId/:date', async (req, res) => {
  const { hotelId, date } = req.params;

  try {
    const hotel = await Hotel.findOne({ hotelId });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const bookingsForDate = hotel.bookings.get(new Date(date).toDateString());

    if (!bookingsForDate) {
      return res.json({ message: 'No bookings found for this date' });
    }

    res.json(bookingsForDate);
  } catch (error) {
    console.error('Fetch Bookings Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = Hotel;





























app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve bookings' });
  }
}); 
app.post('/api/bookings/:hotelId', async (req, res) => {
  const { hotelId } = req.params;
  try {
    const bookingData = req.body; // Assuming you have booking details in the request body

    // Create a new booking
    const booking = await Booking.create(bookingData);

    // Find the corresponding hotel and push the booking's ObjectId to its bookings array
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { bookings: booking._id } },
      { new: true }
    );

    res.json({ hotel, booking });
  } catch (err) {
    res.status(500).json({ error: 'Could not create booking' });
  }
});

app.get('/api/bookings/:hotelId', async (req, res) => {
  const { hotelId } = req.params;
  try {
    const hotel = await Hotel.findById(hotelId).populate('bookings');
    res.json(hotel.bookings);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve bookings' });
  }
});



// // User

// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const cors = require('cors');
// const path = require('path');
// const shortid = require('shortid');


// const multer = require('multer');
// const { Console } = require('console');
// const port = process.env.PORT || 5000;

// mongoose.connect('mongodb://127.0.0.1/hotel_booking', {

// });
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(cors());
// app.use(express.json());
// const bookingSchema = new mongoose.Schema({
//   customerName: String,
//   checkInDate: Date,
//   checkOutDate: Date,
// });
// const Booking = mongoose.model('Booking', bookingSchema);
// const hotelSchema = new mongoose.Schema({
//   hotelId: String, 
//   name: String,
//   rooms: Array,
//   Mobile1: Number,
//   Mobile2: Number,
//   latitude: Number,
//   longitude: Number,
//   email: String,
//   country: String,
//   state: String,
//   city: String,
//   images: Array,
//   bookings: { type: Array, default: [] },
//   Cancellation: {
//     buses: [String],
//     trains: [String],
//     hotels: [String],
//     flights: [String],
//     Package: [String],
//     others: [String]
//   },
//   Refund: {
//     buses: [String],
//     trains: [String],
//     hotels: [String],
//     flights: [String],
//     Package: [String],
//     others: [String]
//   }
// });


// const Hotel = mongoose.model('Hotel', hotelSchema);
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Specify the directory where the uploaded files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Assign a unique filename to each uploaded file
//   },
// });
// const upload = multer({ storage: storage });
app.post('/api/hotels', upload.array('images', 5), async (req, res) => {
  try {
    // const images = req.files.map((file) => file.filename);
    const hotelData = { ...req.body
      , images
    };
    console.log(hotelData.rooms);
    const roomsData = [];
    for (let i = 0; i < 2; i++) {
      const room = {
        type: hotelData[`rooms[${i}].type`],
        noOfRooms: parseInt(hotelData[`rooms[${i}].noOfRooms`]),
        Price: parseInt(hotelData[`rooms[${i}].price`])
      };
      roomsData.push(room);
    }
    hotelData.hotelId = shortid.generate();
    hotelData.rooms = roomsData;
console.log(hotelData);
      
    const hotel = await Hotel.create(hotelData);
    res.json(hotel);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create hotel' });
  }
});

app.get('/api/hotels/', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve hotels' });
  }
});
app.get('/api/hotels/:city', async (req, res) => {
  const city = req.params.city;
  console.log(city);
  try {
    const hotels = await Hotel.find({ city: city });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve hotels' });
  }
});
app.post('/api/hotelRoom_bookings', async (req, res) => {
  const bookingData = req.body;

  try {
    // Find the hotel by its ID
    const hotelId = bookingData.hotelId;
    const hotel = await Hotel.findOne({ hotelId });

    // Check if hotel exists
    if (!hotel) {
      console.log(`Hotel with ID ${hotelId} not found.`);
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Log the incoming booking request details
    console.log('Received new booking request:', bookingData);

    // Convert the date string to a Date object
    const bookingDate = new Date(bookingData.date);

    // Ensure that 'bookings' is defined before accessing it
    if (!hotel.bookings) hotel.bookings = { rooms: [] };
    if (!hotel.bookings.rooms) hotel.bookings.rooms = [];

// Push the new booking into the array for that date
// Push the new booking into the array for that date
hotel.bookings.push({
  [bookingData.date] : {
    type: bookingData.type,
    date: bookingData.date,
    Email: bookingData.Email,
    Mobile: bookingData.Mobile,
    Amount: bookingData.Amount,
    name: bookingData.name,
    booking_id: bookingData.booking_id,
  }
});

// Save the hotel document with the updated bookings
await hotel.save();

// Send the success response
console.log('Booking saved successfully.');
res.json({ message: 'Booking created successfully' });
} catch (error) {
    // Handle any errors
    console.error('POST Booking Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/hotelRoom_bookings', async (req, res) => {
  const bookingData = req.body;

  try {
    // Find the hotel by its ID
    const hotelId = bookingData.hotelId;
    const hotel = await Hotel.findOne({ hotelId });

    // Check if hotel exists
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Log the incoming booking request details
    console.log('Received new booking request:', bookingData);

    // Convert the date string to a Date object
    const bookingDate = new Date(bookingData.date);

    // Ensure that 'bookings' is defined before accessing it
    if (!hotel.bookings) hotel.bookings = {};

    // Check if bookings for the specific date already exist, if not, initialize it
    if (!hotel.bookings[bookingDate]) hotel.bookings[bookingDate] = [];

    // Push the new booking into the array for that date
    hotel.bookings[bookingDate].push({
      type: bookingData.type,
      date: bookingDate,
      Email: bookingData.Email,
      Mobile: bookingData.Mobile,
      Amount: bookingData.Amount,
      name: bookingData.name,
      booking_id: bookingData.booking_id,
    });

    await hotel.save();

    res.json({ message: 'Booking created successfully' });
  } catch (error) {
    // Handle any errors
    console.error('POST Booking Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
