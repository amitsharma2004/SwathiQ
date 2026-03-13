function StatCard({ icon, label, value, badge, badgeColor, iconBg }) {
  const bgColors = {
    green: '#10B981',
    blue: '#3B82F6',
    orange: '#F97316',
    purple: '#A855F7'
  };

  const badgeColors = {
    green: { bg: '#D1FAE5', text: '#059669' },
    orange: { bg: '#FED7AA', text: '#EA580C' },
    purple: { bg: '#E9D5FF', text: '#9333EA' },
    red: { bg: '#FEE2E2', text: '#DC2626' }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      border: '1px solid #F3F4F6'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: bgColors[iconBg] || '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {icon}
        </div>
        {badge && (
          <span style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: badgeColors[badgeColor]?.bg || '#D1FAE5',
            color: badgeColors[badgeColor]?.text || '#059669'
          }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <div style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '4px'
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#6B7280',
          fontWeight: '500'
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
