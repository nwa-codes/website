import type { JSX } from 'react';

const AdminLoading = (): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#c7c7c7',
        fontSize: '0.95rem',
      }}
    >
      Loading...
    </div>
  );
};

export default AdminLoading;
