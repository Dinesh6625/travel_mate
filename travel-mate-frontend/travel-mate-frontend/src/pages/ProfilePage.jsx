import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../api/travelApi';

const ProfilePage = ({ setPage }) => {
  const { user, login, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    f_name_u: user?.f_name_u || '',
    l_name_u: user?.l_name_u || '',
    email: user?.email || '',
    contact_number: user?.contact_number || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) { setPage('auth'); return null; }

  const initials = `${user.f_name_u?.[0] || ''}${user.l_name_u?.[0] || ''}`.toUpperCase() || '?';

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);
    try {
      const res = await updateUser(user.id_u, { ...user, ...form });
      login(res.data);
      setSuccess(true);
      setEditing(false);
    } catch { setError('Update failed. Please try again.'); }
    setSaving(false);
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 680 }}>
        <h2 className="section-title" style={{ marginBottom: 32 }}>My <em>Profile</em></h2>

        {/* Avatar Header */}
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h2>{user.f_name_u} {user.l_name_u}</h2>
            <p>{user.email}</p>
            {user.contact_number && <p>{user.contact_number}</p>}
            <div className="profile-role">
              <span className="tag">{user.role || 'USER'}</span>
            </div>
          </div>
        </div>

        {success && <div className="alert alert-success" style={{ marginBottom: 24 }}>Profile updated successfully! ✓</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {/* Edit Form */}
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Account Details</h3>
            {!editing && (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>

          {editing ? (
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={form.f_name_u} onChange={(e) => setForm({ ...form, f_name_u: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={form.l_name_u} onChange={(e) => setForm({ ...form, l_name_u: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input className="form-input" value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes →'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                ['First Name', user.f_name_u],
                ['Last Name', user.l_name_u],
                ['Email', user.email],
                ['Contact', user.contact_number || '—'],
                ['Role', user.role],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="form-label">{label}</span>
                  <span style={{ color: 'var(--cream)', fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: 32, padding: 24, border: '1px solid rgba(192,68,58,0.3)', borderRadius: 'var(--radius-lg)', background: 'rgba(192,68,58,0.04)' }}>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--danger)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Sign Out
          </h4>
          <p style={{ color: 'var(--cream-dim)', fontSize: 15, marginBottom: 16 }}>
            You'll be logged out of your account.
          </p>
          <button className="btn btn-danger btn-sm" onClick={() => { logout(); setPage('home'); }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
