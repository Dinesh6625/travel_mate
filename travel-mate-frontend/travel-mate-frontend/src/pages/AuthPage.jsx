import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/travelApi';

const AuthPage = ({ setPage }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ f_name_u: '', l_name_u: '', email: '', password: '', contact_number: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginUser(form.email, form.password);
        if (res.data) { login(res.data); setPage('home'); }
        else setError('Invalid email or password.');
      } else {
        const res = await registerUser(form);
        if (res.data) { login(res.data); setPage('home'); }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box slide-up">
        <div className="auth-logo">TravelMate</div>
        <p className="auth-tagline">
          {mode === 'login' ? 'Welcome back, explorer.' : 'Begin your journey today.'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" name="f_name_u" value={form.f_name_u}
                  onChange={handle} placeholder="Riya" required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" name="l_name_u" value={form.l_name_u}
                  onChange={handle} placeholder="Sharma" required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={form.email}
              onChange={handle} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password}
              onChange={handle} placeholder="••••••••" required />
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input className="form-input" name="contact_number" value={form.contact_number}
                  onChange={handle} placeholder="+91 9876543210" />
              </div>
              <div className="form-group">
                <label className="form-label">Register As</label>
                <select className="form-input filter-select" name="role" value={form.role} onChange={handle}>
                  <option value="USER">Traveller</option>
                  <option value="ADMIN">Admin / Agency</option>
                </select>
              </div>
            </>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); }}>Sign Up</button>
            </>
          ) : (
            <>Already a member?{' '}
              <button onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
