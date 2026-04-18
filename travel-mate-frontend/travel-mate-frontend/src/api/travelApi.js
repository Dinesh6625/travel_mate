import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ────────────────────────────────────────────────
export const registerUser = (userData) =>
  api.post('/register', userData);

export const loginUser = (email, password) =>
  api.post('/login', null, { params: { email, password } });

export const updateUser = (id, userData) =>
  api.put(`/user/${id}`, userData);

// ─── Places ──────────────────────────────────────────────
export const getAllPlaces = () =>
  api.get('/places');

export const addPlace = (placeData, role) =>
  api.post('/places', placeData, { params: { role } });

export const updatePlace = (id, placeData, role) =>
  api.put(`/places/${id}`, placeData, { params: { role } });

export const deletePlace = (id, role) =>
  api.delete(`/places/${id}`, { params: { role } });

// ─── Bookings ─────────────────────────────────────────────
export const bookPlace = (bookingData) =>
  api.post('/book', bookingData);

export const getAllBookings = () =>
  api.get('/bookings');

export const updateBooking = (id, bookingData) =>
  api.put(`/booking/${id}`, bookingData);

// ─── Reviews ──────────────────────────────────────────────
export const addReview = (reviewData) =>
  api.post('/review', reviewData);

export const getAllReviews = () =>
  api.get('/reviews');

export default api;
