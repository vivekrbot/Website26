import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import Shuffle from '../../components/Shuffle/Shuffle';
import { GlowCard } from '../../components/GlowCard/GlowCard';
import { Button } from '../../components/Button/Button';
import { mentorshipTiers } from '../../data/mentorship';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fadeUp } from '../../lib/motion';
import type { MentorshipTier } from '../../types';
import styles from './MentorshipSnippet.module.css';

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
      <GlowCard>
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
            {(isFree ? tier.includes : tier.includes.slice(0, 4)).map((item, i) => (
              <li key={`${item}-${i}`} className={styles.includeItem}>
                <span aria-hidden="true">✦</span> {item}
              </li>
            ))}
          </ul>
          <Button as="a" href={tier.cta.href} variant={isFree ? 'secondary' : 'primary'} size="md">
            {tier.cta.label}
          </Button>
        </div>
      </GlowCard>
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
            id="mentorship-heading"
            label="Mentorship"
            title="Let's grow together."
            subtitle={
              paidTiers.length > 0
                ? 'Free office hours for early-career designers, and paid engagements for those with specific goals and tighter timelines.'
                : 'Free office hours for designers who want a sounding board — no strings attached.'
            }
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
