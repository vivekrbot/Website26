import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StampSeal } from '../StampSeal/StampSeal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './SplashScreen.module.css';

const PALETTE = ['255,255,255', '129,140,248', '34,211,238'] as const;
const N = 180;

interface WarpStar {
  a: number;
  r: number;
  spd: number;
  init: number;
  col: 0 | 1 | 2;
}

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function pickCol(): 0 | 1 | 2 {
  const v = Math.random();
  return v < 0.60 ? 0 : v < 0.85 ? 1 : 2;
}

function makeStars(n: number): WarpStar[] {
  return Array.from({ length: n }, () => {
    const s = rnd(1.5, 4);
    return { a: Math.random() * Math.PI * 2, r: rnd(5, 80), spd: s, init: s, col: pickCol() };
  });
}

interface Props { onDone: () => void; }

export function SplashScreen({ onDone }: Props) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const starsRef  = useRef<WarpStar[]>([]);
  const phaseRef  = useRef<'warp' | 'ambient' | 'exit'>('warp');
  const sizeRef   = useRef({ w: 0, h: 0 });

  const [showFlash, setShowFlash] = useState(false);
  const [showLogo,  setShowLogo]  = useState(false);
  const [exiting,   setExiting]   = useState(false);

  useEffect(() => {
    if (!reducedMotion) return;
    onDone();
  }, [reducedMotion, onDone]);

  useEffect(() => {
    if (reducedMotion) return;
    const ts = [
      setTimeout(() => setShowFlash(true),                                          680),
      setTimeout(() => setShowFlash(false),                                         850),
      setTimeout(() => { phaseRef.current = 'ambient'; setShowLogo(true); },        900),
      setTimeout(() => { phaseRef.current = 'exit';    setExiting(true); },        2300),
      setTimeout(() => onDone(),                                                    3000),
    ];
    return () => ts.forEach(clearTimeout);
  }, [onDone, reducedMotion]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy) * 1.05;
    const phase = phaseRef.current;

    ctx.fillStyle = phase !== 'ambient' ? 'rgba(4,5,9,0.18)' : 'rgba(4,5,9,0.05)';
    ctx.fillRect(0, 0, w, h);

    for (const star of starsRef.current) {
      const prevR = star.r;
      if (phase === 'warp') star.spd *= 1.055;
      else if (phase === 'exit') star.spd *= 1.10;
      star.r += star.spd;

      const overshot = phase === 'ambient' ? star.r > maxR * 0.65 : star.r > maxR;
      if (overshot) {
        star.r   = phase === 'ambient' ? rnd(20, maxR * 0.14) : rnd(5, 30);
        star.spd = phase === 'ambient' ? rnd(0.3, 0.8) : star.init;
        continue;
      }

      const x  = cx + Math.cos(star.a) * star.r;
      const y  = cy + Math.sin(star.a) * star.r;
      const px = cx + Math.cos(star.a) * prevR;
      const py = cy + Math.sin(star.a) * prevR;
      const fadeIn = Math.min(1, star.r / (maxR * 0.18));
      const rgb = PALETTE[star.col];

      if (phase === 'ambient') {
        ctx.beginPath();
        ctx.arc(x, y, 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${fadeIn * 0.35})`;
        ctx.fill();
      } else {
        const op = phase === 'exit' ? Math.min(1, fadeIn * 1.3) : fadeIn * 0.9;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(${rgb},${op})`;
        ctx.lineWidth = phase === 'exit' ? 1.1 : 0.85;
        ctx.stroke();
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    sizeRef.current = { w, h };
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#040509';
      ctx.fillRect(0, 0, w, h);
    }
    starsRef.current = makeStars(N);
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <motion.div
      className={styles.splash}
      data-theme="dark"
      role="presentation"
      aria-hidden="true"
      animate={exiting ? { opacity: 0, scale: 1.04 } : {}}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />

      <motion.div
        className={styles.flash}
        animate={{ opacity: showFlash ? 1 : 0 }}
        transition={{ duration: 0.085 }}
      />

      <AnimatePresence>
        {showLogo && (
          <motion.div
            key="splash-content"
            className={styles.content}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <StampSeal size={120} animate={false} opacity={1} />
            <motion.p
              className={styles.brandName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              ItsVivek.
            </motion.p>
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.42 }}
              transition={{ delay: 0.34, duration: 0.4 }}
            >
              Product Design &amp; Strategy
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
