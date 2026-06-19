import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './HeroCanvas.module.css';

/* ── Tuning ──────────────────────────────────────────────── */
const RING_DEFS = [
  { rFrac: 0.182, count: 8,  spd: 0.0022 },
  { rFrac: 0.272, count: 12, spd: 0.0014 },
  { rFrac: 0.368, count: 16, spd: 0.0009 },
  { rFrac: 0.480, count: 10, spd: 0.0006 },
] as const;

const FREE_COUNT    = 36;
const AMBIENT_COUNT = 160;
const CONNECT_DIST  = 115;
const REPULSE_R     = 160;
const REPULSE_K     = 3.8;
const SPRING_K      = 0.030;
const DAMP          = 0.86;

/* Dark palette: white, soft indigo, cyan */
const COLORS_DARK  = ['255,255,255', '129,140,248', '34,211,238'] as const;
/* Light palette: indigo-700, violet-700, sky-500 — visible on white */
const COLORS_LIGHT = ['67,56,202',   '109,40,217',  '14,165,233'] as const;

type ColIdx = 0 | 1 | 2;

interface Particle {
  x: number; y: number;
  bx: number; by: number;
  vx: number; vy: number;
  r: number;
  a: number;
  spd: number;
  sz: number;
  op: number;
  col: ColIdx;
  ambient: boolean;
}

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function pickColIdx(): ColIdx {
  const r = Math.random();
  return r < 0.38 ? 0 : r < 0.72 ? 1 : 2;
}

function buildParticles(w: number, h: number): Particle[] {
  const cx = w / 2;
  const cy = h / 2;
  const ref = Math.min(w, h);
  const s = Math.min(1.08, Math.max(0.4, ref / 900));
  const ps: Particle[] = [];

  for (const ring of RING_DEFS) {
    const R = ref * ring.rFrac * s;
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 + rand(-0.25, 0.25);
      const r = R * rand(0.88, 1.12);
      const bx = cx + Math.cos(angle) * r;
      const by = cy + Math.sin(angle) * r;
      ps.push({
        x: bx, y: by, bx, by,
        vx: 0, vy: 0,
        r, a: angle,
        spd: ring.spd * rand(0.82, 1.18) * (Math.random() < 0.5 ? 1 : -1),
        sz: rand(1.0, 2.6),
        op: rand(0.55, 1.0),
        col: pickColIdx(),
        ambient: false,
      });
    }
  }

  const maxR = ref * RING_DEFS[2].rFrac * s;
  for (let i = 0; i < FREE_COUNT; i++) {
    const a = rand(0, Math.PI * 2);
    const r = rand(22, maxR * 0.95);
    const bx = cx + Math.cos(a) * r;
    const by = cy + Math.sin(a) * r;
    ps.push({
      x: bx, y: by, bx, by,
      vx: rand(-0.1, 0.1), vy: rand(-0.1, 0.1),
      r, a,
      spd: rand(-0.00015, 0.00015),
      sz: rand(0.7, 1.8),
      op: rand(0.25, 0.52),
      col: pickColIdx(),
      ambient: false,
    });
  }

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const bx = rand(0, w);
    const by = rand(0, h);
    ps.push({
      x: bx, y: by, bx, by,
      vx: 0, vy: 0,
      r: 0, a: 0, spd: 0,
      sz: rand(0.25, 0.75),
      op: rand(0.12, 0.32),
      col: (Math.random() < 0.55 ? 0 : 1) as ColIdx,
      ambient: true,
    });
  }

  return ps;
}

