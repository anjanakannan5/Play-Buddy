import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DarkToggle from '../components/DarkToggle';

const TYPE_COLORS = {
  Art: 'linear-gradient(90deg,var(--sky),var(--purple))',
  Sports: 'linear-gradient(90deg,var(--green),var(--yellow))',
  Music: 'linear-gradient(90deg,var(--pink),var(--orange))',
  Games: 'linear-gradient(90deg,var(--purple),var(--pink))',
  Education: 'linear-gradient(90deg,var(--yellow),var(--green))',
  Other: 'linear-gradient(90deg,var(--sky),var(--green))',
};
const TYPE_TAG = {
  Art: 'tag-sky', Sports: 'tag-green', Music: 'tag-pink',
  Games: 'tag-purple', Education: 'tag-yellow', Other: 'tag-sky',
};
const EMOJIS = { Art: '🎨', Sports: '⚽', Music: '🎵', Games: '🧩', Education: '🔬', Other: '🎉' };

export default function Events() {
  const { authFetch, user } = useAuth();
  const showToast = useToast();
  const [events, setEvents] = useState([]);
  const [rsvped, setRsvped] = useState({});
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'Other', emoji: '🎉', date: '', time: '', location: '', ageMin: 2, ageMax: 12, price: 'FREE' });

  useEffect(() => {
    authFetch('/api/events').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setEvents(data);
        const initRsvp = {};
        data.forEach(ev => { if (ev.rsvps?.some(id => id === user?._id || id?._id === user?._id)) initRsvp[ev._id] = true; });
        setRsvped(initRsvp);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRSVP = async (eventId) => {
    const isDefault = eventId.startsWith('d');
    if (isDefault) {
      setRsvped(r => ({ ...r, [eventId]: !r[eventId] }));
      showToast(rsvped[eventId] ? 'RSVP cancelled' : '🎉 RSVP confirmed!', rsvped[eventId] ? 'info' : 'success');
      return;
    }
    try {
      const res = await authFetch(`/api/events/${eventId}/rsvp`, { method: 'POST' });
      const data = await res.json();
      const isNowRsvped = data.rsvps?.some(id => id === user?._id || id?._id === user?._id);
      setRsvped(r => ({ ...r, [eventId]: isNowRsvped }));
      setEvents(evs => evs.map(e => e._id === eventId ? { ...e, rsvps: data.rsvps } : e));
      showToast(isNowRsvped ? '🎉 RSVP confirmed!' : 'RSVP cancelled', isNowRsvped ? 'success' : 'info');
    } catch { showToast('Could not update RSVP', 'error'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return showToast('Title and date are required', 'warning');
    setCreating(true);
    try {
      const res = await authFetch('/api/events', { method: 'POST', body: JSON.stringify({ ...form, emoji: EMOJIS[form.type] || '🎉' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setEvents(ev => [data, ...ev]);
      showToast('🎉 Event created!', 'success');
      setShowModal(false);
      setForm({ title: '', description: '', type: 'Other', emoji: '🎉', date: '', time: '', location: '', ageMin: 2, ageMax: 12, price: 'FREE' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally { setCreating(false); }
  };

  const types = ['All', 'Art', 'Sports', 'Music', 'Games', 'Education'];
  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter);

  return (
    <DashboardLayout>
      {({ toggleMobileMenu }) => (
        <>
          <DashboardNavbar title="Events 📅" onMenuClick={toggleMobileMenu} />
          {/* Header Action Button moved to navbar-friendly area if needed, 
              but let's keep it in the content for accessibility or add it to navbar. 
              Let's put it as a floating action or just below title. */}
          <div className="main-content" style={{ paddingBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -10 }}>
              <button className="btn-playbuddy" style={{ padding: '8px 18px', fontSize: '0.9rem' }} onClick={() => setShowModal(true)}>
                ➕ Create Event
              </button>
            </div>
          </div>

      <div className="main-content">
        {/* Filters */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>🔍 Filter by Type</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {types.map(t => (
              <button key={t} className={`filter-chip ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
                {t === 'All' ? 'All Events' : `${EMOJIS[t] || ''} ${t}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⏳</div>
            <div style={{ fontWeight: 700 }}>Loading events...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map(ev => (
              <div key={ev._id} className="event-card">
                <div className="event-banner" style={{ background: TYPE_COLORS[ev.type] || TYPE_COLORS.Other }} />
                <div className="event-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                    <span style={{ fontSize: '2.5rem' }}>{ev.emoji || EMOJIS[ev.type] || '🎉'}</span>
                    <span className={`tag ${TYPE_TAG[ev.type] || 'tag-sky'}`} style={{ fontSize: '0.75rem' }}>{ev.type}</span>
                  </div>
                  <h5 style={{ fontWeight: 800, marginBottom: 6 }}>{ev.title}</h5>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 10 }}>
                    📅 {ev.date} {ev.time && `• ${ev.time}`}<br />
                    {ev.location && <>📍 {ev.location}<br /></>}
                    👶 Ages {ev.ageMin}-{ev.ageMax}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, color: ev.price === 'FREE' ? 'var(--green)' : 'var(--orange)' }}>
                      {ev.price === 'FREE' ? 'FREE 🎉' : `${ev.price} 🎫`}
                    </div>
                    <button className={`rsvp-btn ${rsvped[ev._id] ? 'rsvped' : ''}`} onClick={() => handleRSVP(ev._id)}>
                      {rsvped[ev._id] ? '✅ Going!' : 'RSVP Now'}
                    </button>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    👥 {ev.rsvps?.length || 0} families going
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 700 }}>No events found. Create one!</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 800 }}>Create New Event 🎉</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <span className="form-icon">📝</span>
                <input type="text" className="form-control-play" placeholder="Event Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <span className="form-icon">📋</span>
                <input type="text" className="form-control-play" placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-icon">🏷️</span>
                  <select className="form-select-play" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {['Art','Sports','Music','Games','Education','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-icon">💰</span>
                  <input type="text" className="form-control-play" placeholder="Price (e.g. FREE)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-icon">📅</span>
                  <input type="date" className="form-control-play" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-icon">⏰</span>
                  <input type="time" className="form-control-play" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <span className="form-icon">📍</span>
                <input type="text" className="form-control-play" placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-icon">👶</span>
                  <select className="form-select-play" value={form.ageMin} onChange={e => setForm(f => ({ ...f, ageMin: +e.target.value }))}>
                    {[2,3,4,5,6,7,8,9,10,11,12].map(a => <option key={a} value={a}>Min Age: {a}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-icon">👦</span>
                  <select className="form-select-play" value={form.ageMax} onChange={e => setForm(f => ({ ...f, ageMax: +e.target.value }))}>
                    {[2,3,4,5,6,7,8,9,10,11,12].map(a => <option key={a} value={a}>Max Age: {a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-playbuddy" style={{ flex: 2 }} disabled={creating}>
                  {creating ? '⏳ Creating...' : '🎉 Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </DashboardLayout>
  );
}
