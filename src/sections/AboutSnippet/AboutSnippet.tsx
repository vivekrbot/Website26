import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { EscapeText, EscapeWord } from '../../components/EscapeText/EscapeText';
import { skills } from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './AboutSnippet.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type SkillItem = { name: string; isAI?: boolean };

const SKILL_ROWS: Array<{ direction: 'left' | 'right'; duration: number; items: SkillItem[] }> = [
  {
    direction: 'left',
    duration: 55,
    items: [
      ...skills.filter((s) => s.category === 'craft').map((s) => ({ name: s.name })),
      ...skills.filter((s) => s.category === 'tools').map((s) => ({ name: s.name })),
    ],
  },
  {
    direction: 'right',
    duration: 50,
    items: [
      ...skills.filter((s) => s.category === 'strategy').map((s) => ({ name: s.name })),
      ...skills.filter((s) => s.category === 'ai').map((s) => ({ name: s.name, isAI: true })),
    ],
  },
];

interface MarqueeRowProps {
  items: SkillItem[];
  direction: 'left' | 'right';
  duration: number;
  reducedMotion: boolean;
}

function MarqueeRow({ items, direction, duration, reducedMotion }: MarqueeRowProps) {
  const tripled = [...items, ...items, ...items];
  return (
    <div className={styles.marqueeRow} aria-hidden="true">
      <div
        className={styles.marqueeTrack}
        style={
          reducedMotion
            ? undefined
            : {
                animationDuration: `${duration}s`,
                animationDirection: direction === 'right' ? 'reverse' : 'normal',
              }
        }
      >
        {(reducedMotion ? items : tripled).map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            <EscapeWord
              word={item.name}
              className={`${styles.marqueeWord} ${item.isAI ? styles.aiWord : ''}`}
            />
            <span className={styles.skillSep} aria-hidden="true">&nbsp;·&nbsp;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutSnippet() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="about" className={`section ${styles.about}`} aria-labelledby="about-heading">
      <div className="container">

        {/* ── Text content – full container width, single column ── */}
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
              <EscapeText text="Craft meets strategy." />
            </h2>
            <p className={styles.headerSubtitle}>
              <EscapeText text="I design products that sit at the intersection of beautiful and business-critical — from zero-to-one apps to enterprise platforms with global scale." />
            </p>
          </header>

          <div className={styles.bodyGrid}>
            <p className={styles.body}>
              With 8+ years in product design and strategy, I've shipped experiences used by millions
              and built the systems, teams, and processes behind them. I think in outcomes, not outputs.
            </p>
            <p className={styles.body}>
              In Business Insider's list of 100+ best Indian Product Designers, I was recognized for
              my work on Design Systems at LinkedIn. I've also led design at startups like Sigaram Tech
              and Outlener, building teams and shipping features that grew user bases to millions.
            </p>
          </div>

          <Button as="link" href="/about" variant="secondary" size="md">
            More about me →
          </Button>
        </motion.div>

        {/* ── Skills – contained within container, not full-bleed ── */}
        <motion.div
          className={styles.skillsSection}
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
        >
          <div className={styles.skillsTop}>
            <p className={`label ${styles.skillsLabel}`}>Skills &amp; Tools</p>
          </div>
          <div className={styles.marqueeRows}>
            {SKILL_ROWS.map((row, i) => (
              <MarqueeRow
                key={i}
                items={row.items}
                direction={row.direction}
                duration={row.duration}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
