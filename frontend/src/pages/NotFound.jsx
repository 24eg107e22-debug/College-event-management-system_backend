import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '2rem', lineHeight: '1.6' }}>
        The page you are looking for might have been moved, removed, or is temporarily unavailable.
      </p>

      <Link to="/" className="btn btn-primary" style={{ gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Return to CampusConnect
      </Link>
    </div>
  );
};

export default NotFound;
