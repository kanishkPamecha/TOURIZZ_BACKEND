const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const PORT = 4008;
app.use(cors());
app.use(bodyParser.json());
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
  buses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }], 


});

const User = mongoose.model('User', userSchema);
const bookingSchema = new mongoose.Schema({
  type: String,
  date: Date,
  Email: String,
  Mobile: Number,
  Amount: Number,
  name: String,
  booking_id: String,
  startCity:String,
  EndCity:String,
  
});

const BooK = mongoose.model('Bookings',bookingSchema);
const busSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  totalSeats: Number,
  startingStop: String,
  endingStop: String,
  daysOfWeek: [String], 
  combinations: [{
    from: String,
    to: String,
    inBetweenStops:Array,
    tripFares: Number,
  }],
  sequence: [{
    from: String,
    to: String,
    tripFares: Number,
    bookings: {  
      type: Map,
      of: {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        seatStatus: Boolean,
      },
      default: {},
    }
  }],
  inBetweenStops: [{
    name: String,
    arrivalTime: String,
    day1: Number,
    day: Number,
    exitTime: String,
  }],
  fare: Number,
  Mobile1: Number,
  Mobile2: Number,
  tripFares: [Number],
 
  refunds: [{
    date: Date,
    booking_id: String,
    email: String,
    mobileNumber: Number,
    amount: Number,
    cancellation_id: Number
  }]
});




const Bus = mongoose.model('Bus', busSchema);

// Bus admin login
app.post('/bus_admin_login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ message: 'Success' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/getBuses', async (req, res) => {
  const { adminId } = req.body;
  try {
    const user = await User.findById(adminId);
    if (user) {
      res.json({ buses: user.buses }); // Returning the buses property
    } else {
      res.json({ error: 'User Not Found' }); // Returning an object with an error property
    }
  } catch (error) {
    console.error(error); // Logging the error to the console
    res.status(500).json({ message: 'Internal Server Error' }); // Sending an error response
  }
});


