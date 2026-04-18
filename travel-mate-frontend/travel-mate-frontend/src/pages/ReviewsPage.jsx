import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllReviews, getAllPlaces, addReview } from '../api/travelApi';

const Stars = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange && onChange(n)}
        style={{
          background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default',
          fontSize: 24, color: n <= value ? 'var(--gold)' : 'var(--muted)',
          transition: 'color 0.15s', padding: '0 2px',
        }}
      >★</button>
    ))}
  </div>
);

const ReviewsPage = ({ setPage }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [places, setPlaces] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ place_id: '', comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([getAllReviews(), getAllPlaces()])
      .then(([rRes, pRes]) => {
        setReviews(rRes.data || []);
        const map = {};
        pRes.data.forEach((p) => { map[p.id_p] = p; });
        setPlaces(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.place_id) { setError('Please select a destination.'); return; }
    if (!form.comment.trim()) { setError('Please write a comment.'); return; }
    setSubmitting(true); setError('');
    try {
      await addReview({ ...form, user_id: user.id_u, place_id: parseInt(form.place_id) });
      setSuccess(true);
      setForm({ place_id: '', comment: '', rating: 5 });
      load();
      setTimeout(() => { setSuccess(false); setShowForm(false); }, 2000);
    } catch { setError('Could not submit review.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Traveller <em>Reviews</em></h2>
          {user && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? '× Close' : '+ Write Review'}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showForm && user && (
          <div className="card fade-in" style={{ padding: 32, marginBottom: 40, maxWidth: 560 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 24 }}>
              Share Your Experience
            </h3>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">Review submitted! Thank you. ✓</div>}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <select
                  className="form-input filter-select"
                  value={form.place_id}
                  onChange={(e) => setForm({ ...form, place_id: e.target.value })}
                  required
                >
                  <option value="">Select a destination…</option>
                  {Object.values(places).map((p) => (
                    <option key={p.id_p} value={p.id_p}>{p.name_p} — {p.location}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Describe your experience…"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review →'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="loading"><div className="spinner" />LOADING REVIEWS</div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💬</div>
            <div>No reviews yet. Be the first to share your experience!</div>
          </div>
        ) : (
          <div className="grid-2 fade-in">
            {reviews.map((r) => (
              <div className="card review-card" key={r.id}>
                <div className="review-meta">
                  <span className="review-user">
                    {places[r.place_id]?.name_p || `Destination #${r.place_id}`}
                  </span>
                  <Stars value={Math.round(r.rating)} />
                </div>
                <p className="review-comment">"{r.comment}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    📍 {places[r.place_id]?.location || '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)' }}>
                    User #{r.user_id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="btn btn-outline" onClick={() => setPage('auth')}>
              Sign in to write a review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
