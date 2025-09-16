import { useState, useCallback } from 'react';
import { bookingApi } from '../api/bookingApi';

export const useBookings = () => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserBookings = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const bookings = await bookingApi.getUserBookings(userId);
      setUserBookings(bookings);
      return bookings;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoomBookings = useCallback(async (roomId, date) => {
    try {
      setLoading(true);
      setError(null);
      
      const bookings = await bookingApi.getRoomBookings(roomId, date);
      return bookings;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch room bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newBooking = await bookingApi.createBooking(bookingData);
      return newBooking;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      await bookingApi.cancelBooking(bookingId, userId);
      // Update user bookings list after cancellation
      if (userBookings.length) {
        setUserBookings(userBookings.filter(booking => booking._id !== bookingId));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userBookings,
    loading,
    error,
    fetchUserBookings,
    fetchRoomBookings,
    createBooking,
    cancelBooking
  };
};