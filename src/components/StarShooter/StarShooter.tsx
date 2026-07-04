import { useCallback, useEffect, useRef, useState } from 'react';
import { StarShooterButton } from './StarShooterButton';
import { StarShooterOverlay } from './StarShooterOverlay';

/* Duration must cover the CSS flicker animation (0.55s) in global.css. */
const FLICKER_MS = 560;

type Phase = 'idle' | 'exiting' | 'playing' | 'entering';

/**
 * Star Shooter entry point: a floating play button that CRT-flickers the
 * whole site (#root) out, runs the game as a fullscreen overlay portaled
 * to <body>, then flickers the site back in on close.
 */
export function StarShooter() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timerRef = useRef<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    setPhase((current) => {
      if (current !== 'idle') return current;
      document.body.classList.add('game-flicker-out');
      document.body.style.overflow = 'hidden';
      timerRef.current = window.setTimeout(() => {
        document.body.classList.remove('game-flicker-out');
        document.body.classList.add('game-hidden');
        setPhase('playing');
      }, FLICKER_MS);
      return 'exiting';
    });
  }, []);

  const close = useCallback(() => {
    setPhase((current) => {
      if (current !== 'playing') return current;
      document.body.classList.remove('game-hidden');
      document.body.classList.add('game-flicker-in');
      timerRef.current = window.setTimeout(() => {
        document.body.classList.remove('game-flicker-in');
        document.body.style.overflow = '';
        setPhase('idle');
        buttonRef.current?.focus();
      }, FLICKER_MS);
      return 'entering';
    });
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
      document.body.classList.remove('game-flicker-out', 'game-hidden', 'game-flicker-in');
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {phase !== 'playing' && <StarShooterButton ref={buttonRef} onClick={open} />}
      {phase === 'playing' && <StarShooterOverlay onClose={close} />}
    </>
  );
}
