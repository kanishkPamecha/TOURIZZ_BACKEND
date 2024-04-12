const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Configure MongoDB
mongoose.connect('mongodb://127.0.0.1/hotel_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Hotel model
const Hotel = mongoose.model('Hotel', {
  name: String,
  rooms: [
    {
      type: String,
      number: Number,
      price: Number,
    },
  ],
});

// Define Booking model
const Booking = mongoose.model('Booking', {
  hotelId: mongoose.Schema.Types.ObjectId,
  roomId: mongoose.Schema.Types.ObjectId,
  checkInDate: Date,
  checkOutDate: Date,
  guestName: String,
});

app.use(express.json());

// Create a new hotel
app.post('/api/hotels', async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: 'Could not create hotel' });
  }
});

// Get all hotels
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve hotels' });
  }
});

// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Could not create booking' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve bookings' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
