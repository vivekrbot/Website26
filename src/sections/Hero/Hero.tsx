import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { EscapeText } from '../../components/EscapeText/EscapeText';
import Shuffle from '../../components/Shuffle/Shuffle';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { socialLinks } from '../../data/navigation';
import { HeroCanvas } from '../../canvas/HeroCanvas/HeroCanvas';
import { StampSeal } from '../../components/StampSeal/StampSeal';
import { safeHref } from '../../utils/safeHref';
import { SOCIAL_ICONS } from '../../lib/socialIcons';
import styles from './Hero.module.css';

const SPRING_CONFIG = { stiffness: 70, damping: 18, mass: 0.9 };

export function Hero() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  // Background banner drifts with the cursor for a subtle parallax.
  const bannerX = useTransform(springX, [-1, 1], ['12px', '-12px']);
  const bannerY = useTransform(springY, [-1, 1], ['9px', '-9px']);

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

      {/* Molecule particle field */}
      <HeroCanvas />

      <div className={`container ${styles.content}`}>
        <div className={styles.stage}>
          {/* Floating status badge */}
         

          <motion.p
            className={`label ${styles.eyebrow}`}
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          >
            Product Design &amp; Strategy
          </motion.p>

          <h1 id="hero-heading" className={styles.headline}>
            <span className={styles.headlineLine}>
              <Shuffle
                tag="span"
                text="Designing products"
                textAlign="left"
                shuffleDirection="right"
                duration={0.4}
                stagger={0.022}
                threshold={0}
                rootMargin="0px"
                triggerOnce={true}
                triggerOnHover={true}
                respectReducedMotion={true}
              />
            </span>
            <span className={`${styles.headlineLine} ${styles.headlineRow}`}>
              <span className={styles.headlineHighlight}>
                <Shuffle
                  tag="span"
                  text="people"
                  textAlign="left"
                  shuffleDirection="right"
                  duration={0.4}
                  stagger={0.022}
                  threshold={0}
                  rootMargin="0px"
                  triggerOnce={true}
                  triggerOnHover={true}
                  respectReducedMotion={true}
                />
              </span>
              <span className={styles.headlineHighlight}>
                <Shuffle
                  tag="span"
                  text="remember."
                  textAlign="left"
                  shuffleDirection="right"
                  duration={0.4}
                  stagger={0.022}
                  threshold={0}
                  rootMargin="0px"
                  triggerOnce={true}
                  triggerOnHover={true}
                  respectReducedMotion={true}
                />
              </span>
            </span>
          </h1>

          <motion.div
            className={styles.tagline}
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          >
            <span className={styles.neonName}>I'm Vivek Ramachandran</span>
            <EscapeText
              className={styles.taglineSuffix}
              text="Product designer and strategist who builds experiences that are clear, crafted, and consequential."
            />
          </motion.div>

          <motion.div
            className={styles.ctas}
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.64 }}
          >
            <Button as="link" href="/works" size="lg">
              View Work
            </Button>
            <Button as="link" href="/mentorship" variant="secondary" size="lg">
              Mentorship
            </Button>
            <div className={styles.socialRow} role="group" aria-label="Social links">
              {socialLinks.map((s) => (
                <a
                  key={s.icon}
                  href={safeHref(s.href)}
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
        </div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={reducedMotion ? {} : { opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          aria-hidden="true"
        >
          <span className={styles.scrollLabel}>scroll</span>
          <span className={styles.scrollLine} />
          <span className={styles.scrollArrow} />
        </motion.div>
      </div>

      {/* Circular stamp seal — bottom-right decorative logo */}
      <StampSeal className={styles.stampSeal} animate />
    </section>
  );
}
