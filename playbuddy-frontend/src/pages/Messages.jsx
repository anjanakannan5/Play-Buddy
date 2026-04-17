import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';



export default function Messages() {
  const { authFetch, user } = useAuth();
  const showToast = useToast();
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    authFetch('/api/messages/contacts').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setContacts(data);
      }
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (active) {
      const fetchMessages = () => {
        authFetch(`/api/messages/${active._id}`).then(r => r.json()).then(data => {
          if (Array.isArray(data)) setMessages(data);
        }).catch(() => {});
      };
      
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      
      // Mark as read when opening conversation
      authFetch(`/api/messages/mark-read/${active._id}`, { method: 'PUT' }).catch(() => {});
      
      return () => clearInterval(interval);
    }
  }, [active, authFetch]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    const newMsg = { _id: `local-${Date.now()}`, sender: 'me', text: text.trim(), createdAt: new Date() };
    
    setMessages(m => [...m, newMsg]);
    setText('');
    setSending(true);
    try {
      const res = await authFetch('/api/messages', { method: 'POST', body: JSON.stringify({ receiverId: active._id, text: text.trim() }) });
      if (!res.ok) throw new Error('Failed to send message');
      
      const savedMsg = await res.json();
      // Replace the local optimistic message with the real one from DB to get the actual `_id` and `createdAt`
      setMessages(m => m.map(msg => msg._id === newMsg._id ? savedMsg : msg));
    } catch {
      showToast('Could not send message', 'error');
      // Revert optimistic update on failure
      setMessages(m => m.filter(msg => msg._id !== newMsg._id));
    }
    
    setSending(false);
  };

  return (
    <DashboardLayout>
      <div className="dash-navbar">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Message Parents 💬</h3>
      </div>

      <div style={{ display: 'flex', height: 'calc(100dvh - 65px)', overflow: 'hidden' }}>
        {/* Contacts */}
        <div className={`contacts-panel ${active ? 'hide-mobile' : ''}`}>
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
        <div className={`chat-panel ${!active ? 'hide-mobile' : ''}`}>
          {active ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '2px solid var(--border)', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn-outline hide-desktop" style={{ padding: '6px 12px', fontSize: '1.2rem', marginRight: '4px', border: 'none' }} onClick={() => setActive(null)}>⬅️</button>
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
