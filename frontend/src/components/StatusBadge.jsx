function StatusBadge({ status }) {
  const statusStyles = {
    'Active': {
      bg: '#D1FAE5',
      text: '#059669',
      label: 'Active'
    },
    'Low Stock': {
      bg: '#FED7AA',
      text: '#EA580C',
      label: 'Low Stock'
    },
    'Expired': {
      bg: '#FEE2E2',
      text: '#DC2626',
      label: 'Expired'
    },
    'Out of Stock': {
      bg: '#F3F4F6',
      text: '#6B7280',
      label: 'Out of Stock'
    }
  };

  const style = statusStyles[status] || statusStyles['Active'];

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: style.bg,
      color: style.text
    }}>
      {style.label}
    </span>
  );
}

export default StatusBadge;
