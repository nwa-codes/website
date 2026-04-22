'use client';

import type { JSX } from 'react';

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const AdminError = ({ error, reset }: AdminErrorProps): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px',
        color: 'white',
        gap: '16px',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong</h2>
      <p style={{ color: '#c7c7c7', fontSize: '0.95rem' }}>
        An unexpected error occurred in the admin panel.
      </p>
      {error.digest ? (
        <p style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          Error ID: {error.digest}
        </p>
      ) : null}
      <button
        onClick={reset}
        style={{
          marginTop: '8px',
          padding: '10px 24px',
          backgroundColor: '#E32359',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
};

export default AdminError;
