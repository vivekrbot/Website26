import { useEffect } from 'react';

/**
 * Tracks the cursor over `containerRef` and applies a magnifying-glass
 * zoom on `lensRef` — a scaled copy of the same text clipped to a circle
 * around the cursor.
 *
 * The lens element must be an absolute-positioned sibling/child inside
 * the container with `clip-path` and `transform` set here via DOM style.
 */
export function useMagnifyLens(
  containerRef: { current: HTMLElement | null },
  lensRef: { current: HTMLElement | null },
  scale = 1.45,
  radius = 48
) {
  useEffect(() => {
    const container = containerRef.current;
    const lens = lensRef.current;
    if (!container || !lens) return;

    // Touch devices don't need this
    if (!window.matchMedia('(pointer: fine)').matches) {
      lens.style.display = 'none';
      return;
    }

    lens.style.transform = `scale(${scale})`;

    let rafId: number;
    let live = false;
    const pos = { x: -400, y: -400 };

    const paint = () => {
      const { x, y } = pos;
      lens.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;
      lens.style.transformOrigin = `${x}px ${y}px`;
      if (live) rafId = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pos.x = e.clientX - rect.left;
      pos.y = e.clientY - rect.top;
      if (!live) {
        live = true;
        rafId = requestAnimationFrame(paint);
      }
    };

    const onLeave = () => {
      live = false;
      cancelAnimationFrame(rafId);
      // hide lens off-screen
      lens.style.clipPath = 'circle(0px at -400px -400px)';
    };

    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef, lensRef, scale, radius]);
}
