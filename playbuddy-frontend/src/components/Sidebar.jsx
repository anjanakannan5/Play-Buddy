import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkToggle from './DarkToggle';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/add-child', icon: '👶', label: 'Add Child', badge: '+' },
  { path: '/events', icon: '📅', label: 'Events', badge: 'New' },
  { path: '/messages', icon: '💬', label: 'Messaging' },
  { path: '/learning', icon: '🧠', label: 'Learning' },
  { path: '/voice-game', icon: '🎙️', label: 'Voice Game' },
  { path: '/ai-chat', icon: '🤖', label: 'AI Chat' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: '1.8rem' }}>🎈</span>
          <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.5rem', fontWeight: 800 }}>PlayBuddy</span>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              {'👨🏻‍👩🏻‍👧🏻‍👦🏻'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Happy Parent 💜</div>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="item-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </div>
        ))}
      </nav>

      <div style={{ padding: 16, borderTop: '2px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Night Mode</span>
          <DarkToggle />
        </div>
        <button className="btn-outline w-100" style={{ fontSize: '0.9rem' }} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
