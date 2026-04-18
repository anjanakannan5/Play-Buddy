import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Celebration from '../components/Celebration';
import { launchConfetti } from '../components/Confetti';
import DarkToggle from '../components/DarkToggle';

const LESSONS_TEMPLATE = [
  { type: 'vocab', icon: '📖', title: 'Vocabulary Builder', desc: 'Learn new words and expand your language skills with fun exercises.', color: 'var(--sky)', grad: 'linear-gradient(135deg,var(--sky),#0284C7)' },
  { type: 'math', icon: '🔢', title: 'Math Adventures', desc: 'Practice addition, subtraction, multiplication, and division.', color: 'var(--green)', grad: 'linear-gradient(135deg,var(--green),#059669)' },
  { type: 'story', icon: '📚', title: 'Story Time', desc: 'Build reading comprehension and storytelling skills.', color: 'var(--pink)', grad: 'linear-gradient(135deg,var(--pink),#EC4899)' },
  { type: 'science', icon: '🔬', title: 'Science Lab', desc: 'Explore the wonders of science with interactive questions.', color: 'var(--purple)', grad: 'linear-gradient(135deg,var(--purple),#7C3AED)' },
];

export default function Learning() {
  const { authFetch } = useAuth();
  const showToast = useToast();
  const [progressStats, setProgressStats] = useState({ vocab: 0, math: 0, story: 0, science: 0 });

  useEffect(() => {
    authFetch('/api/learning/stats').then(r => r.json()).then(data => {
      if (data) setProgressStats(data);
    }).catch(() => {});
  }, []);

  const [quiz, setQuiz] = useState(null); // { title, questions }
  const [quizType, setQuizType] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [celebration, setCelebration] = useState(null);

  const startLesson = async (type) => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/learning/${type}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQuiz(data);
      setQuizType(type);
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setRevealed(false);
      setResults(null);
      showToast(`📚 Starting ${data.title}!`, 'info');
    } catch (err) {
      showToast(err.message || 'Could not load lesson', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    if (current + 1 < quiz.questions.length) {
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      // Submit
      try {
        const res = await authFetch(`/api/learning/${quizType}/submit`, {
          method: 'POST',
          body: JSON.stringify({ answers: newAnswers }),
        });
        const data = await res.json();
        setResults(data);
        if (data.percentage >= 80) {
          launchConfetti();
          setCelebration({ emoji: '🏆', title: 'Amazing Job!', message: `You scored ${data.score}/${data.total} — ${data.percentage}%! You're a star! ⭐` });
        } else {
          showToast(`Quiz done! Score: ${data.score}/${data.total} 🎯`, 'success');
        }
      } catch {
        showToast('Could not submit answers', 'error');
        setResults({ score: answers.filter(Boolean).length, total: quiz.questions.length, percentage: 0 });
      }
    }
  };

  const closeQuiz = () => {
    setQuiz(null);
    setResults(null);
    setCelebration(null);
  };

  const q = quiz?.questions?.[current];

  return (
    <DashboardLayout>
      {({ toggleMobileMenu }) => (
        <>
          <DashboardNavbar title="Learning Games 🧠" onMenuClick={toggleMobileMenu} />

      <div className="main-content">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,var(--green),var(--sky))', borderRadius: 24, padding: 28, color: 'white', marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>Learn & Grow! 🌱</h2>
          <p style={{ opacity: 0.9, fontWeight: 600 }}>Pick a subject below to start an interactive quiz. Real scores are saved!</p>
        </div>

        {/* Lesson Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
          {LESSONS_TEMPLATE.map(lesson => {
            const progress = progressStats[lesson.type] || 0;
            return (
              <div key={lesson.type} className="learning-card">
                <span className="learning-icon">{lesson.icon}</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>{lesson.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 14 }}>{lesson.desc}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: lesson.grad }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Progress</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: lesson.color }}>{progress}%</span>
                </div>
                <button
                  className="btn-playbuddy w-100"
                  style={{ background: lesson.grad }}
                  onClick={() => startLesson(lesson.type)}
                  disabled={loading}
                >
                  {loading ? '⏳ Loading...' : '🚀 Start Lesson'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="section-title">Achievements 🏆</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { icon: '⭐', label: 'First Lesson', color: 'var(--yellow)' },
            { icon: '🔥', label: '3-Day Streak', color: 'var(--orange)' },
            { icon: '🎯', label: 'Perfect Score', color: 'var(--green)' },
            { icon: '📚', label: 'Book Worm', color: 'var(--purple)' },
          ].map(a => (
            <div key={a.label} className="play-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem' }}>{a.icon}</span>
              <span style={{ fontWeight: 800, color: a.color, fontSize: '0.9rem' }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {quiz && !results && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontWeight: 800 }}>{quiz.title}</h3>
              <button onClick={closeQuiz} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Question {current + 1} of {quiz.questions.length}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple)' }}>{Math.round(((current) / quiz.questions.length) * 100)}% done</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(current / quiz.questions.length) * 100}%`, background: 'linear-gradient(135deg,var(--sky),var(--purple))' }} />
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg,rgba(56,189,248,0.1),rgba(167,139,250,0.1))', borderRadius: 16, padding: '20px 20px 16px', marginBottom: 20 }}>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.5 }}>{q?.q}</p>
            </div>

            <div>
              {q?.options.map((opt, idx) => {
                let cls = 'quiz-option';
                if (revealed) {
                  if (idx === q.answer) cls += ' correct';
                  else if (idx === selected && idx !== q.answer) cls += ' wrong';
                }
                return (
                  <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={revealed}>
                    <span style={{ fontWeight: 800, marginRight: 8, color: 'var(--text-muted)' }}>{['A','B','C','D'][idx]}.</span> {opt}
                    {revealed && idx === q.answer && <span style={{ marginLeft: 8 }}>✅</span>}
                    {revealed && idx === selected && idx !== q.answer && <span style={{ marginLeft: 8 }}>❌</span>}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <button className="btn-playbuddy w-100" style={{ marginTop: 16 }} onClick={handleNext}>
                {current + 1 < quiz.questions.length ? '➡️ Next Question' : '🏁 Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Modal */}
      {results && !celebration && (
        <div className="modal-overlay" onClick={closeQuiz}>
          <div className="modal-box bounce-in" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 12 }}>{results.percentage >= 80 ? '🏆' : results.percentage >= 50 ? '🎯' : '💪'}</div>
            <h2 style={{ fontWeight: 800, marginBottom: 8 }}>
              {results.percentage >= 80 ? 'Outstanding!' : results.percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--purple)', margin: '16px 0', fontFamily: "'Baloo 2', cursive" }}>
              {results.score}/{results.total}
            </div>
            <div className="progress-bar" style={{ margin: '0 auto 20px', maxWidth: 200 }}>
              <div className="progress-fill" style={{ width: `${results.percentage}%`, background: results.percentage >= 80 ? 'linear-gradient(135deg,var(--green),#059669)' : 'linear-gradient(135deg,var(--sky),var(--purple))' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 24 }}>{results.percentage}% correct • Score saved to your profile!</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-outline" onClick={closeQuiz}>Back to Lessons</button>
              <button className="btn-playbuddy" onClick={() => { closeQuiz(); startLesson(quizType); }}>Try Again 🔄</button>
            </div>
          </div>
        </div>
      )}

      {celebration && <Celebration emoji={celebration.emoji} title={celebration.title} message={celebration.message} onClose={closeQuiz} />}
        </>
      )}
    </DashboardLayout>
  );
}
