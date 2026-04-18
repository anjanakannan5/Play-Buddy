import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import DarkToggle from '../components/DarkToggle';

export default function Dashboard() {
  const { user, authFetch, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ children: 0, rsvps: 0, messages: 0, points: 0 });

  useEffect(() => {
    const fetchStats = () => {
      authFetch('/api/children').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setChildren(data);
      }).catch(() => { });

      authFetch('/api/events').then(r => r.json()).then(data => {
        if (Array.isArray(data)) {
          setEvents(data.slice(0, 3));
          const myRsvps = data.filter(e => e.rsvps?.includes(user?._id)).length;
          setStats(s => ({ ...s, rsvps: myRsvps }));
        }
      }).catch(() => { });

      authFetch('/api/messages/unread-count').then(r => r.json()).then(data => {
        if (data && typeof data.count === 'number') {
          setStats(s => ({ ...s, messages: data.count }));
        }
      }).catch(() => { });

      refreshUser(); // Sync points and other profile data
    };

    fetchStats();

    // Refresh when browser tab gets focus (user returns to dashboard)
    window.addEventListener('focus', fetchStats);
    return () => window.removeEventListener('focus', fetchStats);
  }, [authFetch, user?._id, refreshUser]);

  useEffect(() => {
    if (children.length !== undefined) setStats(s => ({ ...s, children: children.length, points: user?.points || 0 }));
  }, [children, user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const statCards = [
    { label: 'Children', value: stats.children, icon: '👶', color: 'var(--sky)', grad: 'grad-sky', border: 'rgba(56,189,248,0.3)', bg: 'linear-gradient(135deg,var(--sky),#0284C7)' },
    { label: 'RSVPs', value: stats.rsvps, icon: '📅', color: 'var(--pink)', grad: 'grad-pink', border: 'rgba(244,114,182,0.3)', bg: 'linear-gradient(135deg,var(--pink),#EC4899)' },
    { label: 'Messages', value: stats.messages, icon: '💬', color: 'var(--green)', grad: 'grad-green', border: 'rgba(52,211,153,0.3)', bg: 'linear-gradient(135deg,var(--green),#059669)' },
    { label: 'Points', value: user?.points || 0, icon: '⭐', color: 'var(--purple)', grad: 'grad-purple', border: 'rgba(167,139,250,0.3)', bg: 'linear-gradient(135deg,var(--purple),#7C3AED)' },
  ];

  const quickActions = [
    { icon: '📅', label: 'Browse Events', color: 'var(--sky)', path: '/events' },
    { icon: '💬', label: 'Messages', color: 'var(--pink)', path: '/messages' },
    { icon: '🧠', label: 'Learning', color: 'var(--green)', path: '/learning' },
    { icon: '🤖', label: 'AI Chat', color: 'var(--purple)', path: '/ai-chat' },
  ];

  return (
    <DashboardLayout>
      {({ toggleMobileMenu }) => (
        <>
          <DashboardNavbar title="Dashboard 🏠" onMenuClick={toggleMobileMenu} />

      <div className="main-content">
        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg,var(--purple),var(--sky))', borderRadius: 24, padding: 28, color: 'white', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: '5rem', opacity: 0.3 }}>🌈</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>{greeting}, {user?.name?.split(' ')[0]}! ☀️</h2>
          <p style={{ opacity: 0.9, fontWeight: 600, fontSize: '1rem' }}>
            {children.length > 0 ? `You have ${children.length} child profile${children.length > 1 ? 's' : ''} set up. Keep up the great parenting! 💪` : "Welcome! Start by adding your child's profile below 👇"}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn-yellow" onClick={() => navigate('/events')}>📅 View Events</button>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: 50, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/add-child')}>
              ➕ Add Child
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          {statCards.map(s => (
            <div key={s.label} className={`stat-card ${s.grad}`} style={{ borderColor: s.border }}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Children */}
        <div className="section-title">My Children 👶</div>
        <p className="section-subtitle">Manage your children's profiles and activities</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {children.map(child => (
            <div key={child._id} className="child-card" style={{ background: 'linear-gradient(135deg,rgba(56,189,248,0.1),rgba(167,139,250,0.1))', borderColor: 'var(--sky)' }}
              onClick={() => navigate('/add-child')}>
              <div className="child-avatar" style={{ background: 'linear-gradient(135deg,var(--sky),var(--purple))' }}>{child.avatar}</div>
              <h5 style={{ fontWeight: 800, marginBottom: 4 }}>{child.name}</h5>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 10 }}>{child.age} • {child.grade || 'School'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
                {(child.interests || []).slice(0, 3).map(int => (
                  <span key={int} className="tag tag-sky" style={{ fontSize: '0.75rem' }}>{int}</span>
                ))}
              </div>
            </div>
          ))}
          <div className="child-card" style={{ borderColor: 'var(--pink)', borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, cursor: 'pointer' }} onClick={() => navigate('/add-child')}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>➕</div>
              <div style={{ fontWeight: 800, color: 'var(--pink)' }}>Add Child Profile</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>Click to create</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-title">Quick Actions ⚡</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}>
          {quickActions.map(a => (
            <div key={a.label} className="play-card" style={{ textAlign: 'center', cursor: 'pointer', padding: 20 }} onClick={() => navigate(a.path)}>
              <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: a.color }}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Events */}
        {events.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Upcoming Events 📅</div>
              <button className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => navigate('/events')}>View All</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {events.map(ev => (
                <div key={ev._id} className="event-card">
                  <div className="event-banner" style={{ background: 'linear-gradient(90deg,var(--sky),var(--purple))' }} />
                  <div className="event-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <span style={{ fontSize: '2rem' }}>{ev.emoji || '🎉'}</span>
                      <span className="tag tag-sky" style={{ fontSize: '0.75rem' }}>{ev.type}</span>
                    </div>
                    <h5 style={{ fontWeight: 800, marginBottom: 6 }}>{ev.title}</h5>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                      📅 {ev.date} {ev.time && `• ${ev.time}`}<br />
                      {ev.location && `📍 ${ev.location}`}
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>👥 {ev.rsvps?.length || 0} families going</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
        </>
      )}
    </DashboardLayout>
  );
}
