const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail: (user) => {
    return sendEmail(
      user.email,
      'Welcome to BusGo',
      `<h1>Welcome ${user.name}!</h1>
      <p>Thank you for registering with BusGo. Start booking your bus tickets today!</p>`
    );
  },
  
  sendBookingConfirmation: (booking, user, schedule) => {
    return sendEmail(
      user.email,
      'Booking Confirmation - BusGo',
      `<h1>Booking Confirmed!</h1>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
        <h2>Booking Details</h2>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Route:</strong> ${schedule.route}</p>
        <p><strong>Date:</strong> ${schedule.date}</p>
        <p><strong>Departure:</strong> ${schedule.departure}</p>
        <p><strong>Arrival:</strong> ${schedule.arrival}</p>
        <p><strong>Seat Number:</strong> ${booking.seatNumber}</p>
        <p><strong>Amount Paid:</strong> $${booking.amount}</p>
      </div>`
    );
  },
  
  sendPaymentConfirmation: (booking, user, paymentId) => {
    return sendEmail(
      user.email,
      'Payment Confirmation - BusGo',
      `<h1>Payment Successful!</h1>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
        <h2>Payment Details</h2>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Amount Paid:</strong> $${booking.amount}</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p>Thank you for choosing BusGo!</p>
      </div>`
    );
  }
};