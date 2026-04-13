import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-blob blob1" style={{ width: 400, height: 400, background: 'var(--sky)', top: -100, left: -100 }} />
        <div className="hero-blob blob2" style={{ width: 300, height: 300, background: 'var(--pink)', bottom: -50, right: -50, animationDelay: '-2s' }} />
        <div className="hero-blob blob3" style={{ width: 200, height: 200, background: 'var(--yellow)', top: '50%', left: '40%', animationDelay: '-1s' }} />
        <div className="container">
          <div className="row align-items-center" style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }} className="fade-in">
              <div className="section-badge">🎉 Now with AI-Powered Learning!</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
                Where Kids Play,{' '}
                <span style={{ background: 'linear-gradient(135deg, var(--sky), var(--purple), var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Learn & Grow
                </span>{' '}
                Together 🌈
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.8, marginBottom: 32, maxWidth: 500 }}>
                The ultimate platform for parents to find safe playdates, fun learning activities, and build meaningful community connections.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button className="btn-playbuddy" style={{ fontSize: '1.1rem', padding: '14px 32px' }} onClick={() => navigate('/auth')}>
                  🚀 Get Started Free
                </button>
                <button className="btn-outline" style={{ fontSize: '1.1rem', padding: '14px 32px' }} onClick={() => navigate('/auth')}>
                  🔐 Login
                </button>
              </div>
              <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
                {[['50K+','Happy Kids'], ['30K+','Parents'], ['10K+','Events']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple)', fontFamily: "'Baloo 2', cursive" }}>{v}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: '0 1 340px', textAlign: 'center' }} className="float-anim">
              <svg viewBox="0 0 340 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 340 }}>
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A78BFA"/>
                    <stop offset="100%" stopColor="#38BDF8"/>
                  </linearGradient>
                </defs>
                <circle cx="170" cy="160" r="130" fill="url(#heroGrad)" opacity="0.12"/>
                <rect x="70" y="60" width="200" height="200" rx="30" fill="white" opacity="0.9" stroke="#C4B5FD" strokeWidth="2"/>
                <text x="170" y="140" fontSize="60" textAnchor="middle">🎈</text>
                <text x="170" y="200" fontSize="18" fontWeight="700" fill="#7C3AED" textAnchor="middle" fontFamily="Baloo 2">PlayBuddy</text>
                <text x="170" y="225" fontSize="11" fill="#64748B" textAnchor="middle" fontFamily="Nunito" fontWeight="600">Safe Play. Smart Learning.</text>
                <circle cx="60" cy="80" r="24" fill="#FDE68A" opacity="0.7"/>
                <text x="60" y="88" fontSize="22" textAnchor="middle">⭐</text>
                <circle cx="290" cy="200" r="20" fill="#F9A8D4" opacity="0.7"/>
                <text x="290" y="208" fontSize="18" textAnchor="middle">🌟</text>
                <circle cx="290" cy="80" r="18" fill="#BBF7D0" opacity="0.7"/>
                <text x="290" y="88" fontSize="16" textAnchor="middle">✨</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-badge">✨ Features</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
              Everything Your Family <span style={{ color: 'var(--purple)' }}>Needs</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '🎮', color: 'var(--sky)', title: 'Smart Playdates', desc: 'AI-powered matching connects your child with compatible playmates based on interests, age, and location.' },
              { icon: '🎓', color: 'var(--green)', title: 'Learning Games', desc: 'Interactive vocabulary, math, story, and science exercises with AI-powered feedback and real score tracking.' },
              { icon: '👨‍👩‍👧', color: 'var(--pink)', title: 'Parent Network', desc: 'Connect with like-minded parents, share experiences, organize events, and build lasting community bonds.' },
              { icon: '🤖', color: 'var(--purple)', title: 'AI Assistant', desc: 'Get personalized parenting advice and activity suggestions powered by Claude AI, available 24/7.' },
              { icon: '🎙️', color: 'var(--yellow)', title: 'Voice Games', desc: 'Fun pronunciation and vocabulary building voice games that make learning feel like play.' },
              { icon: '📅', color: 'var(--orange)', title: 'Community Events', desc: 'Discover and RSVP to local family events or create your own for the community.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="icon-wrap" style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}99)` }}>{f.icon}</div>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>{f.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--purple), var(--sky))', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 16 }}>Ready to Join the PlayBuddy Family? 🎉</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '1.1rem', marginBottom: 32 }}>50,000+ happy kids. Join today — it's FREE!</p>
          <button className="btn-yellow" style={{ fontSize: '1.1rem', padding: '14px 40px' }} onClick={() => navigate('/auth')}>
            🚀 Start For Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="play-footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '2rem' }}>🎈</span>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--sky), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PlayBuddy</span>
              </div>
              <p style={{ color: '#94A3B8', fontWeight: 600 }}>Safe Play. Smart Learning. Happy Kids. 🌈</p>
            </div>
            <div>
              <h6 style={{ fontWeight: 800, marginBottom: 14, color: 'var(--sky)' }}>Quick Links</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#94A3B8', fontWeight: 600, cursor: 'pointer' }}>
                <span onClick={() => navigate('/')}>🏠 Home</span>
                <span onClick={() => navigate('/auth')}>🔐 Login / Sign Up</span>
                <span onClick={() => navigate('/dashboard')}>📊 Dashboard</span>
              </div>
            </div>
            <div>
              <h6 style={{ fontWeight: 800, marginBottom: 14, color: 'var(--pink)' }}>Contact</h6>
              <div style={{ color: '#94A3B8', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span>📧 hello@playbuddy.app</span>
                <span>📱 +1 (555) PLAY-123</span>
                <span>🌐 www.playbuddy.app</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #334155', paddingTop: 20, textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
            © 2025 PlayBuddy. Made with 💜 for families everywhere.
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
