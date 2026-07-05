import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={styles.toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.icon}>{isDark ? '☀' : '☽'}</span>
      </span>
    </button>
  );
}