export function HeroCanvas() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const rafRef        = useRef<number>(0);
  const particlesRef  = useRef<Particle[]>([]);
  const sizeRef       = useRef({ w: 0, h: 0 });
  const mouseRef      = useRef({ x: -9999, y: -9999 });
  const hiddenRef     = useRef(false);
  const isDarkRef     = useRef(true);
  const frameRef      = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    if (!w || !h) { rafRef.current = requestAnimationFrame(draw); return; }

    const cx = w / 2;
    const cy = h / 2;
    const ref = Math.min(w, h);
    const s = Math.min(1.08, Math.max(0.4, ref / 900));
    const isDark = isDarkRef.current;
    const palette = isDark ? COLORS_DARK : COLORS_LIGHT;
    /* Light mode: particles are dark on light bg — no need to dim them further */
    const aScale = isDark ? 1.0 : 0.82;
    /* Bond lines are more subtle in light mode to avoid noise */
    const bondRGB  = isDark ? '129,140,248' : '67,56,202';
    const ringRGB  = isDark ? '99,102,241'  : '67,56,202';
    /* Ring outline more opaque in light mode for visibility */
    const ringMult = isDark ? 1.0 : 2.4;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    frameRef.current++;

    ctx.clearRect(0, 0, w, h);

    /* Cursor ambient glow */
    if (mx > -1000 && my > -1000) {
      const cgRadius = 130;
      const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, cgRadius);
      cursorGlow.addColorStop(0,   `rgba(${palette[1]},${0.12 * aScale})`);
      cursorGlow.addColorStop(0.5, `rgba(${palette[0]},${0.05 * aScale})`);
      cursorGlow.addColorStop(1,   `rgba(${palette[0]},0)`);
      ctx.beginPath();
      ctx.arc(mx, my, cgRadius, 0, Math.PI * 2);
      ctx.fillStyle = cursorGlow;
      ctx.fill();
    }

    /* Orbital ring outlines */
    RING_DEFS.forEach((ring, idx) => {
      const R = ref * ring.rFrac * s;
      const ringOpacity = (0.13 - idx * 0.02) * aScale * ringMult;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ringRGB},${ringOpacity})`;
      ctx.lineWidth = 0.6;
      ctx.setLineDash([3, 11]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    /* Physics update */
    const ps = particlesRef.current;
    for (const p of ps) {
      if (!p.ambient) {
        p.a  += p.spd;
        p.bx  = cx + Math.cos(p.a) * p.r;
        p.by  = cy + Math.sin(p.a) * p.r;
      }

      p.vx += (p.bx - p.x) * SPRING_K;
      p.vy += (p.by - p.y) * SPRING_K;

      const dmx = p.x - mx;
      const dmy = p.y - my;
      const dM  = Math.sqrt(dmx * dmx + dmy * dmy);
      if (dM < REPULSE_R && dM > 1) {
        const k = p.ambient ? REPULSE_K * 0.35 : REPULSE_K;
        const f = (k * (1 - dM / REPULSE_R)) / dM;
        p.vx += dmx * f;
        p.vy += dmy * f;
      }

      p.vx *= DAMP;
      p.vy *= DAMP;
      p.x  += p.vx;
      p.y  += p.vy;
    }

    /* Bond lines */
    ctx.lineWidth = 0.55;
    for (let i = 0; i < ps.length; i++) {
      if (ps[i].ambient) continue;
      for (let j = i + 1; j < ps.length; j++) {
        if (ps[j].ambient) continue;
        const a = ps[i];
        const b = ps[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${bondRGB},${(1 - d / CONNECT_DIST) * 0.20 * aScale})`;
          ctx.stroke();
        }
      }
    }

    /* Render particles */
    for (const p of ps) {
      const col = palette[p.col];
      const al  = p.op * aScale;

      if (!p.ambient) {
        const gr = p.sz * 4.5;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        glow.addColorStop(0, `rgba(${col},${al * 0.5})`);
        glow.addColorStop(1, `rgba(${col},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${al})`;
      ctx.fill();
    }

    /* Centre pulse glow */
    const cgR   = ref * 0.22 * s;
    const pulse = 0.07 + 0.022 * Math.sin(frameRef.current * 0.018);
    const cg    = ctx.createRadialGradient(cx, cy, 0, cx, cy, cgR);
    cg.addColorStop(0,   `rgba(${palette[0]},${pulse * aScale * 0.9})`);
    cg.addColorStop(0.4, `rgba(${palette[1]},${pulse * 0.55 * aScale})`);
    cg.addColorStop(1,   `rgba(${palette[0]},0)`);
    ctx.beginPath();
    ctx.arc(cx, cy, cgR, 0, Math.PI * 2);
    ctx.fillStyle = cg;
    ctx.fill();

    if (!hiddenRef.current) {
      rafRef.current = requestAnimationFrame(draw);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr    = Math.min(window.devicePixelRatio, 2);
      const parent = canvas.parentElement;
      const w = parent ? parent.offsetWidth  : window.innerWidth;
      const h = parent ? parent.offsetHeight : window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      sizeRef.current      = { w, h };
      particlesRef.current = buildParticles(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    if (!reducedMotion) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    const onVis = () => {
      hiddenRef.current = document.hidden;
      if (!document.hidden && !reducedMotion) rafRef.current = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVis);

    const themeObs = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.getAttribute('data-theme') !== 'light';
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    isDarkRef.current = document.documentElement.getAttribute('data-theme') !== 'light';

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      themeObs.disconnect();
    };
  }, [draw, reducedMotion]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}
