const express = require('express');
const cors = require('cors');
const app = express();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Import and initialize Stripe with your secret key
 
app.use(express.json());
app.use(cors());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { products, userEmail } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const lineItems = [];
        console.log(products?.roomsData?.length);
        const endDate = new Date(products?.endDate || today);
        const startDate = new Date(products?.startDate || today);

        const numberOfDays = ((Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1) || 1);

        console.log(numberOfDays);

        const noOfRooms = parseInt(products?.roomsData?.length || 1);
        console.log(noOfRooms);
        const unitAmount = Math.floor((products?.Price || 0) * (noOfRooms) * (numberOfDays) * 100);

        lineItems.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: products?.type || 'hayatt',
                },
                unit_amount: unitAmount,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            metadata: {
                endDate: products?.endDate || today,
                startDate: products?.startDate || today,
                roomsData: JSON.stringify(products?.roomsData || []),
            },
        });

        // Assuming `saveToDatabase` is an asynchronous function to save data to your database
        await saveToDatabase({
            sessionId: session.id,
            userEmail: userEmail,
            // Add other data you want to save to the database
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(7000, () => {
    console.log('Server Started');
});

