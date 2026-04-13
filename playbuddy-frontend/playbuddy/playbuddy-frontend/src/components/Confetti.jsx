import { useEffect } from 'react';

export function launchConfetti() {
  const colors = ['#38BDF8','#FBBF24','#F472B6','#34D399','#A78BFA','#FB923C'];
  const container = document.getElementById('confetti-root');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `left:${Math.random()*100}vw;top:-20px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-delay:${Math.random()*0.8}s;animation-duration:${1.5+Math.random()}s;transform:rotate(${Math.random()*360}deg)`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

export default function ConfettiRoot() {
  return <div id="confetti-root" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }} />;
}
