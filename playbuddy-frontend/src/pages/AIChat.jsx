import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import DarkToggle from '../components/DarkToggle';

const PROMPTS = [
  'Fun indoor activities for rainy days? ☔',
  'How do I help my child make friends? 👫',
  'Best learning games for 5-year-olds? 🎮',
  'How to handle tantrums kindly? 💜',
  'Ideas for a birthday playdate? 🎂',
  'Tips for screen-time balance? 📱',
];

export default function AIChat() {
  const { authFetch } = useAuth();
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: 'Hi there! 👋 I\'m PlayBuddy AI, your friendly parenting assistant! I\'m here to help with playdates, learning tips, activity ideas, and much more. What can I help you with today? 💜' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || typing) return;
    setInput('');
    setMessages(m => [...m, { id: Date.now(), role: 'user', text: msg }]);
    setTyping(true);

    try {
      const res = await authFetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      setMessages(m => [...m, { id: Date.now() + 1, role: 'bot', text: data.reply || 'I\'m here to help! 💜' }]);
    } catch {
      setMessages(m => [...m, { id: Date.now() + 1, role: 'bot', text: 'Oops! I had a little hiccup. Please try again! 💜' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dash-navbar">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>AI Chat 🤖</h3>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 65px)', padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg,var(--purple),var(--sky))', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤖</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>PlayBuddy AI Assistant</div>
              <div style={{ opacity: 0.85, fontSize: '0.85rem', fontWeight: 600 }}>Always here to help 💜</div>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div style={{ padding: '12px 20px', borderBottom: '2px solid var(--border)', background: 'var(--card-bg)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PROMPTS.map(p => (
            <button key={p} className="filter-chip" style={{ fontSize: '0.8rem', padding: '5px 12px' }} onClick={() => send(p)}>{p}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} className={`ai-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {msg.role === 'bot' && (
                <div className="bot-avatar">🤖</div>
              )}
              <div className="bubble-inner" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
            </div>
          ))}
          {typing && (
            <div className="ai-bubble bot">
              <div className="bot-avatar">🤖</div>
              <div className="bubble-inner">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '2px solid var(--border)', background: 'var(--card-bg)', display: 'flex', gap: 10 }}>
          <input
            className="chat-input"
            placeholder="Ask me anything about parenting, activities, or kids! 💬"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={typing}
          />
          <button className="btn-playbuddy" style={{ padding: '10px 20px', flexShrink: 0 }} onClick={() => send()} disabled={!input.trim() || typing}>
            {typing ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
