import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import SplitText from '../../components/SplitText/SplitText';
import Shuffle from '../../components/Shuffle/Shuffle';
import ScrollVelocity from '../../components/ScrollVelocity/ScrollVelocity';
import { skills } from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './AboutSnippet.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const row1 = skills
  .filter((s) => s.category === 'craft' || s.category === 'tools')
  .map((s) => s.name)
  .join(' · ');

const row2 = skills
  .filter((s) => s.category === 'strategy' || s.category === 'ai')
  .map((s) => s.name)
  .join(' · ');

export function AboutSnippet() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="about" className={`section ${styles.about}`} aria-labelledby="about-heading">
      <div className="container">

        {/* ── Text content ── */}
        <motion.div
          className={styles.content}
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className={styles.sectionHeader}>
            <p className={`label ${styles.headerLabel}`}>About</p>
            <h2 id="about-heading" className={`heading-2 ${styles.headerTitle}`}>
              <Shuffle tag="span" text="Craft meets strategy." textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} />
            </h2>
            <SplitText
              tag="p"
              text="I design products that sit at the intersection of beautiful and business-critical — from zero-to-one apps to enterprise platforms with global scale."
              className={styles.headerSubtitle}
              splitType="words"
              from={{ opacity: 0, y: 16 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.5}
              delay={22}
              ease="power2.out"
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
            />
          </header>

          <div className={styles.bodyGrid}>
            <SplitText
              tag="p"
              text="With 8+ years in product design and strategy, I've shipped experiences used by millions and built the systems, teams, and processes behind them. I think in outcomes, not outputs."
              className={styles.body}
              splitType="words"
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.5}
              delay={18}
              ease="power2.out"
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
            />
            <SplitText
              tag="p"
              text="In Business Insider's list of 100+ best Indian Product Designers, I was recognized for my work on Design Systems at LinkedIn. I've also led design at startups like Sigaram Tech and Outlener, building teams and shipping features that grew user bases to millions."
              className={styles.body}
              splitType="words"
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.5}
              delay={18}
              ease="power2.out"
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
            />
          </div>

          <Button as="link" href="/about" variant="secondary" size="md">
            More about me →
          </Button>
        </motion.div>

      </div>

      {/* ── Skills – full-bleed velocity marquee ── */}
      <motion.div
        className={styles.skillsSection}
        variants={fadeUp}
        initial={reducedMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
      >
        <div className="container">
          <div className={styles.skillsTop}>
            <p className={`label ${styles.skillsLabel}`}>Skills &amp; Tools</p>
          </div>
          <div className={styles.marqueeWrap}>
            <ScrollVelocity
              texts={[row1, row2]}
              velocity={reducedMotion ? 0 : 60}
              numCopies={4}
              className={styles.scrollText}
              scrollerStyle={{ gap: 0 }}
            />
          </div>
        </div>
      </motion.div>

    </section>
  );
}
