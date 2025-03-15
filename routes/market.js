const express = require('express');
const Auction = require('../models/Auction');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' });
    res.render('market', { 
      title: 'Marketplace - ScrapGenius',
      session: req.session,
      auctions
    });
  } catch (error) {
    res.status(500).send('Error fetching auctions');
  }
});

module.exports = router;