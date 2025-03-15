const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  minBid: { type: Number, required: true },
  currentBid: { type: Number },
  closingDate: { type: Date, required: true },
  status: { type: String, default: 'active' },
  country: { type: String } // New field
});

module.exports = mongoose.model('Auction', auctionSchema);