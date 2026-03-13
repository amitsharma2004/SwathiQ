function LoadingSpinner({ size = 'medium' }) {
  const sizes = {
    small: '24px',
    medium: '48px',
    large: '64px'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: sizes[size],
        height: sizes[size],
        border: '4px solid #E5E7EB',
        borderTop: '4px solid #3B82F6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
