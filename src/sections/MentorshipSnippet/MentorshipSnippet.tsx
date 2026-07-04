import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import Shuffle from '../../components/Shuffle/Shuffle';
import BorderGlow from '../../components/BorderGlow/BorderGlow';
import { Button } from '../../components/Button/Button';
import { mentorshipTiers } from '../../data/mentorship';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './MentorshipSnippet.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function MentorshipSnippet() {
  const reducedMotion = useReducedMotion();
  const freeTier  = mentorshipTiers.find((t) => t.type === 'free')!;
  const paidTiers = mentorshipTiers.filter((t) => t.type === 'paid');

  return (
    <section id="mentorship" className={`section ${styles.mentorship}`} aria-labelledby="mentorship-heading">
      <div className="container">
        <div className={styles.header}>
          <SectionHeader
            label="Mentorship"
            title="Let's grow together."
            subtitle="I offer two tracks a free path for early-career designers, and paid engagements for those with specific goals and tighter timelines."
          />
          <Button as="link" href="/mentorship" variant="secondary" size="md" className={styles.seeAll}>
            View mentorship →
          </Button>
        </div>

        <div className={styles.tracks}>
          {/* Free track */}
          <motion.div
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <BorderGlow backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
              <div className={`${styles.card} ${styles.free}`}>
                <div className={styles.cardTop}>
                  <span className={`label ${styles.trackBadge} ${styles.freeBadge}`}>Free</span>
                  <h3 className="heading-3"><Shuffle tag="span" text={freeTier.name} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></h3>
                  <p className={styles.tierTagline}>{freeTier.tagline}</p>
                </div>
                <ul className={styles.includes} role="list">
                  {freeTier.includes.map((item) => (
                    <li key={item} className={styles.includeItem}>
                      <span aria-hidden="true">✦</span> {item}
                    </li>
                  ))}
                </ul>
                <Button as="a" href={freeTier.cta.href} variant="secondary" size="md">
                  {freeTier.cta.label}
                </Button>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Paid tracks */}
          <div className={styles.paidTracks}>
            {paidTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i + 1) * 0.1 }}
              >
                <BorderGlow backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
                  <div className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={`label ${styles.trackBadge} ${styles.paidBadge}`}>Paid</span>
                      <h3 className="heading-3"><Shuffle tag="span" text={tier.name} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></h3>
                      <p className={styles.tierTagline}>{tier.tagline}</p>
                      <p className={styles.duration}>{tier.duration}</p>
                    </div>
                    <ul className={styles.includes} role="list">
                      {tier.includes.slice(0, 4).map((item) => (
                        <li key={item} className={styles.includeItem}>
                          <span aria-hidden="true">✦</span> {item}
                        </li>
                      ))}
                    </ul>
                    <Button as="a" href={tier.cta.href} variant="primary" size="md">
                      {tier.cta.label}
                    </Button>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
