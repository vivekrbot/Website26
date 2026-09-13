import type { ReactNode } from 'react';
import BorderGlow from '../BorderGlow/BorderGlow';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * The one BorderGlow preset used everywhere on the site (cards, nav links,
 * CTA panels) — every call site passed these same five props verbatim.
 */
export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <BorderGlow
      className={className}
      backgroundColor="var(--bg-primary)"
      borderRadius={0}
      glowColor="0 0 88"
      colors={['#ffffff', '#cccccc', '#888888']}
      glowIntensity={0.85}
    >
      {children}
    </BorderGlow>
  );
}
