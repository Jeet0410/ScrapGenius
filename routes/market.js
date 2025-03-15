const express = require('express');
const mongoose = require('mongoose');
const Auction = require('../models/Auction');
const router = express.Router();

// Clear Mongoose cache
mongoose.models = {};
mongoose.modelSchemas = {};

router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' });
    console.log('Fetched auctions:', JSON.stringify(auctions, null, 2)); // Detailed debug log
    res.render('market', { 
      title: 'Marketplace - ScrapGenius',
      session: req.session,
      auctions
    });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).send('Error fetching auctions');
  }
});

module.exports = router;