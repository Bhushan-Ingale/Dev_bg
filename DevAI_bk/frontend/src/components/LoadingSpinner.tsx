'use client';

export default function LoadingSpinner() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(255,222,34,0.1)',
        borderTopColor: '#ffde22',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#ffde22', fontSize: '0.875rem' }}>Loading DevAI...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}