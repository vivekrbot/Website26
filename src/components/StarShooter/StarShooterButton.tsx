import { forwardRef } from 'react';
import styles from './StarShooter.module.css';

interface StarShooterButtonProps {
  onClick: () => void;
}

/* Pixel rocket, drawn rect-by-rect to stay crisp at any size. */
const PIXEL_SHIP = (
  <svg viewBox="0 0 7 7" aria-hidden="true">
    <rect x="3" y="0" width="1" height="2" />
    <rect x="2" y="2" width="3" height="2" />
    <rect x="1" y="4" width="5" height="1" />
    <rect x="0" y="5" width="2" height="1" />
    <rect x="3" y="5" width="1" height="1" />
    <rect x="5" y="5" width="2" height="1" />
    <rect x="0" y="6" width="1" height="1" />
    <rect x="3" y="6" width="1" height="1" />
    <rect x="6" y="6" width="1" height="1" />
  </svg>
);

export const StarShooterButton = forwardRef<HTMLButtonElement, StarShooterButtonProps>(
  function StarShooterButton({ onClick }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={styles.playButton}
        onClick={onClick}
        aria-haspopup="dialog"
        aria-label="Play Star Shooter, a mini space game"
      >
        <span className={styles.playIcon}>{PIXEL_SHIP}</span>
        <span className={styles.playLabel}>&#9654; Play</span>
      </button>
    );
  }
);
