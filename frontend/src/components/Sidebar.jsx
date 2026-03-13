import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, GridIcon, ListIcon, TrendingUpIcon, CalendarIcon, UsersIcon, SettingsIcon, PillIcon } from './Icons';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <SearchIcon size={20} color="#9CA3AF" />, label: 'Search', top: true },
    { path: '/', icon: <GridIcon size={20} color="#9CA3AF" />, label: 'Dashboard' },
    { path: '/inventory', icon: <ListIcon size={20} color="#9CA3AF" />, label: 'Inventory' },
    { path: '/analytics', icon: <TrendingUpIcon size={20} color="#9CA3AF" />, label: 'Analytics' },
    { path: '/calendar', icon: <CalendarIcon size={20} color="#9CA3AF" />, label: 'Calendar' },
    { path: '/people', icon: <UsersIcon size={20} color="#9CA3AF" />, label: 'People' },
  ];

  const bottomItems = [
    { path: '/settings', icon: <SettingsIcon size={20} color="#9CA3AF" />, label: 'Settings' }
  ];

  return (
    <div style={{
      width: '80px',
      height: '100vh',
      backgroundColor: '#1F2937',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '24px',
      gap: '8px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: '#10B981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <PillIcon size={28} color="#FFFFFF" />
      </div>

      {/* Top Menu Items */}
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path && !item.top;
        return (
          <Link
            key={item.path + item.label + index}
            to={item.path}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: isActive ? '#374151' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              marginBottom: item.top ? '24px' : '0'
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#374151';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={item.label}
          >
            {item.icon}
          </Link>
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom Menu Items */}
      {bottomItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: isActive ? '#374151' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#374151';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={item.label}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;
