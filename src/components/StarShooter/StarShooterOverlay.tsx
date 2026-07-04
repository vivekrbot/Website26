import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './StarShooter.module.css';

/* Rendered at 1/3 resolution and upscaled with image-rendering: pixelated
   so every sprite lands on a chunky visible pixel grid. */
const PIXEL = 3;
const HISCORE_KEY = 'vr-shooter-hiscore';

const SHIP_SPRITE = [
  '...X...',
  '...X...',
  '..XXX..',
  '..XXX..',
  '.XXXXX.',
  'XX.X.XX',
  'X..X..X',
];

const ENEMY_SPRITES = [
  [
    '.X...X.',
    '..X.X..',
    '.XXXXX.',
    'XX.X.XX',
    'XXXXXXX',
    'X.X.X.X',
    '.X...X.',
  ],
  [
    '..XXX..',
    '.XXXXXX',
    'XXXX.XX',
    'XXXXXXX',
    '.XX.XX.',
    '..XXX..',
    '...X...',
  ],
];

const SHIP_W = 7;
const SHIP_H = 7;
const ENEMY_W = 7;
const ENEMY_H = 7;

/* Power-ups fall as floating UI/UX terms — catch them to level up
   firing and flight. */
const POWER_TERMS = [
  'EMPATHY',
  'WIREFRAME',
  'PROTOTYPE',
  'PERSONA',
  'A/B TEST',
  'USER FLOW',
  'HEURISTIC',
  'USABILITY',
  'AFFORDANCE',
  'ITERATION',
  'CONTRAST',
  'WHITESPACE',
  'A11Y',
  'GRID',
  'JOURNEY MAP',
  'DESIGN SYSTEM',
];

type Mode = 'title' | 'playing' | 'over';

interface Star { x: number; y: number; v: number; a: number }
interface Bullet { x: number; y: number }
interface Enemy { baseX: number; y: number; vy: number; amp: number; ph: number; sprite: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number }
interface PowerUp { term: string; x: number; y: number; vy: number; w: number; h: number }

interface StarShooterOverlayProps {
  onClose: () => void;
}

