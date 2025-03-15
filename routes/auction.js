const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  currentBid: { type: Number },
  minBid: { type: Number, required: true },
  closingDate: { type: Date, required: true },
  country: { type: String },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300x200?text=Scrap+Image' } // Ensure this line exists
});

module.exports = mongoose.model('Auction', auctionSchema);