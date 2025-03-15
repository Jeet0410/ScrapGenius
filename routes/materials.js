const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Mock data for now; replace with real data from MongoDB later
  const materials = [
    { name: 'Copper', description: 'High-quality copper scrap', pricePerKg: 5.50 },
    { name: 'Aluminum', description: 'Lightweight aluminum scrap', pricePerKg: 1.80 },
    { name: 'Steel', description: 'Durable steel scrap', pricePerKg: 0.90 }
  ];
  res.render('materials', { 
    title: 'Materials - ScrapGenius',
    session: req.session,
    materials
  });
});

module.exports = router;