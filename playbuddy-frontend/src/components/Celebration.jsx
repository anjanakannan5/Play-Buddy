export default function Celebration({ emoji, title, message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box text-center bounce-in" onClick={e => e.stopPropagation()}
        style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: '5rem', marginBottom: 16 }}>{emoji}</div>
        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 24 }}>{message}</p>
        <button className="btn-playbuddy" onClick={onClose}>🎉 Awesome!</button>
      </div>
    </div>
  );
}
