const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Import and initialize Stripe with your secret key

const app = express();
const port = 7000;

app.use(bodyParser.json());
app.use(cors()); 

const sessionData = {};

app.post('/api/create-bus-session', async (req, res) => {
  try {
    const { selectedSeats,selectedSeatsLength, BusName, BusId,unitamount, Date } = req.body;
console.log(selectedSeatsLength);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Bus Reservation', // Replace with your product name
            },
            unit_amount:(unitamount|| 1000), // Replace with your product amount in cents
          },
          quantity:(selectedSeatsLength||5), // Quantity of selected seats
        },
      ],
      mode: 'payment',
      success_url: 'http://your-website.com/success', // Replace with your success URL
      cancel_url: 'http://your-website.com/cancel', // Replace with your cancel URL
    });



    res.json({ id: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
