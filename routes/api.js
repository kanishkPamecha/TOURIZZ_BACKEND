const express = require('express');
const router = express.Router(); // Initialize the router instance

const Reservation = require('../models/Reservation'); // Replace with your model

router.post('/reservations', async (req, res) => {
    try {
      const { seatNumber, starting, destination } = req.body;
      const newReservation = new Reservation({ seatNumber, starting, destination });
      await newReservation.save();
      res.status(201).json({ message: 'Reservation created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Example GET route to fetch reservations
  router.get('/reservations', async (req, res) => {
    try {
      const reservations = await Reservation.find();
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  module.exports = router;