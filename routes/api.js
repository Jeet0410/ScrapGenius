const express = require('express');
const Auction = require('../models/Auction');
const router = express.Router();

router.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auctions' });
  }
});

router.post('/bid', async (req, res) => {
  const { auctionId, amount } = req.body;
  try {
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.currentBid >= amount) {
      return res.status(400).json({ error: 'Invalid bid' });
    }
    auction.currentBid = amount;
    await auction.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;