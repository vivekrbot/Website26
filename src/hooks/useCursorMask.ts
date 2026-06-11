import { useEffect } from 'react';

/**
 * Tracks the cursor over an element and punches a soft transparent
 * circle through the text using a CSS mask-image radial gradient.
 * The hole follows the cursor smoothly; text is fully visible when idle.
 * Only activates on pointer (non-touch) devices.
 */
export function useCursorMask(
  ref: { current: HTMLElement | null },
  radius = 48
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    let rafId: number;
    let live = false;
    const pos = { x: -9999, y: -9999 };

    const paint = () => {
      const { x, y } = pos;
      // transparent core → soft water-drop edge → fully visible text
      const mask =
        `radial-gradient(circle ${radius}px at ${x}px ${y}px,` +
        `transparent 0%,` +
        `transparent 42%,` +
        `rgba(0,0,0,0.22) 58%,` +
        `rgba(0,0,0,0.72) 76%,` +
        `black 94%)`;
      el.style.webkitMaskImage = mask;
      el.style.maskImage = mask;
      if (live) rafId = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      pos.x = e.clientX - r.left;
      pos.y = e.clientY - r.top;
      if (!live) {
        live = true;
        rafId = requestAnimationFrame(paint);
      }
    };

    const onLeave = () => {
      live = false;
      cancelAnimationFrame(rafId);
      el.style.webkitMaskImage = '';
      el.style.maskImage = '';
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, radius]);
}
