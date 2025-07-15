const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./models/Contact');
const Business = require('./models/Business');
const LogoSignature = require('./models/LogoSignature'); 
const Terms = require('./models/Terms');


const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Replace this with your actual MongoDB connection string
const mongoURI = 'mongodb+srv://yrohan645:GgJpAodKlDC7Q19Q@rohanapi.d7g3i2j.mongodb.net/?retryWrites=true&w=majority&appName=RohanApi';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const contacts = [];

// POST endpoint to save contact details
app.post('/contact-details', (req, res) => {
  const { mobileNumber, email } = req.body;

  // Basic validation
  if (!mobileNumber || !email) {
    return res.status(400).json({ error: 'Mobile number and email are required' });
  }

  // Save data (in-memory)
  contacts.push({ mobileNumber, email, createdAt: new Date() });

  return res.status(201).json({ message: 'Contact details saved successfully' });
});

// Endpoint to get all saved contacts (optional)
app.get('/contact-details', (req, res) => {
  res.json(contacts);
});

app.post('/business', async (req, res) => {
  try {
    const { businessName, shopAddress, pinCode, city, state, gstNumber } = req.body;

    if (!businessName || !shopAddress || !pinCode || !city || !state || !gstNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const business = new Business({
      businessName,
      shopAddress,
      pinCode,
      city,
      state,
      gstNumber
    });

    await business.save();

    res.status(201).json({ message: 'Business saved successfully', business });
  } catch (error) {
    console.error('❌ Save failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// GET: Fetch all business entries (optional)
app.get('/business', async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload-logo-signature', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), async (req, res) => {
  const files = req.files;

  if (!files || !files.logo || !files.signature) {
    return res.status(400).json({ error: 'Both logo and signature files are required' });
  }

  const LogoSignature = require('./models/LogoSignature');

  try {
    const newRecord = new LogoSignature({
      logoPath: `/uploads/${files.logo[0].filename}`,
      signaturePath: `/uploads/${files.signature[0].filename}`
    });

    await newRecord.save();

    res.status(200).json({
      message: 'Files uploaded and saved to DB successfully',
      logoPath: newRecord.logoPath,
      signaturePath: newRecord.signaturePath
    });
  } catch (error) {
    console.error('❌ DB save error:', error);
    res.status(500).json({ error: 'Failed to save file info to database' });
  }
});


app.get('/logo-signature', async (req, res) => {
  try {
    const records = await LogoSignature.find().sort({ uploadedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logo/signature records' });
  }
});

app.post('/terms', async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Terms content is required' });
  }

  try {
    const terms = new Terms({ content });
    await terms.save();
    res.status(201).json({ message: 'Terms saved successfully', terms });
  } catch (err) {
    console.error('❌ Error saving terms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Fetch latest terms (optional)
app.get('/terms', async (req, res) => {
  try {
    const latestTerms = await Terms.findOne().sort({ createdAt: -1 });
    res.json(latestTerms);
  } catch (err) {
    console.error('❌ Error fetching terms:', err);
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
