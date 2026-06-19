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

      {/* Portal iris — opens from center, holds, closes back to center */}
      <motion.div
        key={`portal-${location.pathname}`}
        className={styles.portal}
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{
          clipPath: [
            'circle(0% at 50% 50%)',
            'circle(105% at 50% 50%)',
            'circle(105% at 50% 50%)',
            'circle(0% at 50% 50%)',
          ],
        }}
        transition={{
          duration: 0.88,
          times: [0, 0.40, 0.56, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </>
  );
}
