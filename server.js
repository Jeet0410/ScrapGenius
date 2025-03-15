const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { SessionsClient } = require('@google-cloud/dialogflow'); // Updated import
require('dotenv').config();

const app = express();

// Middleware to disable caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve the uploads folder
app.set('view engine', 'ejs');

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/scrapgenius' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Dialogflow Setup
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  console.warn('Warning: GOOGLE_APPLICATION_CREDENTIALS environment variable not set. Using local fallback.');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = './config/scrapgenius-jpwb-newkey.json'; // Update with your JSON file path
}

let sessionClient;
try {
  sessionClient = new SessionsClient();
} catch (error) {
  console.error('Failed to initialize Dialogflow SessionsClient:', error);
  process.exit(1);
}

// Route to handle chatbot messages
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: 'Please provide a message.' });
  }

  const sessionId = req.session.id; // Unique session per user
  const sessionPath = sessionClient.projectAgentSessionPath('scrapgenius-jpwb', sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText || 'No response available.' });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).json({ reply: 'Sorry, something went wrong with the chatbot.' });
  }
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scrapgenius')
  .then((conn) => console.log('MongoDB connected to:', conn.connection.name))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const materialRoutes = require('./routes/materials');
const apiRoutes = require('./routes/api');

app.use('/', authRoutes);
app.use('/market', marketRoutes);
app.use('/materials', materialRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.render('index', { title: 'ScrapGenius - Home', session: req.session });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));