// Create a bus admin
app.post('/create_bus_admin', async (req, res) => {
  const { name, mobileNumber, email, password } = req.body;
  console.log("Received request from " + email );

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


app.post('/api/addBus', async (req, res) => {
  const { adminId, name, totalSeats, startingStop,combinations, endingStop, daysOfWeek, inBetweenStops, fare, Mobile1, Mobile2, sequence, tripFares, refunds } = req.body;

  try {
    console.log('Received add bus request:', { adminId, name, totalSeats });

    const admin = await User.findById(adminId);
    if (!admin) {
      console.log('Admin not found');
      return res.status(404).json({ error: 'Admin not found' });
    }

    const newBus = new Bus({
      owner: adminId,
      name,
      totalSeats,
      startingStop,
      endingStop,
      daysOfWeek,
      inBetweenStops,
      Mobile1,
      Mobile2,
      combinations,
      sequence,
      tripFares,
      refunds
    });

    await newBus.save();

    admin.buses.push(newBus._id);
    await admin.save();

    console.log('Bus added successfully');
    res.status(201).json({ message: 'Bus added successfully', bus: newBus });
  } catch (error) {
    console.error('Add Bus Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Bus bookings
app.post('/api/bus_bookings', async (req, res) => {
  const bookingData = req.body;

  try {
    const busId = bookingData.busId;
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const bookingDate = new Date(bookingData.date);

    const newBooking = {
      date: new Date(bookingData.date),
      email: bookingData.email,
      mobileNumber: bookingData.mobileNumber,
      amount: bookingData.amount,
      name: bookingData.name,
      booking_id: bookingData.booking_id,
      seatNumber: bookingData.seatNumber
    };

   
    if (!bus.bookings.get(bookingDate.toDateString())) {
      bus.bookings.set(bookingDate.toDateString(), [newBooking ]);
    } else {
      bus.bookings.get(bookingDate.toDateString()).push(newBooking );
    }
  
    await bus.save();

    res.json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('POST Booking Error:', error);
    res.status(500).send('Internal Server Error');
  }
});








app.post('/api/bookSeats', async (req, res) => {
  const { busId, fromStop, toStop, date, seatsToBook } = req.body;
  try { 
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const newBooking = new BooK({ 
      busId,
      fromStop,toStop,
      bookingDate:date,
      seatsBooked: seatsToBook,
    });
    // Find the combination for the given fromStop and toStop
    const combination = bus.combinations.find(comb => comb.from === fromStop && comb.to === toStop);
    if (!combination) {
      return res.status(400).json({ error: 'Combination not found for the provided stops' });
    }

    // Check for intermediate stops
    const inBetweenStops = combination.inBetweenStops;
    
    console.log(inBetweenStops);
    if (inBetweenStops.length >= 0) {
      try {
        let bookingDate = new Date(date);
        let currentStop = fromStop;
        
       
        await newBooking.save();

        res.status(200).json({ message: 'Seats booked successfully', bookingId: newBooking._id });
        for (let i = 0; i < inBetweenStops.length; i++) {
          const nextStop = inBetweenStops[i];
               console.log(currentStop);       
               console.log(nextStop);
          
          // Find the sequence for the current segment
          const sequenceIndex = bus.sequence.findIndex(seq => seq.from === currentStop && seq.to === nextStop);
          if (sequenceIndex === -1) {
            return res.status(400).json({ error: `Sequence not found for the segment from ${currentStop} to ${nextStop}` });
          }
          
          const sequence = bus.sequence[sequenceIndex];
          
          // Find or create booking for the specified date
          let booking = sequence.bookings.get(bookingDate.toDateString());
          if (!booking) {
            // Initialize booking for the date with all seats set to false
            booking = Array(bus.totalSeats).fill(false);
            sequence.bookings.set(bookingDate.toDateString(), booking);
          }
          
         // Iterate over the specified seats to be booked

for (const seat of seatsToBook) {
  if (seat >= 0 && seat < bus.totalSeats) {
    if (!booking[seat]) {  // Check if the seat is available
      booking[seat] = true; // Mark seat as booked
    } else {
      return res.status(400).json({ error: `Seat ${seat} is already booked` });
    }
  } else {
    return res.status(400).json({ error: `Seat ${seat} is invalid` });
  }
}

          // Update the booking in the sequence
          sequence.bookings.set(bookingDate.toDateString(), booking);
          
          // Move to the next stop
          currentStop = nextStop;
        }
        const sequence = bus.sequence.find(seq => seq.from === currentStop && seq.to === toStop);
        if (!sequence) {
          return res.status(404).json({ error: 'Sequence not found' });
        }
        
        // Find or create booking for the specified date
        let booking = sequence.bookings.get(date);
        if (!booking) {
          // Initialize booking for the date with all seats set to false
          booking = Array(bus.totalSeats).fill(false);
          sequence.bookings.set(date, booking);
        }
        
      
        for (const seat of seatsToBook) {
          if (seat >= 0 && seat < bus.totalSeats) {
            if (!booking[seat]) {  // Check if the seat is available
              booking[seat] = true; // Mark seat as booked
            } else {
              return res.status(400).json({ error: `Seat ${seat} is already booked` });
            }
          } else {
            return res.status(400).json({ error: `Seat ${seat} is invalid` });
          }
        }
        
        // Update the booking in the sequence
        sequence.bookings.set(date, booking);
       
        try {
          
            const newBooking = new BooK({ name,userId, mobileNumber, email, password ,seatNumber,busId});
            await newBooking.save();
            
          }
         catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }



        // Save the changes to the bus document
        await bus.save();
        
        res.status(200).json({ message: 'Seats booked successfully' });
        
        // Save the changes to the bus document
           
      } catch (error) {
        console.error('Book Seats Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }
    
    
    
else {
  const sequence = bus.sequence.find(seq => seq.from === fromStop && seq.to === toStop);
if (!sequence) {
  return res.status(404).json({ error: 'Sequence not found' });
}

// Find or create booking for the specified date
let booking = sequence.bookings.get(date);
if (!booking) {
  // Initialize booking for the date with all seats set to false
  booking = Array(bus.totalSeats).fill(false);
  sequence.bookings.set(date, booking);
}

// Book the seats
for (const seat of seatsToBook) {
  if (seat >= 0 && seat < bus.totalSeats) {
    if (!booking[seat]) {  // Check if the seat is available
      booking[seat] = true; // Mark seat as booked
    } else {
      return res.status(400).json({ error: `Seat ${seat} is already booked` });
    }
  } else {
    return res.status(400).json({ error: `Seat ${seat} is invalid` });
  }
}

// Update the booking in the sequence
sequence.bookings.set(date, booking);

// Save the changes to the bus document
await bus.save();

res.status(200).json({ message: 'Seats booked successfully' });
}
    // Save the changes to the bus document
   
  } catch (error) {
    console.error('Book Seats Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/busDetails', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    console.log('Received request with from:', from, 'and to:', to);

    const busDetails = await Bus.find({
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

app.get('/api/getBookings/:busId', async (req, res) => {
  const { busId } = req.params;

  try {
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const bookings = [];
    for (const combination of bus.sequence) {
      for (const booking of combination.bookings) {
        if (booking.seats.some(seat => seat)) {
          bookings.push({
            from: combination.from,
            to: combination.to,
            date: booking.date,
            bookedSeats: booking.seats.map((seat, index) => seat ? index + 1 : null).filter(seat => seat !== null)
          });
        }
      }
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/api/checkAvailableSeats', async (req, res) => {
//   const { busId, fromStop, toStop, date } = req.body;
//   try {
//     const bus = await Bus.findById(busId);
//     if (!bus) {
//       return res.status(404).json({ error: 'Bus not found' });
//     }

//     let currentStop = fromStop;
//     let availableSeats1 = [];

//     // Check if there are intermediate stops
//     const combination = bus.combinations.find(comb => comb.from === fromStop && comb.to === toStop);
//     if (combination) {
//       const inBetweenStops = combination.inBetweenStops;
//       if (inBetweenStops.length > 0) {
//         for (const stop of inBetweenStops) {
//           const nextStop = stop; 
//           console.log(stop);
//           console.log(currentStop);
//           const sequence = bus.sequence.find(seq => seq.from === currentStop && seq.to === nextStop);
//           if (!sequence) {
//             return res.status(404).json({ error: `Sequence not found for the segment from ${currentStop} to ${nextStop}` });
//           }
//           const booking = sequence.bookings.get(date);
//           if (!booking || !booking.length) {
//             return res.status(404).json({ error: 'No booking information found for the specified date' });
//           }
//           availableSeats1 = availableSeats1.concat(booking.map((seat, index) => seat ? null : index + 1).filter(seat => seat !== null));
//           currentStop = nextStop;
//         }
//       }
//     }

//     // Check for the final segment from the last intermediate stop to the destination
//     const finalSequence = bus.sequence.find(seq => seq.from === currentStop && seq.to === toStop);
//     if (!finalSequence) {
//       return res.status(404).json({ error: 'Sequence not found' });
//     }
//     const finalBooking = finalSequence.bookings.get(date);
//     if (!finalBooking || !finalBooking.length) {
//       return res.status(404).json({ error: 'No booking information found for the specified date' });
//     }
//     availableSeats = availableSeats.concat(finalBooking.map((seat, index) => seat ? null : index + 1).filter(seat => seat !== null));

//     res.status(200).json({ availableSeats });
//   } catch (error) {
//     console.error('Check Available Seats Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post('/api/checkAvailableSeats', async (req, res) => {
  const { busId, fromStop, toStop, date } = req.body;
  try {
    let bookingDate = new Date(date);
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    let currentStop = fromStop;
    let availableSeatsAllSegments = [];

    // Check if there are intermediate stops
    const combination = bus.combinations.find(comb => comb.from === fromStop && comb.to === toStop);
    if (combination) {
      const inBetweenStops = combination.inBetweenStops;
      if (inBetweenStops.length > 0) {
        for (const stop of inBetweenStops) {
          const nextStop = stop; 
          const sequence = bus.sequence.find(seq => seq.from === currentStop && seq.to === nextStop);
          if (!sequence) {
            return res.status(404).json({ error: `Sequence not found for the segment from ${currentStop} to ${nextStop}` });
          }
          const booking = sequence.bookings.get(bookingDate.toDateString());
          if (!booking || !booking.length) {
            return res.status(404).json({ error: 'No booking information found for the specified date' });
          }
          const availableSeats = booking.map((seat, index) => seat ? null : index ).filter(seat => seat !== null);
          availableSeatsAllSegments.push(availableSeats);
          currentStop = nextStop;
        }
      }
    }

    // Check for the final segment from the last intermediate stop to the destination
    const finalSequence = bus.sequence.find(seq => seq.from === currentStop && seq.to === toStop);
    if (!finalSequence) {
      return res.status(404).json({ error: 'Sequence not found' });
    }
    const finalBooking = finalSequence.bookings.get(date);
    if (!finalBooking || !finalBooking.length) {
      return res.status(404).json({ error: 'No booking information found for the specified date' });
    }
    const finalAvailableSeats = finalBooking.map((seat, index) => seat ? null : index + 1).filter(seat => seat !== null);
    availableSeatsAllSegments.push(finalAvailableSeats);

    // Find common available seats among all segments
    let commonAvailableSeats = availableSeatsAllSegments.reduce((prev, curr) => {
      return prev.filter(seat => curr.includes(seat));
    });

    res.status(200).json({ commonAvailableSeats });
  } catch (error) {
    console.error('Check Available Seats Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/api/checkAvailableSeats', async (req, res) => {
//   const { busId, fromStop, toStop, date } = req.body;

//   try {
//     const bus = await Bus.findById(busId);
//     if (!bus) {
//       return res.status(404).json({ error: 'Bus not found' });
//     }

//     const combination = bus.sequence.find(comb => comb.from === fromStop && comb.to === toStop);
//     if (!combination) {
//       return res.status(404).json({ error: 'Combination not found' });
//     }

//     const booking = combination.bookings.find(b => b.date.getTime() === new Date(date).getTime());
//     if (!booking) {
//       return res.status(404).json({ error: 'No booking information found for the specified date' });
//     }

//     const availableSeats = booking.seats.map((seat, index) => seat ? null : index + 1).filter(seat => seat !== null);

//     res.status(200).json({ availableSeats });
//   } catch (error) {
//     console.error('Check Available Seats Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
