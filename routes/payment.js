const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendPaymentConfirmation } = require('../utils/emailService');

const router = express.Router();

// Create payment session
router.post('/create-session', async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Bus Ticket',
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;