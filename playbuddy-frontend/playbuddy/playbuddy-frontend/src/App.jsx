import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ConfettiRoot from './components/Confetti';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import Events from './pages/Events';
import Messages from './pages/Messages';
import Learning from './pages/Learning';
import VoiceGame from './pages/VoiceGame';
import AIChat from './pages/AIChat';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ConfettiRoot />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-child" element={<AddChild />} />
              <Route path="/events" element={<Events />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/voice-game" element={<VoiceGame />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
