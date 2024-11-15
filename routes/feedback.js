const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const feedback = new Feedback({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;