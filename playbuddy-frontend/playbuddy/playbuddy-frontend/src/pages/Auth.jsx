import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import MainLayout from '../layouts/MainLayout';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const { login, signup } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return showToast('Please fill in all fields', 'warning');
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return showToast('Please fill in all fields', 'warning');
    if (form.password.length < 6) return showToast('Password must be at least 6 characters', 'warning');
    if (form.password !== form.confirm) return showToast('Passwords do not match', 'warning');
    if (!form.terms) return showToast('Please accept the terms', 'warning');
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password);
      showToast(`Welcome to PlayBuddy, ${user.name}! 🌟`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', padding: '40px 0', background: 'linear-gradient(135deg, var(--bg), var(--card-bg))' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 60, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Illustration */}
            <div style={{ textAlign: 'center' }} className="float-anim">
              <svg viewBox="0 0 320 340" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 280 }}>
                <circle cx="160" cy="160" r="140" fill="rgba(167,139,250,0.08)"/>
                <circle cx="160" cy="160" r="110" fill="rgba(56,189,248,0.08)"/>
                <rect x="100" y="130" width="120" height="100" rx="20" fill="#C4B5FD"/>
                <rect x="110" y="140" width="100" height="80" rx="14" fill="#A78BFA"/>
                <path d="M 130 130 Q 130 95 160 95 Q 190 95 190 130" stroke="#7C3AED" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <circle cx="160" cy="180" r="14" fill="white"/>
                <rect x="156" y="180" width="8" height="22" rx="4" fill="white"/>
                <text x="60" y="90" fontSize="24">⭐</text>
                <text x="240" y="110" fontSize="20">✨</text>
                <text x="50" y="210" fontSize="18">🌟</text>
                <text x="255" y="240" fontSize="22">💫</text>
                <text x="160" y="270" fontSize="16" fill="var(--purple)" textAnchor="middle" fontWeight="700" fontFamily="Nunito">Welcome to PlayBuddy! 🎉</text>
                <text x="160" y="292" fontSize="12" fill="#94A3B8" textAnchor="middle" fontWeight="600" fontFamily="Nunito">Your family's safe digital playground</text>
              </svg>
            </div>

            {/* Form */}
            <div style={{ width: '100%', maxWidth: 440 }}>
              <div className="play-card bounce-in">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome! 👋</h2>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Join thousands of happy families</p>
                </div>

                <div className="auth-toggle">
                  <div className={`auth-toggle-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>🔐 Login</div>
                  <div className={`auth-toggle-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>✨ Sign Up</div>
                </div>

                {tab === 'login' ? (
                  <form onSubmit={handleLogin}>
                    <div className="form-group">
                      <span className="form-icon">📧</span>
                      <input type="email" className="form-control-play" placeholder="Email address" value={form.email} onChange={set('email')} required />
                    </div>
                    <div className="form-group">
                      <span className="form-icon">🔒</span>
                      <input type="password" className="form-control-play" placeholder="Password" value={form.password} onChange={set('password')} required />
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: 16 }}>
                      <a href="#" style={{ color: 'var(--sky)', fontWeight: 700, fontSize: '0.9rem' }}>Forgot password? 🔑</a>
                    </div>
                    <button className="btn-playbuddy w-100" type="submit" disabled={loading} style={{ marginBottom: 14 }}>
                      {loading ? '⏳ Logging in...' : '🚀 Login to PlayBuddy'}
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                      Don't have an account?{' '}
                      <span onClick={() => setTab('signup')} style={{ color: 'var(--purple)', fontWeight: 800, cursor: 'pointer' }}>Sign Up Free!</span>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleSignup}>
                    <div className="form-group">
                      <span className="form-icon">👤</span>
                      <input type="text" className="form-control-play" placeholder="Your Full Name" value={form.name} onChange={set('name')} required />
                    </div>
                    <div className="form-group">
                      <span className="form-icon">📧</span>
                      <input type="email" className="form-control-play" placeholder="Email address" value={form.email} onChange={set('email')} required />
                    </div>
                    <div className="form-group">
                      <span className="form-icon">🔒</span>
                      <input type="password" className="form-control-play" placeholder="Create password (min 6 chars)" value={form.password} onChange={set('password')} required />
                    </div>
                    <div className="form-group">
                      <span className="form-icon">🔒</span>
                      <input type="password" className="form-control-play" placeholder="Confirm password" value={form.confirm} onChange={set('confirm')} required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
                      <input type="checkbox" id="terms" checked={form.terms} onChange={set('terms')} style={{ marginTop: 4, accentColor: 'var(--purple)' }} />
                      <label htmlFor="terms" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        I agree to PlayBuddy's <span style={{ color: 'var(--sky)' }}>Terms</span> and <span style={{ color: 'var(--sky)' }}>Privacy Policy</span> 🛡️
                      </label>
                    </div>
                    <button className="btn-playbuddy w-100" type="submit" disabled={loading} style={{ marginBottom: 14 }}>
                      {loading ? '⏳ Creating account...' : '🌟 Create My Account'}
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                      Already have an account?{' '}
                      <span onClick={() => setTab('login')} style={{ color: 'var(--purple)', fontWeight: 800, cursor: 'pointer' }}>Login!</span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
