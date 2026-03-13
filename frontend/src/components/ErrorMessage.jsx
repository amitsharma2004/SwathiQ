function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      backgroundColor: '#FEE2E2',
      border: '1px solid #FCA5A5',
      borderRadius: '8px',
      padding: '16px',
      margin: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#991B1B',
            marginBottom: '4px'
          }}>
            Error
          </div>
          <div style={{
            fontSize: '14px',
            color: '#DC2626'
          }}>
            {message || 'Something went wrong. Please try again.'}
          </div>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
