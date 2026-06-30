import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './PageTransition.module.css';

interface Props {
  children: ReactNode;
}

export function PageTransition({ children }: Props) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <>
      {children}

      {/* Slide curtain: rises from bottom → covers → exits top */}
      <motion.div
        key={location.pathname}
        className={styles.curtain}
        initial={{ y: '100%' }}
        animate={{ y: ['100%', '0%', '0%', '-100%'] }}
        transition={{
          duration: 0.78,
          times: [0, 0.40, 0.56, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </>
  );
}
