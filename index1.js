const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3001; // Choose a suitable port
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB (replace 'your_mongo_db_uri' with your actual MongoDB URI)
mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));
const db = mongoose.connection;

// Check if the connection is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for your data (assuming 'MyModel' as the model name)
const mySchema = new mongoose.Schema({
 userData:Array,

  // Define your schema here based on the structure of 'userData'
});

const MyModel = mongoose.model('MyModel', mySchema);
app.post('/api/saveData', async (req, res) => {
  const userData = req.body;

  try {
    const newData = new MyModel(userData);
    await newData.save();
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
