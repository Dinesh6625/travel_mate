import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ page, setPage }) => {
  const { user, logout, isAdmin } = useAuth();

  const navTo = (p) => (e) => {
    e.preventDefault();
    setPage(p);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <button className="navbar-logo" onClick={navTo('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          Travel<span>Mate</span>
        </button>

        <div className="navbar-links">
          <button className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={navTo('home')}>
            Explore
          </button>

          {user && (
            <button className={`nav-link ${page === 'bookings' ? 'active' : ''}`} onClick={navTo('bookings')}>
              My Bookings
            </button>
          )}

          {user && (
            <button className={`nav-link ${page === 'reviews' ? 'active' : ''}`} onClick={navTo('reviews')}>
              Reviews
            </button>
          )}

          {isAdmin && (
            <button className={`nav-link ${page === 'admin' ? 'active' : ''}`} onClick={navTo('admin')}>
              Admin
            </button>
          )}

          {user && (
            <button className={`nav-link ${page === 'profile' ? 'active' : ''}`} onClick={navTo('profile')}>
              Profile
            </button>
          )}

          {user ? (
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Sign Out
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={navTo('auth')}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
