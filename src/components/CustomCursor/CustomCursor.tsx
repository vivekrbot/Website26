import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isFine] = useState(() => window.matchMedia('(pointer: fine)').matches);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 };
  const ringX = useSpring(rawX, springConfig);
  const ringY = useSpring(rawY, springConfig);

  const frameRef = useRef<number>(0);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!isFine) return;

    const update = () => {
      rawX.set(posRef.current.x);
      rawY.set(posRef.current.y);
      frameRef.current = requestAnimationFrame(update);
    };
    frameRef.current = requestAnimationFrame(update);

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(!!t.closest('a, button, [data-magnetic], [data-cursor="hover"]'));
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isFine, rawX, rawY]);

  if (!isFine) return null;

  const dotSize = clicking ? 6 : hovered ? 10 : 8;
  const ringSize = clicking ? 28 : hovered ? 52 : 36;

  return (
    <>
      {/* Dot — follows instantly via rawX/rawY */}
      <motion.div
        className={styles.dot}
        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          width: dotSize,
          height: dotSize,
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring — lags behind with spring */}
      <motion.div
        className={styles.ring}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          borderColor: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.85)',
          backgroundColor: hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
