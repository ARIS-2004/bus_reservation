const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    await sendWelcomeEmail(user);
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user data
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .populate('bookingHistory');
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;