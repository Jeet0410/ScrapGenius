const express = require('express');
const Auction = require('../models/Auction');
const router = express.Router();

router.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;