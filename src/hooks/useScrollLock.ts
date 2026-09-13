import { useEffect } from 'react';

// Module-level ref count so independent lockers (mobile nav, lightbox, …) can
// each hold a lock without one's cleanup clobbering another's — previously
// each caller unconditionally reset document.body.style.overflow, so closing
// one while another was still open unlocked scroll early (or left it stuck).
let lockCount = 0;
let previousOverflow: string | null = null;

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow ?? '';
        previousOverflow = null;
      }
    };
  }, [locked]);
}
