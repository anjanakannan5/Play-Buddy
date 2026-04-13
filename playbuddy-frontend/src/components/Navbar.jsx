import { useNavigate } from 'react-router-dom';
import DarkToggle from './DarkToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="main-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <span style={{ fontSize: '2rem' }}>🎈</span>
        <span className="logo-text">PlayBuddy</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <DarkToggle />
        {user ? (
          <button className="btn-playbuddy" style={{ padding: '8px 18px', fontSize: '0.9rem' }} onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        ) : (
          <button className="btn-playbuddy" style={{ padding: '8px 18px', fontSize: '0.9rem' }} onClick={() => navigate('/auth')}>
            🚀 Get Started
          </button>
        )}
      </div>
    </nav>
  );
}
