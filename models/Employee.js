const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  Age: String,
  mobile: Number,
  bookings: {
    buses: [{
      bus_id: String,
      source: String,
      destination: String,
      departure_date: String,
      seats_booked: Number,
      total_price: Number
    }],
    trains: [{
      train_id: String,
      source: String,
      destination: String,
      departure_date: String,
      seats_booked: Number,
      total_price: Number
    }],
    hotels: [{
      hotel_id: String,
      name: String,
      booking_id:Number,
      check_in_date: String,
      check_out_date: String,
      total_price: Number
    }],
    flights: [{
      flight_id: String,
      source: String,
      destination: String,
      departure_date: String,
      seats_booked: Number,
      total_price: Number
    }]
  }
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
