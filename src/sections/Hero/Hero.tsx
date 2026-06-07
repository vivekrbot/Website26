import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './Hero.module.css';

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
            I'm Vivek Ramachandran — a product designer and strategist who builds
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
            <Button as="a" href="mailto:vdraganer@gmail.com" variant="ghost" size="lg">
              Contact ↗
            </Button>
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
