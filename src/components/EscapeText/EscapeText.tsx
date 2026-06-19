import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './EscapeText.module.css';

/* Shared "escape" text effect: each word springs away from the cursor
   and snaps back. Used for all section headings, subheadings, and the
   hero text so the interaction is consistent site-wide. */

const ESCAPE_THRESHOLD = 65;
const ESCAPE_FORCE     = 25;
const SPRING_CONFIG    = { stiffness: 420, damping: 28, mass: 0.35 };

export function EscapeWord({ word, className }: { word: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const sx = useSpring(ox, SPRING_CONFIG);
  const sy = useSpring(oy, SPRING_CONFIG);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // AABB early-exit avoids heavy math for far-away words
      if (
        e.clientX < rect.left   - ESCAPE_THRESHOLD ||
        e.clientX > rect.right  + ESCAPE_THRESHOLD ||
        e.clientY < rect.top    - ESCAPE_THRESHOLD ||
        e.clientY > rect.bottom + ESCAPE_THRESHOLD
      ) {
        if (ox.get() !== 0) ox.set(0);
        if (oy.get() !== 0) oy.set(0);
        return;
      }
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < ESCAPE_THRESHOLD && dist > 0) {
        const force = Math.pow(1 - dist / ESCAPE_THRESHOLD, 1.5) * ESCAPE_FORCE;
        ox.set(-(dx / dist) * force);
        oy.set(-(dy / dist) * force);
      } else {
        if (ox.get() !== 0) ox.set(0);
        if (oy.get() !== 0) oy.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [ox, oy]);

  return (
    <motion.span
      ref={ref}
      className={`${styles.escapeWord}${className ? ` ${className}` : ''}`}
      style={{ x: sx, y: sy }}
    >
      {word}
    </motion.span>
  );
}

interface EscapeTextProps {
  text: string;
  /** class on the wrapping span */
  className?: string;
  /** class applied to each individual word (e.g. "gradient-text") */
  wordClassName?: string;
}

export function EscapeText({ text, className, wordClassName }: EscapeTextProps) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className={styles.wordWrap}>
          <EscapeWord word={word} className={wordClassName} />
          {i < words.length - 1 && <span className={styles.wordSpace}>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
