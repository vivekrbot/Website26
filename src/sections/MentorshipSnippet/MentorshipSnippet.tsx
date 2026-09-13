import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import Shuffle from '../../components/Shuffle/Shuffle';
import BorderGlow from '../../components/BorderGlow/BorderGlow';
import { Button } from '../../components/Button/Button';
import { mentorshipTiers } from '../../data/mentorship';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { MentorshipTier } from '../../types';
import styles from './MentorshipSnippet.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function TierCard({ tier, index, reducedMotion }: { tier: MentorshipTier; index: number; reducedMotion: boolean }) {
  const isFree = tier.type === 'free';
  return (
    <motion.div
      variants={fadeUp}
      initial={reducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <BorderGlow backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
        <div className={`${styles.card} ${isFree ? styles.free : ''}`}>
          <div className={styles.cardTop}>
            <span className={`label ${styles.trackBadge} ${isFree ? styles.freeBadge : styles.paidBadge}`}>
              {isFree ? 'Free' : 'Paid'}
            </span>
            <h3 className="heading-3"><Shuffle tag="span" text={tier.name} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></h3>
            <p className={styles.tierTagline}>{tier.tagline}</p>
            {!isFree && <p className={styles.duration}>{tier.duration}</p>}
          </div>
          <ul className={styles.includes} role="list">
            {(isFree ? tier.includes : tier.includes.slice(0, 4)).map((item) => (
              <li key={item} className={styles.includeItem}>
                <span aria-hidden="true">✦</span> {item}
              </li>
            ))}
          </ul>
          <Button as="a" href={tier.cta.href} variant={isFree ? 'secondary' : 'primary'} size="md">
            {tier.cta.label}
          </Button>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

export function MentorshipSnippet() {
  const reducedMotion = useReducedMotion();
  const freeTiers = mentorshipTiers.filter((t) => t.type === 'free');
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

        <div className={styles.groups}>
          {freeTiers.length > 0 && (
            <div className={styles.group}>
              <p className={`label ${styles.groupLabel}`}>Free</p>
              <div className={styles.tracks}>
                {freeTiers.map((tier, i) => (
                  <TierCard key={tier.id} tier={tier} index={i} reducedMotion={reducedMotion} />
                ))}
              </div>
            </div>
          )}

          {paidTiers.length > 0 && (
            <div className={styles.group}>
              <p className={`label ${styles.groupLabel}`}>Paid</p>
              <div className={styles.tracks}>
                {paidTiers.map((tier, i) => (
                  <TierCard key={tier.id} tier={tier} index={i} reducedMotion={reducedMotion} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
