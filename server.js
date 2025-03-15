const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/scrapgenius' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

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