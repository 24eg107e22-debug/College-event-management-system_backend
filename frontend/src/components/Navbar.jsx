import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'ORGANIZER') return '/organizer';
    return '/student';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo Branding */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px var(--primary-glow)'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                CampusConnect
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.15rem 0.45rem',
                borderRadius: '999px'
              }}>PRO</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Connect • Participate • Celebrate
            </div>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="navbar-links">
          <Link
            to="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/') ? '700' : '500',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            Home
          </Link>
          <Link
            to="/events"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/events') ? '700' : '500',
              color: isActive('/events') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            Browse Events
          </Link>
          <a
            href="/#about"
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            About
          </a>
          <a
            href="/#contact"
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            Contact
          </a>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to={getDashboardPath()} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/profile" className="btn btn-secondary btn-sm" title="My Profile" style={{ padding: '0.4rem 0.6rem' }}>
                <User size={16} />
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout" style={{ color: 'var(--danger)', padding: '0.4rem 0.6rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.5rem', color: 'var(--text-main)' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
