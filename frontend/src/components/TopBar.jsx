function TopBar({ title, subtitle, onExport, onAddMedicine }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '24px 32px',
      borderBottom: '1px solid #F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#111827',
          margin: 0,
          marginBottom: '4px'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: '13px',
            color: '#9CA3AF',
            margin: 0
          }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {onExport && (
          <button
            onClick={onExport}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📤 Export
          </button>
        )}
        {onAddMedicine && (
          <button
            onClick={onAddMedicine}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + Add Medicine
          </button>
        )}
      </div>
    </div>
  );
}

export default TopBar;
