// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const PORT = 3001;

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

// mongoose.connect('mongodb://127.0.0.1:27017/admin', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const packageSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   img: String,
//   city:String,
//   // activities :Array,
// });

// const Package = mongoose.model('Package', packageSchema);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // This is where the images will be stored
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//   },
// });

// const upload = multer({ storage });

// app.get('/packages', async (req, res) => {
//   try {
//     const packages = await Package.find({});
//     res.json(packages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// // app.post('/packages', upload.single('img'), async (req, res) => {
// //   const { name, description,city,activities } = req.body;
// //   const imgPath = req.file.path;

// //   try {
// //     const newPackage = new Package({ name, description,city, activities,img: imgPath });
// //     await newPackage.save();
// //     res.status(201).json(newPackage);
// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // });
// app.post('/packages', upload.single('img'), async (req, res) => {
//   const { name, description, city, activities } = req.body;
//   const imgPath = req.file.path;

//   try {
//     const newPackage = new Package({ name, description, city, activities, img: imgPath });
//     await newPackage.save();
//     res.status(201).json(newPackage);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/packages', upload.single('img'), async (req, res) => {
//   const { name, description,activities ,city} = req.body;
//   const imgPath = req.file.path;

//   try {
//     const newPackage = new Package({ name, description,city,activities, img: imgPath });
//     await newPackage.save();
//     res.status(201).json(newPackage);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.use('/uploads', express.static('uploads')); // Serve uploaded images

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

mongoose.connect("mongodb+srv://xyzabc26111999:hpwuKPZUtezCESh2@cluster0.iazidap.mongodb.net/tourizz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(error => console.error("Error connecting to MongoDB:", error));

const packageSchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
  city: String,
  selectedHotel: Array,
  citiesData: Array,
  activities: Array,
  items: Array, // New field for items
});


const Package = mongoose.model('Package', packageSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'https://github.com/kanishkPamecha/TOURIZZ_BACkEND/tree/main/uploads/'); // This is where the images will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/addPackage', upload.single('img'), async (req, res) => {
  const { name, description, city, selectedHotel, items } = req.body;
  const imgPath = req.file ? req.file.path : '';

  try {
    const newPackage = new Package({
      name,
      description,
      city,
      selectedHotel,
      img: imgPath,
      items,
    });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use('/uploads', express.static('uploads')); // Serve uploaded images

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.post('/addPackage', upload.single('img'), async (req, res) => {
  const { name, description, city, selectedHotel, items } = req.body;
  const imgPath = req.file ? req.file.path : '';

  try {
    const newPackage = new Package({
      name,
      description,
      city,
      selectedHotel,
      img: imgPath,
      items,
    });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
