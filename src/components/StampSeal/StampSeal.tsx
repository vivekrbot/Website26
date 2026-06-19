import { useId } from 'react';
import styles from './StampSeal.module.css';

const SEAL_TEXT = '· itsvivek.design · itsvivek.design · itsvivek.design ·';

interface StampSealProps {
  size?: number;
  className?: string;
  interactive?: boolean;
  animate?: boolean;
  opacity?: number;
}

export function StampSeal({
  size = 150,
  className,
  interactive = false,
  animate = true,
  opacity = 0.55,
}: StampSealProps) {
  const uid = useId().replace(/:/g, '');
  const pathId = `sealArc${uid}`;

  return (
    <div
      className={`${styles.wrap}${animate ? ` ${styles.animated}` : ''}${className ? ` ${className}` : ''}`}
      style={{
        width: size,
        height: size,
        ...(interactive ? { pointerEvents: 'auto' } : {}),
        ...(!animate ? { opacity } : {}),
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 160 160" className={styles.seal} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path
            id={pathId}
            d="M 80,80 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
          />
        </defs>

        {/* Outer dashed ring */}
        <circle cx="80" cy="80" r="75" className={styles.outerRing} />

        {/* Inner solid ring */}
        <circle cx="80" cy="80" r="52" className={styles.innerRing} />

        {/* Slow-spinning circular text */}
        <g className={styles.textRing}>
          <text className={styles.circularText}>
            <textPath href={`#${pathId}`}>{SEAL_TEXT}</textPath>
          </text>
        </g>

        {/* Static center: italic VR monogram + accent dot */}
        <text
          x="77"
          y="83"
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.monogram}
        >
          VR
        </text>
        <circle cx="103" cy="68" r="4" className={styles.dot} />
      </svg>
    </div>
  );
}
