import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './SpaceCanvas.module.css';

/* ── Tuning constants ──────────────────────────────────────── */
const STAR_COUNT        = 120;
const ASTEROID_COUNT    = 10;

/* Network constellation */
const NET_COUNT     = 55;    // floating joint particles
const NET_LINK_DIST = 140;   // max px to draw a connection line
const NET_MOUSE_R   = 200;   // cursor attraction radius
const NET_MOUSE_K   = 0.00022; // attraction strength (very gentle)
const GRAVITY_RADIUS    = 180;   // px — cursor influence radius
const GRAVITY_FORCE     = 0.018; // attraction strength
const ASTEROID_SPEED    = 0.12;  // max px/frame
const STAR_LAYERS       = 3;     // parallax depth layers
const SHOOT_INTERVAL_MS  = 5000; // base ms between shooting stars (5–6 s range)
const SHOOT_JITTER_MS    = 1000; // ± jitter so interval is 5–6 s
const SHOOT_TRAIL_LEN    = 280;  // fixed trail length in px behind the head
const SHOOT_DURATION_MS  = 3000; // how long each star takes to cross the screen (3 s)

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

interface NetParticle {
  x: number; y: number;
  vx: number; vy: number;
  sz: number;
  op: number;
}

interface ShootingStar {
  ox: number; oy: number;  // origin (spawn point)
  vx: number; vy: number;  // velocity in px/ms
  startTime: number;       // Date.now() when spawned
  duration: number;        // total ms to live
  opacity: number;         // peak opacity
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

function spawnShootingStar(w: number, h: number): ShootingStar {
  // Direction: true = left-to-right, false = right-to-left
  const goRight = Math.random() > 0.5;

  // Angle from horizontal: 20°–40° (shallow, natural meteor feel)
  // Always travels downward (positive vy) — meteors fall, they don't rise
  const angleDeg = randomBetween(20, 40);
  const angleRad = (angleDeg * Math.PI) / 180;

  // Duration has slight variation: 2.6–3.4 s around the 3 s target
  const duration = SHOOT_DURATION_MS + randomBetween(-400, 400);

  // Total distance the head must travel in `duration` ms:
  // from off-screen edge to the opposite off-screen edge
  const totalDist = w + SHOOT_TRAIL_LEN * 2;

  // Speed in px/ms derived from distance and duration, split by angle
  const totalSpeed = totalDist / duration; // px/ms along the travel direction
  const vx = (goRight ? 1 : -1) * Math.cos(angleRad) * totalSpeed;
  const vy = Math.sin(angleRad) * totalSpeed; // positive = downward

  // Spawn position: just off the leading edge, random Y in upper 65% of screen
  const x = goRight ? -SHOOT_TRAIL_LEN : w + SHOOT_TRAIL_LEN;
  const y = randomBetween(h * 0.05, h * 0.65);

  return { ox: x, oy: y, vx, vy, startTime: Date.now(), duration, opacity: randomBetween(0.75, 1.0) };
}

function initNetParticles(w: number, h: number): NetParticle[] {
  return Array.from({ length: NET_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: randomBetween(-0.22, 0.22),
    vy: randomBetween(-0.22, 0.22),
    sz: randomBetween(0.9, 1.7),
    op: randomBetween(0.22, 0.55),
  }));
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
  const netRef = useRef<NetParticle[]>([]);
  const cssSizeRef = useRef({ w: 0, h: 0 });
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nextShootRef = useRef<number>(Date.now() + SHOOT_INTERVAL_MS);
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

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // ── Stars ───────────────────────────────────────────────
    for (const star of starsRef.current) {
      const twinkle = Math.sin(frameRef.current * star.twinkleSpeed + star.twinkleOffset);
      const alpha = (star.opacity + twinkle * 0.18) * alphaScale;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starColor},${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
    }

    // ── Network constellation (auto-joint particles) ─────────
    {
      const { w: cssW, h: cssH } = cssSizeRef.current;
      const net = netRef.current;
      const netColor = isDark ? '160,170,255' : '50,40,200';

      for (const p of net) {
        // Gentle cursor attraction
        const dmx = mx - p.x;
        const dmy = my - p.y;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < NET_MOUSE_R && dm > 0) {
          p.vx += (dmx / dm) * NET_MOUSE_K * (1 - dm / NET_MOUSE_R);
          p.vy += (dmy / dm) * NET_MOUSE_K * (1 - dm / NET_MOUSE_R);
        }
        // Speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 0.5) { p.vx = (p.vx / spd) * 0.5; p.vy = (p.vy / spd) * 0.5; }
        p.vx *= 0.994;
        p.vy *= 0.994;
        p.x += p.vx;
        p.y += p.vy;
        // Wrap edges
        if (p.x < 0) p.x = cssW;
        if (p.x > cssW) p.x = 0;
        if (p.y < 0) p.y = cssH;
        if (p.y > cssH) p.y = 0;
      }

