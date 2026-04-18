import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllPlaces, bookPlace } from '../api/travelApi';

const StarRating = ({ rating }) => {
  const full = Math.round(rating);
  return (
    <span className="stars">
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span style={{ color: 'var(--cream-dim)', fontSize: 13, marginLeft: 6, fontFamily: 'var(--font-mono)' }}>
        {rating?.toFixed(1)}
      </span>
    </span>
  );
};

const PlaceholderImg = ({ name }) => (
  <div className="place-card-img-placeholder">
    <span style={{ fontSize: 36 }}>🏔️</span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {name?.slice(0, 12)}
    </span>
  </div>
);

const BookingModal = ({ place, user, onClose }) => {
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!travelDate) { setError('Please select a travel date.'); return; }
    setLoading(true);
    try {
      await bookPlace({
        user_id: user.id_u,
        place_id: place.id_p,
        booking_date: new Date().toISOString().split('T')[0],
        travel_date: travelDate,
        status: 'PENDING',
      });
      setSuccess(true);
    } catch {
      setError('Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="place-card-location">{place.location}</div>
            <h2 className="modal-title">{place.name_p}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              Booking confirmed! Your adventure awaits.
            </div>
            <button className="btn btn-outline" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px', background: 'rgba(201,147,74,0.06)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div>
                <div className="form-label">Package Price</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold)' }}>
                  ₹{place.price?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="form-label">Duration</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--cream)' }}>
                  {place.days} <span style={{ fontSize: 16, color: 'var(--cream-dim)' }}>days</span>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Select Travel Date</label>
              <input
                className="form-input"
                type="date"
                value={travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Booking…' : 'Confirm Booking →'}
              </button>
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const HomePage = ({ setPage }) => {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    getAllPlaces()
      .then((res) => setPlaces(res.data || []))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = places
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.name_p?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'days_asc') return a.days - b.days;
      if (sortBy === 'days_desc') return b.days - a.days;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <div className="hero-eyebrow">✦ Curated Destinations</div>
          <h1 className="hero-title">
            Find Your Next<br /><em>Great Escape</em>
          </h1>
          <p className="hero-sub">
            Browse handpicked tour packages, compare prices and durations, and book your perfect journey.
          </p>
          {!user && (
            <button className="btn btn-primary" onClick={() => setPage('auth')}>
              Get Started →
            </button>
          )}
        </div>
      </div>

      {/* Places */}
      <div className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {filtered.length} <em>Destinations</em>
            </h2>
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="search-bar" style={{ flex: 2 }}>
              <span style={{ color: 'var(--muted)' }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations or locations…"
              />
            </div>
            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort by…</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="days_asc">Duration: Shortest</option>
              <option value="days_desc">Duration: Longest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              LOADING DESTINATIONS
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🌍</div>
              <div>No destinations found.</div>
            </div>
          ) : (
            <div className="grid-3 fade-in">
              {filtered.map((place) => (
                <div className="card" key={place.id_p}>
                  {place.image_url ? (
                    <img
                      className="place-card-img"
                      src={place.image_url}
                      alt={place.name_p}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <PlaceholderImg name={place.name_p} />
                  )}
                  <div className="place-card-body">
                    <div className="place-card-location">📍 {place.location}</div>
                    <h3 className="place-card-name">{place.name_p}</h3>
                    <p className="place-card-desc">{place.description}</p>
                    <StarRating rating={place.rating} />
                    <div className="place-card-meta" style={{ marginTop: 16 }}>
                      <div>
                        <div className="place-card-price">
                          ₹{place.price?.toLocaleString()}
                          <small> /person</small>
                        </div>
                        <div className="place-card-days">{place.days} days package</div>
                      </div>
                      {user ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setBooking(place)}
                        >
                          Book Now
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setPage('auth')}
                        >
                          Sign In
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {booking && (
        <BookingModal
          place={booking}
          user={user}
          onClose={() => setBooking(null)}
        />
      )}
    </>
  );
};

export default HomePage;
