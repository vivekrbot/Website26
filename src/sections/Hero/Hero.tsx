import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { socialLinks } from '../../data/navigation';
import styles from './Hero.module.css';

const SOCIAL_ICONS: Record<string, React.ReactElement> = {
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  dribbble: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.1 10.1 0 004.392-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4a10.067 10.067 0 006.29 2.166 10.11 10.11 0 004.006-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12a28.58 28.58 0 00-.695-1.527c-5.116 1.53-10.082 1.47-10.54 1.46a10.099 10.099 0 002.498 6.952zm-2.65-8.46c.46.008 4.683.026 9.477-1.248a67.884 67.884 0 00-3.82-5.89C9.016 4.65 6.34 6.7 4.735 9.917zm7.08-8.583a67.1 67.1 0 013.853 5.927c3.67-1.376 5.22-3.47 5.41-3.726A10.065 10.065 0 0012.815 2.09zm8.222 8.032c-.22.286-1.955 2.517-5.77 4.083.24.494.47.998.683 1.51.077.188.153.375.224.562 3.407-.43 6.797.26 7.135.33a10.137 10.137 0 00-2.272-6.485z" />
    </svg>
  ),
  medium: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  ),
  apdlist: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
};

const SPRING_CONFIG = { stiffness: 80, damping: 20, mass: 0.8 };

export function Hero() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  const bannerX = useTransform(springX, [-1, 1], ['-8px', '8px']);
  const bannerY = useTransform(springY, [-1, 1], ['-6px', '6px']);
  const textX   = useTransform(springX, [-1, 1], ['-4px', '4px']);
  const textY   = useTransform(springY, [-1, 1], ['-3px', '3px']);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section
      className={styles.hero}
      aria-labelledby="hero-heading"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      ref={containerRef}
    >
      {/* Animated gradient banner */}
      <motion.div
        className={styles.banner}
        style={reducedMotion ? {} : { x: bannerX, y: bannerY }}
        aria-hidden="true"
      />

      <div className={`container ${styles.content}`}>
        <motion.div
          className={styles.textGroup}
          style={reducedMotion ? {} : { x: textX, y: textY }}
          initial={reducedMotion ? {} : { opacity: 0, y: 32 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <motion.p
            className={`label ${styles.eyebrow}`}
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Product Design &amp; Strategy
          </motion.p>

          <h1 id="hero-heading" className={`display-1 ${styles.headline}`}>
            <span className={styles.lineWrap}>
              <motion.span
                className={styles.line}
                initial={reducedMotion ? {} : { opacity: 0, y: '100%' }}
                animate={reducedMotion ? {} : { opacity: 1, y: '0%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              >
                Designing
              </motion.span>
            </span>
            <span className={styles.lineWrap}>
              <motion.span
                className={`${styles.line} gradient-text`}
                initial={reducedMotion ? {} : { opacity: 0, y: '100%' }}
                animate={reducedMotion ? {} : { opacity: 1, y: '0%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              >
                products people
              </motion.span>
            </span>
            <span className={styles.lineWrap}>
              <motion.span
                className={styles.line}
                initial={reducedMotion ? {} : { opacity: 0, y: '100%' }}
                animate={reducedMotion ? {} : { opacity: 1, y: '0%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              >
                remember.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className={styles.tagline}
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          >
            I'm Vivek Ramachandran a product designer and strategist who builds
            experiences that are clear, crafted, and consequential.
          </motion.p>

          <motion.div
            className={styles.ctas}
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
          >
            <Button as="link" href="/works" size="lg">
              View Work
            </Button>
            <Button as="link" href="/mentorship" variant="secondary" size="lg">
              Mentorship
            </Button>
            <div className={styles.socialRow} aria-label="Social links">
              {socialLinks.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  className={styles.socialIcon}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  {SOCIAL_ICONS[s.icon]}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={reducedMotion ? {} : { opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          aria-hidden="true"
        >
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
