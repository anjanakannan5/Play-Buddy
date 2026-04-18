import { useAuth } from '../context/AuthContext';

export default function DashboardNavbar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <div className="dash-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger hide-desktop" onClick={onMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div className="hide-mobile" style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.1 }}>{user?.name?.split(' ')[0]}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Parent</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--sky),var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', border: '2px solid white', boxSizing: 'content-box'
          }}>
            {'👨🏻‍👩🏻'}
          </div>
        </div>
      </div>
    </div>
  );
}