      // Draw connection lines
      ctx.lineWidth = 0.65;
      for (let i = 0; i < net.length; i++) {
        for (let j = i + 1; j < net.length; j++) {
          const a = net[i];
          const b = net[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < NET_LINK_DIST) {
            const lineAlpha = (1 - d / NET_LINK_DIST) * 0.22 * alphaScale;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${netColor},${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of net) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${netColor},${p.op * alphaScale})`;
        ctx.fill();
      }
    }

    // ── Asteroids ────────────────────────────────────────────

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

    // ── Shooting stars ───────────────────────────────────────
    const now = Date.now();
    if (now >= nextShootRef.current) {
      shootingStarsRef.current.push(spawnShootingStar(w, h));
      // Next spawn in 5–6 s
      nextShootRef.current = now + SHOOT_INTERVAL_MS + randomBetween(0, SHOOT_JITTER_MS);
    }

    const headColor  = isDark ? '220,235,255' : '50,30,180';
    const trailColor = isDark ? '160,185,255' : '70,50,210';

    // Remove stars that have exceeded their lifetime
    shootingStarsRef.current = shootingStarsRef.current.filter(
      (s) => now - s.startTime < s.duration
    );

    for (const s of shootingStarsRef.current) {
      const elapsed = now - s.startTime;
      // t: 0→1 over lifetime. Fade in first 8%, hold, fade out last 15%
      const t = elapsed / s.duration;
      const fadeIn  = Math.min(1, t / 0.08);
      const fadeOut = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
      const lifeFactor = fadeIn * fadeOut;

      // Position derived from origin + velocity * elapsed (frame-rate independent)
      const hx = s.ox + s.vx * elapsed;
      const hy = s.oy + s.vy * elapsed;

      // Mouse proximity
      const dxM = mx - hx;
      const dyM = my - hy;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      const mouseBoost = distM < GRAVITY_RADIUS * 1.5
        ? 1 + 0.6 * (1 - distM / (GRAVITY_RADIUS * 1.5))
        : 1;

      const alpha = Math.min(1, s.opacity * lifeFactor * mouseBoost * (isDark ? 1 : 1.5));

      // Unit vector in direction of travel (normalised velocity)
      const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const ux = s.vx / spd;
      const uy = s.vy / spd;

      // Tail: exactly SHOOT_TRAIL_LEN px behind the head along the travel angle
      const tailX = hx - ux * SHOOT_TRAIL_LEN;
      const tailY = hy - uy * SHOOT_TRAIL_LEN;

      // ── Core trail (sharp, bright) ──
      const grad = ctx.createLinearGradient(tailX, tailY, hx, hy);
      grad.addColorStop(0,   `rgba(${trailColor},0)`);
      grad.addColorStop(0.5, `rgba(${trailColor},${alpha * 0.35})`);
      grad.addColorStop(1,   `rgba(${headColor},${alpha})`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isDark ? 2 : 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // ── Soft glow trail (wide, diffuse) ──
      const gradGlow = ctx.createLinearGradient(tailX, tailY, hx, hy);
      gradGlow.addColorStop(0, `rgba(${trailColor},0)`);
      gradGlow.addColorStop(1, `rgba(${trailColor},${alpha * 0.12})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = gradGlow;
      ctx.lineWidth = isDark ? 10 : 12;
      ctx.stroke();
      ctx.restore();

      // ── Head: bright dot ──
      ctx.beginPath();
      ctx.arc(hx, hy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${headColor},${alpha})`;
      ctx.fill();

      // ── Head: radial halo (always on) ──
      const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
      halo.addColorStop(0, `rgba(${headColor},${alpha * 0.5})`);
      halo.addColorStop(1, `rgba(${headColor},0)`);
      ctx.beginPath();
      ctx.arc(hx, hy, 14, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // ── Mouse proximity burst ──
      if (distM < GRAVITY_RADIUS * 1.5) {
        const burstR = 24;
        const burst = ctx.createRadialGradient(hx, hy, 0, hx, hy, burstR);
        burst.addColorStop(0, `rgba(${isDark ? '200,215,255' : '120,100,255'},${alpha * 0.45})`);
        burst.addColorStop(1, `rgba(${isDark ? '160,180,255' : '100,80,255'},0)`);
        ctx.beginPath();
        ctx.arc(hx, hy, burstR, 0, Math.PI * 2);
        ctx.fillStyle = burst;
        ctx.fill();
      }
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
      cssSizeRef.current = { w, h };
      starsRef.current = initStars(w, h);
      netRef.current = initNetParticles(w, h);
      asteroidsRef.current = initAsteroids(w, h);
      shootingStarsRef.current = [];
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
