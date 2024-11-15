const express = require('express');
const router = express.Router();

// Get bus location
router.get('/location/:bookingId', (req, res) => {
  // Mock data for bus location
  const location = {
    lat: 51.505 + (Math.random() * 0.01),
    lng: -0.09 + (Math.random() * 0.01)
  };
  res.json(location);
});

module.exports = router;