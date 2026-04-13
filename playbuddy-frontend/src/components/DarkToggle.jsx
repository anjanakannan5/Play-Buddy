import { useTheme } from '../context/ThemeContext';

export default function DarkToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button className="dark-toggle" onClick={toggle} aria-label="Toggle dark mode">
      <div className="dark-toggle-circle">{dark ? '🌙' : '☀️'}</div>
    </button>
  );
}
