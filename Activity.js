const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));
const activitySchema = new mongoose.Schema({
  city: String,
  name: String,
  Rate : Number,
  lat:Number,
  lng:Number,
  startTimes:Array,endTimes:Array,
  selectedOption:String,
});
const Activity = mongoose.model('Activity', activitySchema);

// API routes
app.post('/api/activities', async (req, res) => {
  const { name, city,Rate,lat,lng, startTimes,endTimes,selectedOption} = req.body;
  try {
   let activity = await Activity.findOne({ name, city,Rate });
   if (!activity) {
    activity = new Activity({ name, city,Rate ,lat,lng,startTimes,endTimes,selectedOption});
    await activity.save();
} 
     res.status(201).json({ message: 'Activity added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }});



 // ...

app.get('/api/activities/:city', async (req, res) => {
  const { city } = req.params;
  console.log(city);
  try {
    const activities = await Activity.find({ city });

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for the specified city' });
    }

    res.status(200).json(activities);
    console.log(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ...

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  