import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { launchConfetti } from '../components/Confetti';
import DarkToggle from '../components/DarkToggle';

const WORDS = [
  { word: 'Elephant', emoji: '🐘', hint: 'A large gray animal with a trunk' },
  { word: 'Rainbow', emoji: '🌈', hint: 'Colorful arc in the sky after rain' },
  { word: 'Butterfly', emoji: '🦋', hint: 'A beautiful insect with colorful wings' },
  { word: 'Volcano', emoji: '🌋', hint: 'A mountain that erupts with lava' },
  { word: 'Astronaut', emoji: '👨‍🚀', hint: 'A person who travels to space' },
  { word: 'Dinosaur', emoji: '🦕', hint: 'A prehistoric giant reptile' },
  { word: 'Submarine', emoji: '🚢', hint: 'A vessel that travels underwater' },
  { word: 'Penguin', emoji: '🐧', hint: 'A flightless bird that lives in cold regions' },
];

export default function VoiceGame() {
  const { authFetch } = useAuth();
  const showToast = useToast();
  const [wordIdx, setWordIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(null);
  const [waveActive, setWaveActive] = useState(false);

  const word = WORDS[wordIdx % WORDS.length];

  const handleMic = () => {
    if (listening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('❌ Voice recognition not supported in this browser.', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setWaveActive(true);
      setShowResult(null);
    };

    recognition.onresult = (event) => {
      const said = event.results[0][0].transcript;
      const cleanSaid = said.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
      const targetWord = word.word.toLowerCase();
      
      const correct = cleanSaid === targetWord || cleanSaid.includes(targetWord);
      
      setListening(false);
      setWaveActive(false);
      setShowResult({ said, correct });

      if (correct) {
        setScore(s => s + 10);
        launchConfetti();
        showToast('🎉 Correct! +10 points!', 'success');
        saveResult(word.word, true);
      } else {
        showToast(`❌ Almost! You said "${said}"`, 'warning');
        saveResult(word.word, false);
      }
      setHistory(h => [{ word: word.word, correct, emoji: word.emoji, said }, ...h].slice(0, 5));
    };

    recognition.onerror = (event) => {
      setListening(false);
      setWaveActive(false);
      if (event.error === 'no-speech') {
        showToast('🎤 No speech detected. Try again!', 'warning');
      } else if (event.error === 'not-allowed') {
        showToast('🚫 Microphone permission denied.', 'error');
      } else {
        showToast(`❌ Error: ${event.error}`, 'error');
      }
    };

    recognition.onend = () => {
      setListening(false);
      setWaveActive(false);
    };

    recognition.start();
  };

  const saveResult = async (w, correct) => {
    try { await authFetch('/api/voice/submit', { method: 'POST', body: JSON.stringify({ word: w, correct }) }); } catch {}
  };

  const nextWord = () => {
    setWordIdx(i => i + 1);
    setRound(r => r + 1);
    setShowResult(null);
  };

  const skip = () => {
    setWordIdx(i => i + 1);
    setRound(r => r + 1);
    setShowResult(null);
    showToast('⏭️ Word skipped!', 'info');
  };

  return (
    <DashboardLayout>
      {({ toggleMobileMenu }) => (
        <>
          <DashboardNavbar title="Voice Game 🎙️" onMenuClick={toggleMobileMenu} />

      <div className="main-content">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Game Area */}
          <div style={{ flex: '1 1 340px' }}>
            <div className="play-card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ background: 'linear-gradient(135deg,var(--sky),var(--purple))', color: 'white', padding: '6px 16px', borderRadius: 50, fontWeight: 800, fontSize: '0.9rem' }}>
                  Round {round}
                </span>
                <span style={{ background: 'linear-gradient(135deg,var(--yellow),var(--orange))', color: 'white', padding: '6px 16px', borderRadius: 50, fontWeight: 800, fontSize: '0.9rem' }}>
                  ⭐ Score: {score}
                </span>
              </div>

              <div style={{ fontSize: '6rem', marginBottom: 8 }}>{word.emoji}</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 24, fontSize: '0.95rem', fontStyle: 'italic' }}>
                "{word.hint}"
              </div>

              <button
                className={`mic-btn ${listening ? 'listening' : ''}`}
                onClick={handleMic}
                disabled={listening || showResult}
                style={{ margin: '0 auto 16px', display: 'block' }}
              >
                {listening ? '⏹️' : '🎙️'}
              </button>

              <div style={{ fontWeight: 700, color: listening ? 'var(--pink)' : 'var(--text-muted)', marginBottom: 16 }}>
                {listening ? 'Listening... speak now! 🎤' : showResult ? '' : 'Press mic and say the word!'}
              </div>

              {/* Wave animation */}
              <div className={`voice-wave ${waveActive ? 'active' : ''}`} style={{ marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ height: `${20 + i * 8}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
                {[...Array(4)].map((_, i) => (
                  <div key={`r${i}`} className="wave-bar" style={{ height: `${36 - i * 8}px`, animationDelay: `${(i + 5) * 0.1}s` }} />
                ))}
              </div>

              {showResult && (
                <div style={{ background: showResult.correct ? 'linear-gradient(135deg,rgba(52,211,153,0.1),rgba(52,211,153,0.05))' : 'linear-gradient(135deg,rgba(248,113,113,0.1),rgba(248,113,113,0.05))', border: `2px solid ${showResult.correct ? 'var(--green)' : 'var(--red)'}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>You said:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: showResult.correct ? 'var(--green)' : 'var(--red)' }}>
                    {showResult.said}
                  </div>
                  <div style={{ color: showResult.correct ? 'var(--green)' : 'var(--red)', fontWeight: 700, marginTop: 4 }}>
                    {showResult.correct ? '🎉 Correct! Amazing job!' : `❌ Almost! The answer was "${word.word}"`}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {showResult && (
                  <button className="btn-playbuddy" onClick={nextWord}>Next Word ➡️</button>
                )}
                <button className="btn-outline" onClick={skip}>⏭️ Skip</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: '0 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score */}
            <div className="play-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--purple)', fontFamily: "'Baloo 2', cursive" }}>{score}</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Total Points</div>
            </div>

            {/* How to play */}
            <div className="play-card grad-purple" style={{ borderColor: 'rgba(167,139,250,0.3)' }}>
              <h5 style={{ fontWeight: 800, marginBottom: 12 }}>🎮 How to Play</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                <li>🎙️ Press the microphone</li>
                <li>👂 Read the hint carefully</li>
                <li>🗣️ Say the word clearly</li>
                <li>⭐ Earn 10 points per correct answer</li>
              </ul>
            </div>

            {/* Score History */}
            {history.length > 0 && (
              <div className="play-card">
                <h5 style={{ fontWeight: 800, marginBottom: 12 }}>📊 Recent</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 10, background: h.correct ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${h.correct ? 'var(--green)' : 'var(--red)'}` }}>
                      <span style={{ fontWeight: 700 }}>{h.emoji} {h.word}</span>
                      <span>{h.correct ? '✅ +10' : '❌ 0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  );
}
