import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DarkToggle from '../components/DarkToggle';

const AVATARS = ['🦊','🐯','🐻','🐼','🦁','🐸','🐨','🐮','🐷','🦄','🐙','🦋'];
const INTERESTS = [
  { label: '🎨 Art', cls: 'tag-sky' },
  { label: '⚽ Soccer', cls: 'tag-green' },
  { label: '🎵 Music', cls: 'tag-pink' },
  { label: '📚 Reading', cls: 'tag-purple' },
  { label: '🧩 Puzzles', cls: 'tag-yellow' },
  { label: '🎮 Gaming', cls: 'tag-orange' },
  { label: '🏊 Swimming', cls: 'tag-sky' },
  { label: '🌱 Nature', cls: 'tag-green' },
  { label: '🩰 Dance', cls: 'tag-pink' },
  { label: '🔬 Science', cls: 'tag-purple' },
  { label: '🍳 Cooking', cls: 'tag-yellow' },
  { label: '🎭 Drama', cls: 'tag-orange' },
];

export default function AddChild() {
  const { authFetch } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [form, setForm] = useState({ name: '', age: '', grade: '' });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleInterest = (label) => {
    setSelectedInterests(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast('Please enter child\'s name', 'warning');
    if (!form.age) return showToast('Please select age', 'warning');
    setLoading(true);
    try {
      const res = await authFetch('/api/children', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          age: form.age,
          grade: form.grade,
          avatar: AVATARS[avatarIdx],
          interests: selectedInterests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      showToast(`${form.name}'s profile saved! 🎉`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {({ toggleMobileMenu }) => (
        <>
          <DashboardNavbar title="Add Child Profile 👶" onMenuClick={toggleMobileMenu} />
      <div className="main-content">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 380px', maxWidth: 520 }}>
            <div className="play-card">
              {/* Avatar Picker */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div
                  onClick={() => setAvatarIdx(i => (i + 1) % AVATARS.length)}
                  style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,var(--sky),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 10px', cursor: 'pointer', border: '4px solid var(--border)', transition: 'var(--transition)' }}
                  title="Click to change avatar"
                >
                  {AVATARS[avatarIdx]}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>👆 Click avatar to change</div>
              </div>

              <div className="form-group">
                <span className="form-icon">👤</span>
                <input type="text" className="form-control-play" placeholder="Child's Name" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <span className="form-icon">🎂</span>
                <select className="form-select-play" value={form.age} onChange={set('age')}>
                  <option value="">Select Age</option>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(a => <option key={a} value={`${a} years`}>{a} years</option>)}
                </select>
              </div>
              <div className="form-group">
                <span className="form-icon">📚</span>
                <select className="form-select-play" value={form.grade} onChange={set('grade')}>
                  <option value="">Grade / Level</option>
                  {['Pre-K','Kindergarten','1st Grade','2nd Grade','3rd Grade','4th Grade','5th Grade','6th Grade'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 800, marginBottom: 12, display: 'block' }}>
                  🎯 Interests <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>(select all that apply)</span>
                </label>
                <div className="interests-grid">
                  {INTERESTS.map(({ label, cls }) => (
                    <span
                      key={label}
                      className={`tag ${cls} ${selectedInterests.includes(label) ? 'selected' : ''}`}
                      onClick={() => toggleInterest(label)}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <button className="btn-playbuddy w-100" onClick={handleSave} disabled={loading} style={{ fontSize: '1.05rem' }}>
                {loading ? '⏳ Saving...' : '💾 Save Child Profile'}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div style={{ flex: '0 1 280px' }}>
            <div className="play-card grad-purple" style={{ borderColor: 'rgba(167,139,250,0.3)', marginBottom: 16 }}>
              <h5 style={{ fontWeight: 800, marginBottom: 14 }}>💡 Profile Tips</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                <li>🎨 Choose an avatar your child loves</li>
                <li>📅 Keep age accurate for matching</li>
                <li>🎯 More interests = better matches</li>
                <li>🔒 Profile stays private by default</li>
              </ul>
            </div>
            <div className="play-card grad-green" style={{ borderColor: 'rgba(52,211,153,0.3)' }}>
              <h5 style={{ fontWeight: 800, marginBottom: 10 }}>✅ Safety Promise</h5>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.7 }}>
                Your child's info is encrypted and never shared without your explicit permission.
              </p>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  );
}
