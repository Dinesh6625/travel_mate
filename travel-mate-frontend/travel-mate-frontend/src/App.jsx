import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import ReviewsPage from './pages/ReviewsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    padding: '40px 0',
    marginTop: 80,
    textAlign: 'center',
    color: 'var(--muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.1em',
  }}>
    <div className="container">
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: 'var(--gold)', marginBottom: 8 }}>
        TravelMate
      </div>
      <div>© {new Date().getFullYear()} TravelMate · All rights reserved</div>
    </div>
  </footer>
);

const AppContent = () => {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'auth':     return <AuthPage setPage={setPage} />;
      case 'home':     return <HomePage setPage={setPage} />;
      case 'bookings': return <BookingsPage setPage={setPage} />;
      case 'reviews':  return <ReviewsPage setPage={setPage} />;
      case 'admin':    return <AdminPage setPage={setPage} />;
      case 'profile':  return <ProfilePage setPage={setPage} />;
      default:         return <HomePage setPage={setPage} />;
    }
  };

  const noNav = page === 'auth';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!noNav && <Navbar page={page} setPage={setPage} />}
      <main style={{ flex: 1 }}>{renderPage()}</main>
      {!noNav && <Footer />}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
