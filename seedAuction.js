const mongoose = require('mongoose');
const Auction = require('./models/Auction');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scrapgenius', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleAuctions = [
  {
    title: 'PET - Lump',
    quantity: 30,
    unit: 'MT',
    minBid: 100,
    currentBid: 120,
    closingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    country: 'Poland',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1621570079812-2e0eebe24d70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
  },
  {
    title: 'PVC - Pipe Mix',
    quantity: 100,
    unit: 'MT',
    minBid: 50,
    currentBid: 60,
    closingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    country: 'United States',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
  },
  {
    title: 'LDPE - LLDPE Repo',
    quantity: 50,
    unit: 'MT',
    minBid: 80,
    closingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    country: 'Spain',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1591019479255-3f4f64d7b448?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
  },
  {
    title: 'HDPE - HDPE Drum Regrind',
    quantity: 200,
    unit: 'MT',
    minBid: 90,
    currentBid: 95,
    closingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    country: 'United Kingdom',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
  }
];

const seedAuctions = async () => {
  try {
    await connectDB();
    await Auction.deleteMany({}); // Clear existing auctions
    await Auction.insertMany(sampleAuctions);
    console.log('Sample auctions with images seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAuctions();