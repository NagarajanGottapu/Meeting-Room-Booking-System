const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const emailService = require('./emailService');
const moment = require('moment');

// Helper: check for booking conflicts
const checkForConflicts = async (roomId, startTime, endTime, excludeBookingId = null) => {
  const query = {
    roomId,
    status: 'active',
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflicts = await Booking.find(query);
  return conflicts.length > 0;
};

// Helper: validate time constraints
const validateBookingTime = (startTime, endTime) => {
  const start = moment(startTime);
  const end = moment(endTime);

  if (start.isBefore(moment())) {
    throw new Error('Cannot book for past time slots');
  }

  const durationMinutes = end.diff(start, 'minutes');
  if (durationMinutes < 30) throw new Error('Booking must be at least 30 minutes');
  if (durationMinutes > 240) throw new Error('Booking cannot exceed 4 hours');

  const startHour = start.hour();
  const endHour = end.hour();
  const endMin = end.minute();

  if (startHour < 9 || endHour > 18 || (endHour === 18 && endMin > 0)) {
    throw new Error('Bookings are only allowed between 9 AM and 6 PM');
  }

  if (!start.isSame(moment(), 'day')) {
    throw new Error('Bookings are only allowed for the current day');
  }

  return true;
};

exports.createBooking = async (bookingData) => {
  try {
    const user = await User.findById(bookingData.userId);
    if (!user) throw new Error('User not found');

    const room = await Room.findById(bookingData.roomId);
    if (!room) throw new Error('Room not found');

    validateBookingTime(bookingData.startTime, bookingData.endTime);

    if (bookingData.attendeeCount > room.capacity) {
      throw new Error(`Room capacity (${room.capacity}) exceeded`);
    }

    const hasConflicts = await checkForConflicts(
      bookingData.roomId,
      bookingData.startTime,
      bookingData.endTime
    );

    if (hasConflicts) {
      throw new Error('Room is already booked for this time slot');
    }

    const booking = new Booking({
      ...bookingData,
      userName: user.name,
      userEmail: user.email,
      roomName: room.name,
      date: moment(bookingData.startTime).startOf('day').toDate(),
      duration: moment(bookingData.endTime).diff(moment(bookingData.startTime), 'minutes')
    });

    await booking.save();

    // Send confirmation email
    await emailService.sendBookingConfirmation(user.email, booking);

    return booking;
  } catch (error) {
    throw new Error(`Error creating booking: ${error.message}`);
  }
};

exports.getBookingsByUser = async (userId) => {
  try {
    return await Booking.find({ userId, status: 'active' }).sort({ startTime: 1 });
  } catch (error) {
    throw new Error(`Error retrieving bookings: ${error.message}`);
  }
};

exports.getBookingsByRoom = async (roomId, date) => {
  try {
    const dateObj = date ? new Date(date) : new Date();
    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

    return await Booking.find({
      roomId,
      status: 'active',
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ startTime: 1 });
  } catch (error) {
    throw new Error(`Error retrieving room bookings: ${error.message}`);
  }
};

exports.getAllBookingsForDate = async (date) => {
  try {
    const dateObj = date ? new Date(date) : new Date();
    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

    return await Booking.find({
      status: 'active',
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ startTime: 1 });
  } catch (error) {
    throw new Error(`Error retrieving daily bookings: ${error.message}`);
  }
};

exports.cancelBooking = async (bookingId, userId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    if (booking.userId.toString() !== userId.toString()) {
      throw new Error('You can only cancel your own bookings');
    }

    booking.status = 'cancelled';
    await booking.save();

    await emailService.sendCancellationNotification(booking, booking.userEmail);

    return booking;
  } catch (error) {
    throw new Error(`Error cancelling booking: ${error.message}`);
  }
};
