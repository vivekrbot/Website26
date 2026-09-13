import { Seo } from '../../components/Seo/Seo';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import Shuffle from '../../components/Shuffle/Shuffle';
import { GlowCard } from '../../components/GlowCard/GlowCard';
import { Button } from '../../components/Button/Button';
import { mentorshipTiers } from '../../data/mentorship';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fadeUp } from '../../lib/motion';
import styles from './Mentorship.module.css';

// `paidOnly` items only make sense to ask when a paid track actually exists —
// filtered against live tier data in the component below.
const faqs = [
  {
    q: 'How do I know which track is right for me?',
    a: 'If you\'re early in your career or just need a sounding board, start with the free track — no commitment, no agenda. If you have a specific goal and want structured, ongoing support, look at the paid options below.',
    paidOnly: true,
  },
  {
    q: 'What timezone do you work in?',
    a: 'I\'m based in India (IST), but happy to work around other timezones where I can — mention yours when you reach out and we\'ll find a time that works.',
  },
  {
    q: 'How many mentees do you take on at once?',
    a: 'I keep my paid cohort intentionally small so everyone gets real attention, not just a slot on a calendar.',
    paidOnly: true,
  },
  {
    q: 'Do you work with designers outside of product design?',
    a: 'Primarily product/UX, but I\'ve worked with brand designers, design engineers, and design managers. If you\'re on the fence, just reach out — worst case I\'ll point you somewhere better.',
  },
  {
    q: 'What if I can\'t afford paid mentorship?',
    a: 'The free track is genuinely free, no strings attached — start there.',
    paidOnly: true,
  },
];

