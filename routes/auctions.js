const express = require('express');
const Auction = require('../models/Auction');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' });
    res.render('auctions', { auctions, title: 'Auctions - ScrapGenius' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;