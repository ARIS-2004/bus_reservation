const express = require('express');
const Booking = require('../models/Booking');
const BusSchedule = require('../models/BusSchedule');
const auth = require('../middleware/auth');
const { sendBookingConfirmation } = require('../utils/emailService');

const router = express.Router();

// Search buses
router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const schedules = await BusSchedule.find({
      'route.from': from,
      'route.to': to,
      date: new Date(date)
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seat availability
router.get('/seats/:scheduleId', async (req, res) => {
  try {
    const schedule = await BusSchedule.findById(req.params.scheduleId);
    const bookings = await Booking.find({ 
      busSchedule: req.params.scheduleId,
      status: { $ne: 'cancelled' }
    });
    const bookedSeats = bookings.map(b => b.seatNumber);
    res.json({ 
      totalSeats: 40,
      bookedSeats,
      availableSeats: schedule.availableSeats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/book', auth, async (req, res) => {
  try {
    const { scheduleId, seatNumber } = req.body;
    
    // Check if seat is already booked
    const existingBooking = await Booking.findOne({
      busSchedule: scheduleId,
      seatNumber,
      status: { $ne: 'cancelled' }
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Seat already booked' });
    }

    const schedule = await BusSchedule.findById(scheduleId);
    const booking = new Booking({
      user: req.user._id,
      busSchedule: scheduleId,
      seatNumber,
      amount: schedule.price
    });
    
    await booking.save();
    await sendBookingConfirmation(booking, req.user, schedule);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;