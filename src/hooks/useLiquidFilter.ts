/* eslint-disable react-hooks/immutability, react-hooks/refs */
import { useRef, useId, useMemo, useCallback } from 'react';
import { createElement } from 'react';

export function useLiquidFilter(maxScale = 28) {
  const rawId = useId();
  const filterId = 'lq' + rawId.replace(/[^a-zA-Z0-9]/g, '');

  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const rafRef  = useRef<number>(0);
  const scale   = useRef(0);
  const target  = useRef(0);

  const tick = useCallback(() => {
    const diff = target.current - scale.current;
    if (Math.abs(diff) < 0.15) {
      scale.current = target.current;
    } else {
      scale.current += diff * 0.11;
      rafRef.current = requestAnimationFrame(tick);
    }
    dispRef.current?.setAttribute('scale', scale.current.toFixed(2));
    const bf = (0.006 + scale.current * 0.00055).toFixed(5);
    turbRef.current?.setAttribute('baseFrequency', `${bf} 0.007`);
  }, []);

  const onMouseEnter = useCallback(() => {
    target.current = maxScale;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [maxScale, tick]);

  const onMouseLeave = useCallback(() => {
    target.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Memoised so the SVG element is stable across re-renders (refs won't reset)
  const filterSvg = useMemo(() =>
    createElement('svg', {
      style: { position: 'absolute', width: 0, height: 0 },
      'aria-hidden': 'true',
    },
      createElement('defs', null,
        createElement('filter', {
          id: filterId,
          x: '-25%', y: '-25%', width: '150%', height: '150%',
          colorInterpolationFilters: 'sRGB',
        },
          createElement('feTurbulence', {
            ref: turbRef,
            type: 'turbulence',
            baseFrequency: '0.006 0.007',
            numOctaves: 4,
            seed: 8,
            result: 'noise',
          }),
          createElement('feDisplacementMap', {
            ref: dispRef,
            in: 'SourceGraphic',
            in2: 'noise',
            scale: 0,
            xChannelSelector: 'R',
            yChannelSelector: 'G',
          })
        )
      )
    ),
  [filterId]);

  return {
    filterSvg,
    filterStyle: { filter: `url(#${filterId})` } as React.CSSProperties,
    handlers: { onMouseEnter, onMouseLeave } as React.HTMLAttributes<HTMLElement>,
  };
}