export function StarShooterOverlay({ onClose }: StarShooterOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    overlayRef.current?.focus();

    // Match the site's strict black & white, both themes.
    const bodyStyle = getComputedStyle(document.body);
    const bg = bodyStyle.backgroundColor || '#000';
    const fg = bodyStyle.color || '#fff';

    let W = 0;
    let H = 0;
    let mode: Mode = 'title';
    let t = 0;
    let elapsed = 0;
    let score = 0;
    let hiscore = parseInt(localStorage.getItem(HISCORE_KEY) ?? '0', 10) || 0;
    let lives = 3;
    let invincible = 0;
    let shootCooldown = 0;
    let spawnTimer = 0;
    let level = 1;
    let powerTimer = 0;
    let popup: { text: string; t: number } | null = null;
    let overAt = -1;

    const ship = { x: 0, y: 0 };
    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let particles: Particle[] = [];
    let stars: Star[] = [];
    let powerups: PowerUp[] = [];

    // Level-derived stats: faster fire and flight every level,
    // extra guns at 3 and 6.
    const fireDelay = () => Math.max(0.1, 0.24 - (level - 1) * 0.02);
    const shipSpeed = () => Math.min(270, 170 + (level - 1) * 12);
    const gunOffsets = () => (level >= 6 ? [-3, 0, 3] : level >= 3 ? [-2, 2] : [0]);

    const keys = new Set<string>();
    let touchActive = false;
    let touchX = 0;
    let touchY = 0;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    const seedStars = () => {
      stars = [];
      const count = Math.floor((W * H) / 1400);
      for (let i = 0; i < count; i++) {
        const depth = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          v: 8 + depth * 30,
          a: 0.25 + depth * 0.75,
        });
      }
    };

    const resize = () => {
      W = Math.max(160, Math.floor(window.innerWidth / PIXEL));
      H = Math.max(120, Math.floor(window.innerHeight / PIXEL));
      canvas.width = W;
      canvas.height = H;
      ship.x = clamp(ship.x, 2, W - SHIP_W - 2);
      ship.y = clamp(ship.y, H * 0.55, H - SHIP_H - 4);
      seedStars();
    };

    const startGame = () => {
      mode = 'playing';
      score = 0;
      lives = 3;
      elapsed = 0;
      invincible = 0;
      shootCooldown = 0;
      spawnTimer = 0.6;
      level = 1;
      powerTimer = 3.5;
      popup = null;
      bullets = [];
      enemies = [];
      particles = [];
      powerups = [];
      ship.x = Math.floor(W / 2 - SHIP_W / 2);
      ship.y = H - SHIP_H - 16;
    };

    const explode = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 20 + Math.random() * 90;
        particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0.35 + Math.random() * 0.4,
        });
      }
    };

    const hitShip = () => {
      lives -= 1;
      invincible = 1.6;
      explode(ship.x + SHIP_W / 2, ship.y + SHIP_H / 2, 26);
      if (lives <= 0) {
        mode = 'over';
        overAt = t;
        if (score > hiscore) {
          hiscore = score;
          try {
            localStorage.setItem(HISCORE_KEY, String(hiscore));
          } catch {
            /* storage unavailable — high score just won't persist */
          }
        }
      }
    };

    const update = (dt: number) => {
      for (const s of stars) {
        s.y += s.v * dt;
        if (s.y > H) {
          s.y = -1;
          s.x = Math.random() * W;
        }
      }

      if (mode !== 'playing') return;

      elapsed += dt;
      invincible = Math.max(0, invincible - dt);
      shootCooldown -= dt;

      // Steering — keyboard, with touch taking over when a finger is down.
      const speed = shipSpeed();
      let dx = 0;
      let dy = 0;
      if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
      if (keys.has('arrowright') || keys.has('d')) dx += 1;
      if (keys.has('arrowup') || keys.has('w')) dy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) dy += 1;
      ship.x += dx * speed * dt;
      ship.y += dy * speed * dt;
      if (touchActive) {
        const ease = Math.min(1, dt * 14);
        ship.x += (touchX - SHIP_W / 2 - ship.x) * ease;
        ship.y += (touchY - SHIP_H - 12 - ship.y) * ease;
      }
      ship.x = clamp(ship.x, 2, W - SHIP_W - 2);
      ship.y = clamp(ship.y, H * 0.55, H - SHIP_H - 4);

      if ((keys.has(' ') || touchActive) && shootCooldown <= 0) {
        for (const off of gunOffsets()) {
          bullets.push({ x: ship.x + Math.floor(SHIP_W / 2) + off, y: ship.y - 3 });
        }
        shootCooldown = fireDelay();
      }

      bullets = bullets.filter((b) => {
        b.y -= 260 * dt;
        return b.y > -4;
      });

      // Difficulty ramps: spawns get denser, enemies get faster.
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        enemies.push({
          baseX: 6 + Math.random() * (W - ENEMY_W - 12),
          y: -ENEMY_H,
          vy: 36 + Math.min(90, elapsed * 1.8) + Math.random() * 24,
          amp: 5 + Math.random() * 16,
          ph: Math.random() * Math.PI * 2,
          sprite: Math.random() < 0.5 ? 0 : 1,
        });
        spawnTimer = Math.max(0.32, 0.95 - elapsed * 0.008);
      }

      enemies = enemies.filter((e) => {
        e.y += e.vy * dt;
        return e.y < H + ENEMY_H;
      });

      const enemyX = (e: Enemy) =>
        clamp(e.baseX + Math.sin(e.ph + e.y * 0.045) * e.amp, 0, W - ENEMY_W);

      // Bullet vs enemy
      for (const b of bullets) {
        for (const e of enemies) {
          const ex = enemyX(e);
          if (b.x >= ex - 1 && b.x <= ex + ENEMY_W && b.y >= e.y && b.y <= e.y + ENEMY_H) {
            score += 10;
            explode(ex + ENEMY_W / 2, e.y + ENEMY_H / 2, 14);
            b.y = -99;
            e.y = H + 99;
          }
        }
      }
      bullets = bullets.filter((b) => b.y > -4);
      enemies = enemies.filter((e) => e.y < H + ENEMY_H);

      // Enemy vs ship
      if (invincible <= 0) {
        for (const e of enemies) {
          const ex = enemyX(e);
          if (
            ship.x < ex + ENEMY_W - 1 &&
            ship.x + SHIP_W > ex + 1 &&
            ship.y < e.y + ENEMY_H - 1 &&
            ship.y + SHIP_H > e.y + 1
          ) {
            e.y = H + 99;
            hitShip();
            break;
          }
        }
        enemies = enemies.filter((e) => e.y < H + ENEMY_H);
      }

      // Power-ups: UI/UX terms drift down — fly through one to level up.
      powerTimer -= dt;
      if (powerTimer <= 0) {
        const fits = POWER_TERMS.filter((s) => s.length * 6 + 10 < W * 0.7);
        const term = fits[Math.floor(Math.random() * fits.length)] ?? 'UX';
        const w = term.length * 6 + 10;
        powerups.push({
          term,
          x: 4 + Math.random() * Math.max(1, W - w - 8),
          y: -14,
          vy: 22 + Math.random() * 10,
          w,
          h: 13,
        });
        powerTimer = 8 + Math.random() * 4;
      }

      powerups = powerups.filter((p) => {
        p.y += p.vy * dt;
        if (
          ship.x < p.x + p.w &&
          ship.x + SHIP_W > p.x &&
          ship.y < p.y + p.h &&
          ship.y + SHIP_H > p.y
        ) {
          level += 1;
          const upgrade =
            level === 6 ? 'TRIPLE SHOT' : level === 3 ? 'DOUBLE SHOT' : 'FIRE+SPEED UP';
          popup = { text: `${p.term}! LV ${level} - ${upgrade}`, t: 2.2 };
          explode(p.x + p.w / 2, p.y + p.h / 2, 18);
          return false;
        }
        return p.y < H + 4;
      });

      if (popup) {
        popup.t -= dt;
        if (popup.t <= 0) popup = null;
      }

      particles = particles.filter((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        return p.life > 0;
      });
    };

    const drawSprite = (sprite: string[], x: number, y: number) => {
      const px = Math.round(x);
      const py = Math.round(y);
      for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
          if (sprite[r][c] === 'X') ctx.fillRect(px + c, py + r, 1, 1);
        }
      }
    };

    const text = (str: string, x: number, y: number, size = 8, align: CanvasTextAlign = 'left') => {
      ctx.font = `${size}px 'Press Start 2P', monospace`;
      ctx.textAlign = align;
      ctx.textBaseline = 'top';
      ctx.fillText(str, Math.round(x), Math.round(y));
    };

    const render = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = fg;

      for (const s of stars) {
        ctx.globalAlpha = s.a * 0.8;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
      }
      ctx.globalAlpha = 1;

      if (mode === 'title') {
        const titleSize = Math.min(16, Math.floor(W / 14));
        text('STAR SHOOTER', W / 2, H * 0.32, titleSize, 'center');
        if (Math.floor(t * 2) % 2 === 0) {
          text('PRESS ENTER TO START', W / 2, H * 0.5, 8, 'center');
        }
        text('ARROWS / WASD MOVE', W / 2, H * 0.62, 7, 'center');
        text('SPACE FIRE - ESC EXIT', W / 2, H * 0.62 + 14, 7, 'center');
        text('CATCH UX TERMS TO LEVEL UP', W / 2, H * 0.62 + 28, 7, 'center');
        if (hiscore > 0) text(`HI ${hiscore}`, W / 2, H * 0.82, 7, 'center');
      } else {
        for (const b of bullets) {
          ctx.fillRect(Math.round(b.x), Math.round(b.y), 1, 3);
        }
        for (const e of enemies) {
          const ex = clamp(e.baseX + Math.sin(e.ph + e.y * 0.045) * e.amp, 0, W - ENEMY_W);
          drawSprite(ENEMY_SPRITES[e.sprite], ex, e.y);
        }
        for (const p of powerups) {
          const px = Math.round(p.x);
          const py = Math.round(p.y);
          ctx.strokeStyle = fg;
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, p.w - 1, p.h - 1);
          text(p.term, px + p.w / 2, py + 4, 6, 'center');
        }
        const blinking = invincible > 0 && Math.floor(t * 10) % 2 === 0;
        if (mode === 'playing' && !blinking) {
          drawSprite(SHIP_SPRITE, ship.x, ship.y);
        }
        for (const p of particles) {
          ctx.globalAlpha = Math.min(1, p.life * 2.5);
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
        }
        ctx.globalAlpha = 1;

        text(`SCORE ${score}`, 5, 6, 7);
        // Centered so it clears the CLOSE button in the top-right corner
        text(`HI ${hiscore}`, W / 2, 6, 7, 'center');
        for (let i = 0; i < lives; i++) {
          drawSprite(SHIP_SPRITE, 5 + i * (SHIP_W + 3), 18);
        }
        text(`LV ${level}`, 5, 30, 7);

        if (popup) {
          ctx.globalAlpha = Math.min(1, popup.t * 1.5);
          text(popup.text, W / 2, H * 0.2, 8, 'center');
          ctx.globalAlpha = 1;
        }

        if (mode === 'over') {
          const overSize = Math.min(16, Math.floor(W / 12));
          text('GAME OVER', W / 2, H * 0.36, overSize, 'center');
          text(`SCORE ${score} - LV ${level}`, W / 2, H * 0.52, 8, 'center');
          if (Math.floor(t * 2) % 2 === 0) {
            text('PRESS ENTER TO RETRY', W / 2, H * 0.64, 7, 'center');
          }
        }
      }

      // Faint CRT scanlines
      ctx.globalAlpha = 0.05;
      for (let y = 0; y < H; y += 3) {
        ctx.fillRect(0, y, W, 1);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      update(dt);
      render();
      raf = requestAnimationFrame(loop);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      const k = e.key.toLowerCase();
      // The game owns the keyboard while open — keep space/arrows from
      // scrolling and Tab from escaping the dialog.
      if ([' ', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'tab'].includes(k)) {
        e.preventDefault();
      }
      keys.add(k);
      // Fresh press only, with a lockout after death — a held fire key
      // must not blow straight through the game-over screen.
      if (
        mode !== 'playing' &&
        !e.repeat &&
        (k === 'enter' || k === ' ') &&
        t - overAt > 0.8
      ) {
        startGame();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      touchX = touch.clientX / PIXEL;
      touchY = touch.clientY / PIXEL;
      touchActive = true;
      // Only a fresh tap starts/restarts — a finger held through a death
      // must not skip the game-over screen.
      if (mode !== 'playing' && e.type === 'touchstart' && t - overAt > 0.8) {
        startGame();
      }
    };

    const onTouchEnd = () => {
      touchActive = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('touchmove', onTouch, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Star Shooter mini game"
      tabIndex={-1}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <button type="button" className={styles.closeButton} onClick={onClose}>
        &#10005; Close
      </button>
    </div>,
    document.body
  );
}
