import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllPlaces, addPlace, updatePlace, deletePlace, getAllBookings, updateBooking } from '../api/travelApi';

const EMPTY_PLACE = { name_p: '', location: '', price: '', days: '', description: '', image_url: '', rating: '' };

const AdminPage = ({ setPage }) => {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('places');
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | place-object
  const [form, setForm] = useState(EMPTY_PLACE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) { setPage('home'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, bRes] = await Promise.all([getAllPlaces(), getAllBookings()]);
      setPlaces(pRes.data || []);
      setBookings(bRes.data || []);
    } catch {}
    setLoading(false);
  };

  const openAdd = () => { setForm(EMPTY_PLACE); setModal('add'); setError(''); };
  const openEdit = (p) => {
    setForm({ ...p, price: p.price?.toString(), days: p.days?.toString(), rating: p.rating?.toString() });
    setModal(p);
    setError('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = {
      ...form,
      price: parseInt(form.price) || 0,
      days: parseInt(form.days) || 0,
      rating: parseFloat(form.rating) || 0,
    };
    try {
      if (modal === 'add') {
        await addPlace(payload, user.role);
      } else {
        await updatePlace(modal.id_p, payload, user.role);
      }
      await loadAll();
      setModal(null);
    } catch { setError('Failed to save. Please try again.'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this destination permanently?')) return;
    try { await deletePlace(id, user.role); setPlaces((p) => p.filter((x) => x.id_p !== id)); }
    catch { alert('Delete failed.'); }
  };

  const changeStatus = async (booking, status) => {
    try {
      await updateBooking(booking.id_b, { ...booking, status });
      setBookings((prev) => prev.map((b) => b.id_b === booking.id_b ? { ...b, status } : b));
    } catch {}
  };

  const statusClass = (s) => {
    const v = s?.toUpperCase();
    if (v === 'CONFIRMED') return 'badge badge-confirmed';
    if (v === 'CANCELLED') return 'badge badge-cancelled';
    return 'badge badge-pending';
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: 32 }}>
          <h2 className="section-title">Admin <em>Panel</em></h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cream-dim)' }}>
            {places.length} destinations · {bookings.length} bookings
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'places' ? 'active' : ''}`} onClick={() => setTab('places')}>
            Destinations
          </button>
          <button className={`tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
            Bookings
          </button>
        </div>

        {/* ── Destinations Tab ── */}
        {tab === 'places' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Destination</button>
            </div>
            {loading ? (
              <div className="loading"><div className="spinner" />LOADING</div>
            ) : (
              <div className="table-wrap fade-in">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Location</th>
                      <th>Price</th><th>Days</th><th>Rating</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {places.map((p) => (
                      <tr key={p.id_p}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{p.id_p}</td>
                        <td style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: 17 }}>{p.name_p}</td>
                        <td>
                          <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                            📍 {p.location}
                          </span>
                        </td>
                        <td style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 18 }}>
                          ₹{p.price?.toLocaleString()}
                        </td>
                        <td>{p.days}d</td>
                        <td>
                          <span style={{ color: 'var(--gold)' }}>★</span> {p.rating?.toFixed(1)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => del(p.id_p)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Bookings Tab ── */}
        {tab === 'bookings' && (
          loading ? (
            <div className="loading"><div className="spinner" />LOADING</div>
          ) : bookings.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div><div>No bookings yet.</div></div>
          ) : (
            <div className="table-wrap fade-in">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>User ID</th><th>Place ID</th>
                    <th>Travel Date</th><th>Booked On</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id_b}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{b.id_b}</td>
                      <td>User #{b.user_id}</td>
                      <td>
                        <span style={{ color: 'var(--gold)' }}>Place #{b.place_id}</span>
                      </td>
                      <td>{b.travel_date || '—'}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{b.booking_date || '—'}</td>
                      <td><span className={statusClass(b.status)}>{b.status || 'PENDING'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {b.status?.toUpperCase() !== 'CONFIRMED' && (
                            <button className="btn btn-sm" style={{ background: 'rgba(74,140,96,0.2)', border: '1px solid #3a7050', color: '#6fd49a' }}
                              onClick={() => changeStatus(b, 'CONFIRMED')}>
                              ✓ Confirm
                            </button>
                          )}
                          {b.status?.toUpperCase() !== 'CANCELLED' && (
                            <button className="btn btn-danger btn-sm" onClick={() => changeStatus(b, 'CANCELLED')}>
                              ✕ Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── Place Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? 'Add Destination' : 'Edit Destination'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name_p} onChange={(e) => setForm({ ...form, name_p: e.target.value })} placeholder="Manali Valley" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Himachal Pradesh" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="15000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Days</label>
                  <input className="form-input" type="number" min="1" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} placeholder="5" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating (0–5)</label>
                  <input className="form-input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A breathtaking journey through…" style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Saving…' : modal === 'add' ? 'Add Destination →' : 'Save Changes →'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
