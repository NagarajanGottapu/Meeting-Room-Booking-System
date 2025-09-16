const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_APP_PASSWORD) {
  throw new Error('Missing email credentials in .env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  const { title, startTime, endTime, roomName } = bookingDetails;

  const mailOptions = {
    from: `"Meeting Room Booking" <${process.env.EMAIL_USERNAME}>`,
    to: userEmail,
    subject: `Meeting Room Booking Confirmed: ${title}`,
    html: `
      <h2>Your booking is confirmed </h2>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Room:</strong> ${roomName}</p>
      <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
      <p><strong>End Time:</strong> ${new Date(endTime).toLocaleString()}</p>
      <p style="margin-top:10px;">Thank you for using our booking system!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', userEmail);
  } catch (err) {
    console.error('Failed to send confirmation email:', err.message);
    throw new Error('Email not sent');
  }
};

const sendCancellationNotification = async (userEmail, bookingDetails) => {
  const { title, startTime, roomName } = bookingDetails;

  const mailOptions = {
    from: `"Meeting Room Booking" <${process.env.EMAIL_USERNAME}>`,
    to: userEmail,
    subject: `Booking Cancelled: ${title}`,
    html: `
      <h2>Your booking has been cancelled</h2>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Room:</strong> ${roomName}</p>
      <p><strong>Original Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
      <p style="margin-top:10px;">Let us know if you have any questions.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent to:', userEmail);
  } catch (err) {
    console.error('Failed to send cancellation email:', err.message);
    throw new Error('Cancellation email not sent');
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationNotification
};
