import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      gap: '1rem',
      width: '100%'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3.5px solid #e0e7ff',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
        {message}
      </span>
    </div>
  );
};

export default LoadingSpinner;
