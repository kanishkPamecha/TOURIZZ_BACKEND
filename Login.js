const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");

const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));
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
app.post('/api/create-checkout-session', async (req, res) => {
  const { products, userEmail } = req.body;
  const lineItems = [];
  
  lineItems.push({
    price_data: {
      currency: 'inr',
      product_data: {
        name: products.type,
        roomsData: products.roomsData,
        endDate: products.endDate,
        startDate: products.startDate
      },
      unit_amount: products.Price * 100,
    },
    quantity: 1
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel'
  });

  EmployeeModel.findOne({ email: userEmail }, (err, user) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.bookings.hotels.push({
      hotel_id: products.hotel_id,
      name: products.hotel_name,
      check_in_date: products.startDate,
      check_out_date: products.endDate,
      total_price: products.Price
    });

    user.save((err, updatedUser) => {
      if (err) {
        console.error('Error saving user with booking:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ id: session.id });
    });
  });
});

app.get('/api/hotels', (req, res) => {
  res.json(hotels);
});

app.post('/register', (req, res) => {
  console.log('new Req');
  const { name, email, password, mobileNumber, Age } = req.body;
console.log(name ,  email,password ,mobileNumber ,Age);
  EmployeeModel.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        res.status(200).json({ error: 'Email already exists' });
      } else {
        const newUser = new EmployeeModel({
          name: name,
          email: email,
          password: password,
          Age: Age,mobile: mobileNumber,
          bookings: {buses: [{date:Date,busId:String,Date:Date,SeatNo:Number,bookingId:Number}],
            trains: [{TrainNumber:Number,Date:Date,Train_name:String,SeatNumber:String,bookingId:Number,pnrNumber:Number}], hotels: [{Flight_id:String,Date:Date,hotel_name:String,bookingId:Number}], flights: [{TrainNumber:Number,Date:Date,Flight_name:String,SeatNumber:String,bookingId:Number,pnrNumber:Number}],Package :[] ,others:[]
          },
          Cancellation : {buses: [],
            trains: [], hotels: [], flights: [],Package :[],others:[]
          },
          Refund : {buses: [],
            trains: [], hotels: [], flights: [],Package :[],others:[]
          },
        });

        newUser.save()
          .then(savedUser => {
            res.json({ message: 'User registered successfully' });
          })
          .catch(error => {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      }
    }
    )
    .catch(error => {
      console.error('Error checking email:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
}
);
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  console.log('Received email for login:', email);
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        console.log(password);
        console.log(user.password,user.email);
        // User found, check password
        if (user.password === password)
         {
          res.json({ message: 'Success' });
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("The email is not registered");
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
});


//   adding the booking details 

app.post('/api/User_bookings', async (req, res) => {
  try {
    const { hotelBookingData } = req.body;
    console.log(hotelBookingData);

    // Assuming 'email' is a field in hotelBookingData
    const employeeEmail = hotelBookingData.Email;

    // Find employee by email
    const employee = await EmployeeModel.findOne({ email: employeeEmail });

    if (!employee) {
      console.log('Employee not found for email:', employeeEmail);
      return res.status(404).json({ error: 'Employee not found' });
    }

    console.log('Employee found:', employee);

    // Assuming 'hotels' is an array field in the 'bookings' object
    employee.bookings.hotels.push(hotelBookingData);

    await employee.save();

    console.log('Hotel Booking saved for Employee:', employeeEmail);
    res.json({ message: 'Hotel Booking saved successfully' });
  } catch (error) {
    console.error('Error saving hotel booking:', error);
    res.status(500).send('Internal Server Error');
  }
});
const PORT = process.env.PORT || 3001;
// const PORT = process.env.PORT || 3003;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
