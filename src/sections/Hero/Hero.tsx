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
    <svg width="18" height="18" viewBox="0 0 107 28" fill="currentColor" aria-hidden="true">
      <path d="M13.7623 0C11.0404 0 8.37959 0.807146 6.11639 2.31937C3.85319 3.83159 2.08924 5.98097 1.0476 8.49571C0.005963 11.0104 -0.266577 13.7776 0.264445 16.4472C0.795467 19.1168 2.1062 21.5691 4.0309 23.4937C5.95559 25.4184 8.4078 26.7292 11.0774 27.2602C13.7471 27.7912 16.5142 27.5187 19.0289 26.477C21.5437 25.4354 23.6931 23.6715 25.2053 21.4083C26.7175 19.1451 27.5246 16.4842 27.5246 13.7623C27.5246 10.1123 26.0747 6.61183 23.4938 4.03089C20.9128 1.44995 17.4123 0 13.7623 0ZM13.7623 25.4074C11.4592 25.4074 9.20771 24.7244 7.29269 23.4448C5.37767 22.1652 3.8851 20.3465 3.00371 18.2187C2.12233 16.0908 1.89172 13.7494 2.34104 11.4905C2.79037 9.23157 3.89945 7.15662 5.52804 5.52803C7.15663 3.89945 9.23158 2.79036 11.4905 2.34104C13.7494 1.89171 16.0908 2.12232 18.2187 3.00371C20.3465 3.88509 22.1652 5.37767 23.4448 7.29268C24.7244 9.2077 25.4074 11.4591 25.4074 13.7623C25.4074 16.8508 24.1805 19.8127 21.9966 21.9966C19.8127 24.1805 16.8508 25.4074 13.7623 25.4074Z" />
      <path d="M8.2475 13.4871C8.34592 13.5863 8.46301 13.6651 8.59201 13.7188C8.72102 13.7726 8.85939 13.8002 8.99914 13.8002C9.13889 13.8002 9.27726 13.7726 9.40627 13.7188C9.53527 13.6651 9.65236 13.5863 9.75077 13.4871L12.2386 10.9993C12.706 10.5251 12.9911 9.90114 13.0435 9.23735C13.0959 8.57357 12.9123 7.91259 12.5251 7.37093C12.1378 6.82928 11.5718 6.44172 10.9267 6.27659C10.2817 6.11146 9.59903 6.17935 8.99914 6.46829C8.39833 6.16152 7.70735 6.08063 7.05192 6.24033C6.3965 6.40004 5.82019 6.78972 5.42784 7.3385C5.03549 7.88727 4.85319 8.55865 4.91409 9.2305C4.975 9.90235 5.27506 10.53 5.7597 10.9993L8.2475 13.4871ZM7.25238 8.46912C7.31663 8.40187 7.39385 8.34834 7.47937 8.31177C7.56489 8.27519 7.65693 8.25634 7.74994 8.25634C7.84295 8.25634 7.935 8.27519 8.02052 8.31177C8.10604 8.34834 8.18325 8.40187 8.2475 8.46912C8.34592 8.56835 8.46301 8.64711 8.59201 8.70085C8.72102 8.7546 8.85939 8.78227 8.99914 8.78227C9.13889 8.78227 9.27726 8.7546 9.40627 8.70085C9.53527 8.64711 9.65236 8.56835 9.75077 8.46912C9.81578 8.40319 9.89324 8.35083 9.97866 8.31509C10.0641 8.27935 10.1557 8.26095 10.2483 8.26095C10.3409 8.26095 10.4326 8.27935 10.518 8.31509C10.6034 8.35083 10.6809 8.40319 10.7459 8.46912C10.8131 8.53337 10.8667 8.61059 10.9033 8.69611C10.9398 8.78163 10.9587 8.87367 10.9587 8.96669C10.9587 9.0597 10.9398 9.15174 10.9033 9.23726C10.8667 9.32278 10.8131 9.4 10.7459 9.46425L8.99914 11.2428L7.25238 9.52777C7.18513 9.46352 7.1316 9.3863 7.09502 9.30078C7.05845 9.21526 7.03959 9.12321 7.03959 9.0302C7.03959 8.93719 7.05845 8.84515 7.09502 8.75963C7.1316 8.67411 7.18513 8.59689 7.25238 8.53264V8.46912Z" />
      <path d="M17.7751 13.4871C17.8735 13.5863 17.9906 13.6651 18.1196 13.7188C18.2486 13.7726 18.387 13.8002 18.5267 13.8002C18.6665 13.8002 18.8049 13.7726 18.9339 13.7188C19.0629 13.6651 19.1799 13.5863 19.2784 13.4871L21.7662 10.9993C22.2336 10.5251 22.5187 9.90114 22.5711 9.23735C22.6235 8.57357 22.4399 7.91259 22.0527 7.37093C21.6654 6.82928 21.0994 6.44172 20.4543 6.27659C19.8093 6.11146 19.1266 6.17935 18.5267 6.46829C17.9259 6.16152 17.2349 6.08063 16.5795 6.24033C15.9241 6.40004 15.3478 6.78972 14.9554 7.3385C14.5631 7.88727 14.3808 8.55865 14.4417 9.2305C14.5026 9.90235 14.8027 10.53 15.2873 10.9993L17.7751 13.4871ZM16.78 8.46912C16.8442 8.40187 16.9214 8.34834 17.007 8.31177C17.0925 8.27519 17.1845 8.25634 17.2775 8.25634C17.3705 8.25634 17.4626 8.27519 17.5481 8.31177C17.6336 8.34834 17.7108 8.40187 17.7751 8.46912C17.8735 8.56835 17.9906 8.64711 18.1196 8.70085C18.2486 8.7546 18.387 8.78227 18.5267 8.78227C18.6665 8.78227 18.8049 8.7546 18.9339 8.70085C19.0629 8.64711 19.1799 8.56835 19.2784 8.46912C19.3434 8.40319 19.4208 8.35083 19.5062 8.31509C19.5917 8.27935 19.6833 8.26095 19.7759 8.26095C19.8685 8.26095 19.9602 8.27935 20.0456 8.31509C20.131 8.35083 20.2085 8.40319 20.2735 8.46912C20.3407 8.53337 20.3943 8.61059 20.4308 8.69611C20.4674 8.78163 20.4863 8.87367 20.4863 8.96669C20.4863 9.0597 20.4674 9.15174 20.4308 9.23726C20.3943 9.32278 20.3407 9.4 20.2735 9.46425L18.5267 11.2428L16.78 9.52777C16.7127 9.46352 16.6592 9.3863 16.6226 9.30078C16.586 9.21526 16.5672 9.12321 16.5672 9.0302C16.5672 8.93719 16.586 8.84515 16.6226 8.75963C16.6592 8.67411 16.7127 8.59689 16.78 8.53264V8.46912Z" />
      <path d="M21.1728 14.821C20.892 14.821 20.6228 14.9326 20.4242 15.1311C20.2257 15.3296 20.1142 15.5989 20.1142 15.8797C20.1142 18.8015 17.2664 21.1729 13.7623 21.1729C10.2582 21.1729 7.41049 18.8015 7.41049 15.8797C7.41049 15.5989 7.29896 15.3296 7.10042 15.1311C6.90189 14.9326 6.63262 14.821 6.35185 14.821C6.07108 14.821 5.80182 14.9326 5.60328 15.1311C5.40475 15.3296 5.29321 15.5989 5.29321 15.8797C5.29321 19.966 9.09373 23.2902 13.7623 23.2902C18.4309 23.2902 22.2315 19.966 22.2315 15.8797C22.2315 15.5989 22.1199 15.3296 21.9214 15.1311C21.7229 14.9326 21.4536 14.821 21.1728 14.821Z" />
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
