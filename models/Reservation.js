const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  seatNumber: Number,
  starting: String,
  destination: String,
});

module.exports = mongoose.model('Reservation', reservationSchema);
