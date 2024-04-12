const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

router.post('/create_new_database', async (req, res) => {
    try {
        const email = req.body.email;
        const url = 'mongodb://localhost:27017';
        const dbName = `${email}_database`;
        const client = new MongoClient(url, { useUnifiedTopology: true });

        await client.connect();
        const db = client.db(dbName);
        res.status(201).json({ message: 'New database created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    } finally {
        client.close();
    }
});

module.exports = router;
