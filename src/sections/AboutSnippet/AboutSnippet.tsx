import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { Button } from '../../components/Button/Button';
import { skills } from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './AboutSnippet.module.css';

const FEATURED_SKILLS = ['Product Design', 'Design Systems', 'Product Strategy', 'UX Research', 'Figma', 'React', 'ChatGPT / Claude', 'Cursor'];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function AboutSnippet() {
  const reducedMotion = useReducedMotion();
  const featuredSkills = skills.filter((s) => FEATURED_SKILLS.includes(s.name));

  return (
    <section id="about" className={`section ${styles.about}`} aria-labelledby="about-heading">
      <div className="container">
        <div className={styles.grid}>
          <motion.div
            className={styles.text}
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              label="About"
              title="Craft meets strategy."
              subtitle="I design products that sit at the intersection of beautiful and business-critical from zero-to-one apps to enterprise platforms with global scale."
            />
            <p className={styles.body}>
              With 8+ years in product design and strategy, I've shipped experiences used by millions
              and built the systems, teams, and processes behind them. I think in outcomes, not outputs.
            </p>
            <p className={styles.body}>
              In Business Insider's list of 100+ best Indian Product Designers, I was recognized for my work on the Design System & Process at LinkedIn Sponser. I've also led design at startups like Sigaram Tech and Outlener, where I built teams and shipped features that helped grow their user bases to millions.
            </p>
            <Button as="link" href="/about" variant="secondary" size="md">
              More about me →
            </Button>
          </motion.div>

          <motion.div
            className={styles.skillsWrap}
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <p className={`label ${styles.skillsLabel}`}>Skills &amp; tools</p>
            <ul className={styles.skills} role="list">
              {featuredSkills.map((skill) => (
                <li key={skill.name} className={styles.skill}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
