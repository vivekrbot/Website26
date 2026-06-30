import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StampSeal } from '../StampSeal/StampSeal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './PageLoader.module.css';

interface Props { onDone: () => void; }

export function PageLoader({ onDone }: Props) {
  const reducedMotion = useReducedMotion();
  const [barFull,  setBarFull]  = useState(false);
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    if (reducedMotion) { onDone(); return; }
    const timers = [
      setTimeout(() => setBarFull(true),  60),    // bar begins filling
      setTimeout(() => setVisible(false), 1900),  // fade-out starts
      setTimeout(() => onDone(),          2400),  // loader fully gone
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.loader}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <div className={styles.content}>
            <StampSeal size={68} animate={false} opacity={1} />
            <p className={styles.brand}>ItsVivek.</p>
            <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100}>
              <div className={styles.fill} style={{ width: barFull ? '100%' : '0%' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
