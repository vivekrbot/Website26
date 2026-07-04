import { useCallback, useEffect, useRef } from 'react';
import styles from './ScrollFrameAnimation.module.css';

const FRAME_COUNT = 40;
const FRAME_SRC = (i: number) =>
  `/Animate/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`;

// Euclidean distance threshold for background removal.
// Sampled from the top-left corner of frame 1.
const BG_THRESHOLD = 28;

interface Props {
  frameIndex: number; // 0 – FRAME_COUNT-1
}

export function ScrollFrameAnimation({ frameIndex }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef    = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const bgColorRef   = useRef<[number, number, number] | null>(null);
  const sizeRef      = useRef({ w: 0, h: 0 });
  const pendingRef   = useRef(0);
  const rafRef       = useRef(0);

  // ── Pre-load all frames in parallel ─────────────────────────────────
  useEffect(() => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_SRC(i);
      const idx = i;
      img.onload = () => {
        imagesRef.current[idx] = img;
        loadedRef.current[idx] = true;
        // Detect bg colour once from the first loaded frame
        if (idx === 0 && !bgColorRef.current) {
          const tmp = document.createElement('canvas');
          tmp.width = 4; tmp.height = 4;
          const tctx = tmp.getContext('2d');
          if (tctx) {
            tctx.drawImage(img, 0, 0, 4, 4);
            const px = tctx.getImageData(0, 0, 1, 1).data;
            bgColorRef.current = [px[0], px[1], px[2]];
          }
        }
      };
    }
  }, []);

  // ── Draw a specific frame to the canvas ──────────────────────────────
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[idx];
    const { w, h } = sizeRef.current;
    if (!canvas || !img || !loadedRef.current[idx] || w === 0 || h === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sw = img.naturalWidth;
    const sh = img.naturalHeight;

    // Cover-fit: scale & centre the source into the canvas
    const scale = Math.max(w / sw, h / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    // Draw to a same-size offscreen canvas so we can do pixel-manipulation
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const offCtx = off.getContext('2d');
    if (!offCtx) return;
    offCtx.drawImage(img, 0, 0, sw, sh, dx, dy, dw, dh);

    // Remove background colour
    if (bgColorRef.current) {
      const [br, bg, bb] = bgColorRef.current;
      const idata = offCtx.getImageData(0, 0, w, h);
      const d = idata.data;
      const t2 = BG_THRESHOLD * BG_THRESHOLD;
      for (let j = 0; j < d.length; j += 4) {
        const dr = d[j]   - br;
        const dg = d[j+1] - bg;
        const db = d[j+2] - bb;
        if (dr * dr + dg * dg + db * db < t2) d[j + 3] = 0;
      }
      offCtx.putImageData(idata, 0, 0);
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0);
  }, []);

  // ── RAF-debounce draws during fast scroll ────────────────────────────
  const scheduleDraw = useCallback((idx: number) => {
    pendingRef.current = idx;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      drawFrame(pendingRef.current);
    });
  }, [drawFrame]);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));
    scheduleDraw(clamped);
  }, [frameIndex, scheduleDraw]);

  // ── Resize observer — keeps canvas pixel-perfect ────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const { width, height } = entry.contentRect;
      canvas.width  = Math.round(width  * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      sizeRef.current = { w: Math.round(width), h: Math.round(height) };
      drawFrame(pendingRef.current);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawFrame]);

  // ── Cleanup RAF on unmount ───────────────────────────────────────────
  useEffect(() => () => { cancelAnimationFrame(rafRef.current); }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
      role="presentation"
    />
  );
}