export default function Mentorship() {
  const reducedMotion = useReducedMotion();
  const freeTiers = mentorshipTiers.filter((t) => t.type === 'free');
  const paidTiers = mentorshipTiers.filter((t) => t.type === 'paid');
  // With exactly 2 tiers this lands on index 1, same as before. With 1 tier
  // there's nothing to compare, so nothing is featured; with 3+ it picks a
  // middle-ish tier instead of always index 1 regardless of count.
  const featuredPaidIndex = paidTiers.length >= 2 ? Math.ceil((paidTiers.length - 1) / 2) : -1;
  const hasPaidTrack = paidTiers.length > 0;
  const visibleFaqs = faqs.filter((f) => !f.paidOnly || hasPaidTrack);

  return (
    <>
      <Seo
        title="Mentorship — Vivek Ramachandran"
        description={
          hasPaidTrack
            ? 'Mentorship for product designers — free office hours and paid 1:1 engagements with Vivek Ramachandran, product designer and strategist.'
            : 'Free mentorship office hours for product designers with Vivek Ramachandran, product designer and strategist.'
        }
        path="/mentorship"
      />

      {/* Hero */}
      <section className={`section ${styles.hero}`} aria-labelledby="mentorship-page-heading">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            animate="visible"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={styles.heroText}
          >
            <p className={`label ${styles.eyebrow}`}>Mentorship</p>
            <h1 id="mentorship-page-heading" className={`display-2 ${styles.headline}`}>
              <span style={{ display: 'block' }}><Shuffle tag="span" text="The support I wish" textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></span>
              <span style={{ display: 'block' }}><Shuffle tag="span" text="I had earlier." textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></span>
            </h1>
            <p className={styles.heroSub}>
              I've been where you are — mentorship built around where you are in your journey,
              no gatekeeping, no BS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Free track */}
      {freeTiers.length > 0 && (
      <section className={`section ${styles.freeSection}`} aria-labelledby="free-heading">
        <div className="container">
          <SectionHeader
            id="free-heading"
            label="Free track"
            title="No-cost office hours."
            subtitle="Pick whichever format fits what you're working through right now."
            align="center"
          />

          <div className={styles.paidGrid}>
            {freeTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                <GlowCard>
                  <div className={styles.paidCard}>
                    <div className={styles.paidCardTop}>
                      <span className={`label ${styles.freeBadge}`}>Free</span>
                      <h3 className={`heading-2 ${styles.paidTierName}`}><Shuffle tag="span" text={tier.name} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></h3>
                      <p className={styles.paidTierTagline}>{tier.tagline}</p>
                      <p className={styles.paidDuration}>{tier.duration}</p>
                    </div>

                    <ul className={styles.paidIncludes} role="list">
                      {tier.includes.map((item, i) => (
                        <li key={`${item}-${i}`} className={styles.paidIncludesItem}>
                          <span className={styles.bullet} aria-hidden="true">✦</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.forWhomBox}>
                      <p className={`label ${styles.forWhomLabel}`}>Who it's for</p>
                      <p className={styles.forWhomText}>{tier.forWhom}</p>
                    </div>

                    <Button as="a" href={tier.cta.href} variant="secondary" size="lg">
                      {tier.cta.label}
                    </Button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Paid tracks */}
      {paidTiers.length > 0 && (
      <section className={`section ${styles.paidSection}`} aria-labelledby="paid-heading">
        <div className="container">
          <SectionHeader
            id="paid-heading"
            label="Paid track"
            title="Structured support for specific goals."
            subtitle="Pick the intensity that matches your timeline and ambition."
            align="center"
          />

          <div className={styles.paidGrid}>
            {paidTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                <GlowCard>
                  <div className={`${styles.paidCard} ${i === featuredPaidIndex ? styles.featured : ''}`}>
                    {i === featuredPaidIndex && (
                      <div className={styles.popularBadge} aria-label="Most popular">Most popular</div>
                    )}
                    <div className={styles.paidCardTop}>
                      <h3 className={`heading-2 ${styles.paidTierName}`}><Shuffle tag="span" text={tier.name} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></h3>
                      <p className={styles.paidTierTagline}>{tier.tagline}</p>
                      {tier.price && (
                        <div className={styles.priceLine}>
                          <span className={`heading-1 ${styles.price}`}>{tier.price}</span>
                        </div>
                      )}
                      <p className={styles.paidDuration}>{tier.duration}</p>
                    </div>

                    <ul className={styles.paidIncludes} role="list">
                      {tier.includes.map((item, i) => (
                        <li key={`${item}-${i}`} className={styles.paidIncludesItem}>
                          <span className={styles.bullet} aria-hidden="true">✦</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.forWhomBox}>
                      <p className={`label ${styles.forWhomLabel}`}>Best for</p>
                      <p className={styles.forWhomText}>{tier.forWhom}</p>
                    </div>

                    <Button
                      as="a"
                      href={tier.cta.href}
                      variant={i === featuredPaidIndex ? 'primary' : 'secondary'}
                      size="lg"
                    >
                      {tier.cta.label}
                    </Button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      <section className={`section ${styles.faq}`} aria-labelledby="faq-heading">
        <div className="container">
          <SectionHeader id="faq-heading" label="FAQ" title="Common questions." />
          <dl className={styles.faqList}>
            {visibleFaqs.map((item, i) => (
              <motion.div
                key={i}
                className={styles.faqItem}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              >
                <dt className={`heading-3 ${styles.faqQ}`}><Shuffle tag="span" text={item.q} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.018} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></dt>
                <dd className={styles.faqA}>{item.a}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`} aria-labelledby="mentorship-cta-heading">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlowCard>
              <div className={styles.ctaCard}>
                <h2 id="mentorship-cta-heading" className="heading-2">
                  <Shuffle tag="span" text="Not sure where to start?" textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} />
                </h2>
                <p className={styles.ctaBody}>
                  Drop me an email describing where you are and what you're trying to achieve.
                  I'll point you in the right direction — even if that's not me.
                </p>
                <Button as="a" href="mailto:vdraganer@gmail.com?subject=Mentorship Enquiry" variant="primary" size="lg">
                  Send me a message
                </Button>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>
    </>
  );
}
