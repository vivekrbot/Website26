import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import styles from './PageTransition.module.css';

interface Props {
  children: ReactNode;
}

const ease = [0.76, 0, 0.24, 1] as const;

export function PageTransition({ children }: Props) {
  const location = useLocation();

  return (
    <>
      {children}

      {/* Curtain wipe — sweeps in from bottom, exits to top */}
      <AnimatePresence>
        <motion.div
          key={`curtain-${location.pathname}`}
          className={styles.curtain}
          initial={{ scaleY: 0, transformOrigin: 'bottom' }}
          animate={{
            scaleY: [0, 1, 1, 0],
            transformOrigin: ['bottom', 'bottom', 'top', 'top'],
          }}
          transition={{ duration: 0.68, times: [0, 0.42, 0.58, 1], ease }}
        />
      </AnimatePresence>
    </>
  );
}
