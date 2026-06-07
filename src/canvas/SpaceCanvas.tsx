import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './SpaceCanvas.module.css';

/* ── Tuning constants ──────────────────────────────────────── */
const STAR_COUNT      = 120;
const ASTEROID_COUNT  = 10;
const GRAVITY_RADIUS  = 180;   // px — cursor influence radius
const GRAVITY_FORCE   = 0.018; // attraction strength
const ASTEROID_SPEED  = 0.12;  // max px/frame
const STAR_LAYERS     = 3;     // parallax depth layers

interface Star {
  x: number; y: number;
  size: number;
  opacity: number;
  layer: number;   // 0=far,1=mid,2=near
  twinkleOffset: number;
  twinkleSpeed: number;
}

interface Asteroid {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  vertices: { x: number; y: number }[];
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeAsteroidVertices(radius: number, count = 7): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const r = radius * randomBetween(0.65, 1.0);
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
  });
}

function initStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const layer = Math.floor(Math.random() * STAR_LAYERS);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size: layer === 0 ? randomBetween(0.4, 0.8)
           : layer === 1 ? randomBetween(0.8, 1.4)
           : randomBetween(1.4, 2.2),
      opacity: randomBetween(0.3, 0.9),
      layer,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: randomBetween(0.003, 0.012),
    };
  });
}

function initAsteroids(w: number, h: number): Asteroid[] {
  return Array.from({ length: ASTEROID_COUNT }, () => {
    const radius = randomBetween(12, 32);
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(0.04, ASTEROID_SPEED);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: randomBetween(-0.003, 0.003),
      opacity: randomBetween(0.12, 0.28),
      vertices: makeAsteroidVertices(radius),
    };
  });
}

export function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef(0);
  const hiddenRef = useRef(false);
  const isDarkRef = useRef(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    frameRef.current++;

    ctx.clearRect(0, 0, w, h);

    const isDark = isDarkRef.current;
    // Light mode: deep charcoal/navy so dots read clearly on white
    const starColor = isDark ? '255,255,255' : '20,20,50';
    const asteroidColor = isDark ? '180,190,220' : '40,40,90';
    // Multiply alpha up so elements are just as visible in light mode
    const alphaScale = isDark ? 1 : 2.8;

    // ── Stars ───────────────────────────────────────────────
    for (const star of starsRef.current) {
      const twinkle = Math.sin(frameRef.current * star.twinkleSpeed + star.twinkleOffset);
      const alpha = (star.opacity + twinkle * 0.18) * alphaScale;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starColor},${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
    }

    // ── Asteroids ────────────────────────────────────────────
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    for (const ast of asteroidsRef.current) {
      // Gravity: attract toward cursor
      const dx = mx - ast.x;
      const dy = my - ast.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < GRAVITY_RADIUS && dist > 0) {
        const force = GRAVITY_FORCE * (1 - dist / GRAVITY_RADIUS);
        ast.vx += (dx / dist) * force;
        ast.vy += (dy / dist) * force;
      }

      // Speed cap
      const speed = Math.sqrt(ast.vx * ast.vx + ast.vy * ast.vy);
      if (speed > ASTEROID_SPEED * 2) {
        ast.vx = (ast.vx / speed) * ASTEROID_SPEED * 2;
        ast.vy = (ast.vy / speed) * ASTEROID_SPEED * 2;
      }

      // Very gentle drift damping (not full stop)
      ast.vx *= 0.999;
      ast.vy *= 0.999;

      ast.x += ast.vx;
      ast.y += ast.vy;
      ast.rotation += ast.rotSpeed;

      // Wrap around edges
      if (ast.x < -ast.radius * 2) ast.x = w + ast.radius;
      if (ast.x > w + ast.radius * 2) ast.x = -ast.radius;
      if (ast.y < -ast.radius * 2) ast.y = h + ast.radius;
      if (ast.y > h + ast.radius * 2) ast.y = -ast.radius;

      // Draw polygon
      ctx.save();
      ctx.translate(ast.x, ast.y);
      ctx.rotate(ast.rotation);
      ctx.beginPath();
      const verts = ast.vertices;
      ctx.moveTo(verts[0].x, verts[0].y);
      for (let i = 1; i < verts.length; i++) {
        ctx.lineTo(verts[i].x, verts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${asteroidColor},${Math.min(1, ast.opacity * alphaScale)})`;
      ctx.lineWidth = isDark ? 1 : 1.5;
      ctx.stroke();

      // Subtle glow on nearby asteroids
      if (dist < GRAVITY_RADIUS * 1.2) {
        const glowAlpha = ast.opacity * alphaScale * 0.5 * (1 - dist / (GRAVITY_RADIUS * 1.2));
        ctx.strokeStyle = `rgba(${isDark ? '130,140,255' : '60,40,180'},${Math.min(1, glowAlpha)})`;
        ctx.lineWidth = isDark ? 1.5 : 2;
        ctx.stroke();
      }

      ctx.restore();
    }

    if (!hiddenRef.current) {
      rafRef.current = requestAnimationFrame(draw);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      starsRef.current = initStars(w, h);
      asteroidsRef.current = initAsteroids(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    if (!reducedMotion) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Static starfield only — draw once
      draw();
    }

    // Pause when tab hidden
    const onVisibility = () => {
      hiddenRef.current = document.hidden;
      if (!document.hidden && !reducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Track theme
    const observer = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.getAttribute('data-theme') !== 'light';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    isDarkRef.current = document.documentElement.getAttribute('data-theme') !== 'light';

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, [draw, reducedMotion]);

  // Mouse tracking — only on non-touch
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
      role="presentation"
    />
  );
}
