import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllBookings, getAllPlaces, updateBooking } from '../api/travelApi';

const statusClass = (s) => {
  const val = s?.toUpperCase();
  if (val === 'CONFIRMED') return 'badge badge-confirmed';
  if (val === 'CANCELLED') return 'badge badge-cancelled';
  return 'badge badge-pending';
};

const BookingsPage = ({ setPage }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!user) { setPage('auth'); return; }
    Promise.all([getAllBookings(), getAllPlaces()])
      .then(([bRes, pRes]) => {
        const userBookings = bRes.data.filter((b) => b.user_id === user.id_u);
        setBookings(userBookings);
        const placeMap = {};
        pRes.data.forEach((p) => { placeMap[p.id_p] = p; });
        setPlaces(placeMap);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const cancel = async (booking) => {
    setCancelling(booking.id_b);
    try {
      await updateBooking(booking.id_b, { ...booking, status: 'CANCELLED' });
      setBookings((prev) =>
        prev.map((b) => b.id_b === booking.id_b ? { ...b, status: 'CANCELLED' } : b)
      );
    } catch {}
    setCancelling(null);
  };

  if (!user) return null;

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">My <em>Bookings</em></h2>
          <button className="btn btn-primary btn-sm" onClick={() => setPage('home')}>
            + Book a Trip
          </button>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" />LOADING BOOKINGS</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">✈️</div>
            <div style={{ marginBottom: 24 }}>You haven't booked any trips yet.</div>
            <button className="btn btn-primary" onClick={() => setPage('home')}>Explore Destinations</button>
          </div>
        ) : (
          <div className="table-wrap fade-in">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Destination</th>
                  <th>Location</th>
                  <th>Travel Date</th>
                  <th>Booked On</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  const place = places[b.place_id];
                  return (
                    <tr key={b.id_b}>
                      <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i + 1}</td>
                      <td style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: 17 }}>
                        {place?.name_p || `Place #${b.place_id}`}
                      </td>
                      <td>
                        <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          📍 {place?.location || '—'}
                        </span>
                      </td>
                      <td>{b.travel_date || '—'}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{b.booking_date || '—'}</td>
                      <td style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 18 }}>
                        {place ? `₹${place.price?.toLocaleString()}` : '—'}
                      </td>
                      <td><span className={statusClass(b.status)}>{b.status || 'PENDING'}</span></td>
                      <td>
                        {b.status?.toUpperCase() !== 'CANCELLED' && (
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={cancelling === b.id_b}
                            onClick={() => cancel(b)}
                          >
                            {cancelling === b.id_b ? '…' : 'Cancel'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
