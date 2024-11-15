const mongoose = require('mongoose');

const busScheduleSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true
  },
  departure: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableSeats: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('BusSchedule', busScheduleSchema);