import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEMO_CONTACTS = [
  { _id: 'c1', name: 'Emma\'s Mom - Lisa', avatar: '👩', lastMsg: 'See you at the park! 🌳' },
  { _id: 'c2', name: 'Jake\'s Dad - Tom', avatar: '👨', lastMsg: 'Sounds great! The kids will love it' },
  { _id: 'c3', name: 'Sophie\'s Mom - Anna', avatar: '👩‍🦰', lastMsg: 'Can\'t wait for the playdate! 🎉' },
  { _id: 'c4', name: 'PlayBuddy Support', avatar: '🤖', lastMsg: 'How can we help you today?' },
];

const DEMO_MESSAGES = {
  c1: [
    { _id: 'm1', sender: 'c1', text: 'Hey! Are you coming to the painting event this Saturday?', createdAt: new Date(Date.now() - 3600000) },
    { _id: 'm2', sender: 'me', text: 'Yes! Emma is so excited about it 🎨', createdAt: new Date(Date.now() - 3500000) },
    { _id: 'm3', sender: 'c1', text: 'See you at the park! 🌳', createdAt: new Date(Date.now() - 3400000) },
  ],
  c2: [
    { _id: 'm4', sender: 'c2', text: 'The soccer tournament is going to be amazing!', createdAt: new Date(Date.now() - 7200000) },
    { _id: 'm5', sender: 'me', text: 'Liam has been practicing all week!', createdAt: new Date(Date.now() - 7100000) },
    { _id: 'm6', sender: 'c2', text: 'Sounds great! The kids will love it', createdAt: new Date(Date.now() - 7000000) },
  ],
};

export default function Messages() {
  const { authFetch, user } = useAuth();
  const showToast = useToast();
  const [contacts, setContacts] = useState(DEMO_CONTACTS);
  const [active, setActive] = useState(DEMO_CONTACTS[0]);
  const [messages, setMessages] = useState(DEMO_MESSAGES['c1'] || []);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    authFetch('/api/messages/contacts').then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setContacts([...data, ...DEMO_CONTACTS]);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (active) {
      const demo = DEMO_MESSAGES[active._id] || [];
      if (active._id.startsWith('c')) {
        setMessages(demo);
      } else {
        authFetch(`/api/messages/${active._id}`).then(r => r.json()).then(data => {
          if (Array.isArray(data)) setMessages([...demo, ...data]);
        }).catch(() => setMessages(demo));
      }
    }
  }, [active]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    const newMsg = { _id: `local-${Date.now()}`, sender: 'me', text: text.trim(), createdAt: new Date() };
    setMessages(m => [...m, newMsg]);
    setText('');
    setSending(true);

    if (!active._id.startsWith('c')) {
      try {
        await authFetch('/api/messages', { method: 'POST', body: JSON.stringify({ receiverId: active._id, text: text.trim() }) });
      } catch { showToast('Could not send message', 'error'); }
    }

    // Simulate reply for demo contacts
    if (active._id.startsWith('c')) {
      const replies = ["That's so exciting! 🎉", "Great idea! Let's do it! 🌟", "Our kids are going to love that! 😄", "Sounds perfect! 🎈", "Can't wait! See you then! 👋"];
      setTimeout(() => {
        setMessages(m => [...m, { _id: `reply-${Date.now()}`, sender: active._id, text: replies[Math.floor(Math.random() * replies.length)], createdAt: new Date() }]);
      }, 1200);
    }
    setSending(false);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
        {/* Contacts */}
        <div className="contacts-panel" style={{ width: 280, flexShrink: 0 }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '2px solid var(--border)', fontWeight: 800, fontSize: '1rem' }}>
            💬 Messages
          </div>
          {contacts.map(c => (
            <div key={c._id} className={`contact-item ${active?._id === c._id ? 'active' : ''}`} onClick={() => setActive(c)}>
              <div className="contact-avatar" style={{ background: 'linear-gradient(135deg,var(--sky),var(--purple))', position: 'relative' }}>
                {c.avatar || '👤'}
                <div style={{ width: 10, height: 10, background: 'var(--green)', borderRadius: '50%', border: '2px solid white', position: 'absolute', bottom: 0, right: 0 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 2 }}>{c.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg || '...'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="chat-panel">
          {active ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '2px solid var(--border)', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="contact-avatar" style={{ width: 42, height: 42, fontSize: '1.3rem', background: 'linear-gradient(135deg,var(--sky),var(--purple))' }}>{active.avatar || '👤'}</div>
                <div>
                  <div style={{ fontWeight: 800 }}>{active.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 700 }}>● Online</div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map(msg => {
                  const isMe = msg.sender === 'me' || msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={msg._id} className={`msg-bubble ${isMe ? 'sent' : 'received'}`}>
                      {msg.text}
                      <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: 4 }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="chat-input-area">
                <input
                  className="chat-input"
                  placeholder="Type a message..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn-playbuddy" style={{ padding: '10px 20px', fontSize: '0.9rem' }} onClick={sendMessage} disabled={!text.trim()}>
                  Send 🚀
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: 12 }}>💬</div>
                <div style={{ fontWeight: 700 }}>Select a contact to start chatting</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
