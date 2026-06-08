import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { Button } from '../../components/Button/Button';
import { mentorshipTiers } from '../../data/mentorship';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './Mentorship.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const faqs = [
  {
    q: 'How do I know which track is right for me?',
    a: 'If you\'re early in your career or just need a sounding board, start with the free office hours — no commitment, no agenda. If you have a specific goal (senior role, better portfolio, job switch) and want structured support over time, apply for Orbit or Deep Dive.',
  },
  {
    q: 'What timezone do you work in?',
    a: '[YOUR TIMEZONE — placeholder]. I try to accommodate other timezones where possible — mention yours in your application.',
  },
  {
    q: 'How many mentees do you take at once?',
    a: 'I keep cohorts intentionally small — typically [X] paid mentees at a time — to ensure the quality of attention each person gets.',
  },
  {
    q: 'Do you work with designers outside of product design?',
    a: 'Primarily product/UX, but I\'ve worked with brand designers, design engineers, and design managers. If you\'re on the fence, just reach out — worst case I\'ll point you somewhere better.',
  },
  {
    q: 'What if I can\'t afford paid mentorship?',
    a: 'The free office hours are genuinely free. I also occasionally offer sliding-scale spots — mention your situation in your email.',
  },
];

export default function Mentorship() {
  const reducedMotion = useReducedMotion();
  const freeTier  = mentorshipTiers.find((t) => t.type === 'free')!;
  const paidTiers = mentorshipTiers.filter((t) => t.type === 'paid');

  return (
    <>
      <Helmet>
        <title>Itsvivek.Mentorship</title>
        <meta name="description" content="Mentorship for product designers — free office hours and paid 1:1 engagements with Vivek Ramachandran, product designer and strategist." />
        <meta property="og:title" content="Mentorship — Vivek Ramachandran" />
      </Helmet>

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
              The support I wish<br />
              <span className="gradient-text">I had earlier.</span>
            </h1>
            <p className={styles.heroSub}>
              I've been where you are. Two tracks, designed around where you are in your journey —
              no gatekeeping, no BS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Free track */}
      <section className={`section ${styles.freeSection}`} aria-labelledby="free-heading">
        <div className="container">
          <div className={styles.freeGrid}>
            <motion.div
              variants={fadeUp}
              initial={reducedMotion ? 'visible' : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={`label ${styles.freeBadge}`}>Free track</span>
              <h2 id="free-heading" className={`heading-1 ${styles.tierTitle}`}>{freeTier.name}</h2>
              <p className={styles.tierTagline}>{freeTier.tagline}</p>
              <p className={styles.forWhom}>
                <strong>Who it's for:</strong> {freeTier.forWhom}
              </p>
              <Button as="a" href={freeTier.cta.href} variant="outline" size="lg">
                {freeTier.cta.label}
              </Button>
            </motion.div>

            <motion.div
              className={`glass-card ${styles.includesCard}`}
              variants={fadeUp}
              initial={reducedMotion ? 'visible' : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <p className={`label ${styles.includesLabel}`}>What's included</p>
              <ul className={styles.includesList} role="list">
                {freeTier.includes.map((item) => (
                  <li key={item} className={styles.includesItem}>
                    <span className={styles.bullet} aria-hidden="true">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.duration}>{freeTier.duration}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Paid tracks */}
      <section className={`section ${styles.paidSection}`} aria-labelledby="paid-heading">
        <div className="container">
          <SectionHeader
            label="Paid track"
            title="Structured support for specific goals."
            subtitle="Two tiers — pick the intensity that matches your timeline and ambition."
            align="center"
          />

          <div className={styles.paidGrid}>
            {paidTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                className={`glass-card ${styles.paidCard} ${i === 1 ? styles.featured : ''}`}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                {i === 1 && (
                  <div className={styles.popularBadge} aria-label="Most popular">Most popular</div>
                )}
                <div className={styles.paidCardTop}>
                  <h3 className={`heading-2 ${styles.paidTierName}`}>{tier.name}</h3>
                  <p className={styles.paidTierTagline}>{tier.tagline}</p>
                  <div className={styles.priceLine}>
                    <span className={`heading-1 ${styles.price}`}>{tier.price}</span>
                  </div>
                  <p className={styles.paidDuration}>{tier.duration}</p>
                </div>

                <ul className={styles.paidIncludes} role="list">
                  {tier.includes.map((item) => (
                    <li key={item} className={styles.paidIncludesItem}>
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
                  variant={i === 1 ? 'primary' : 'outline'}
                  size="lg"
                >
                  {tier.cta.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`section ${styles.faq}`} aria-labelledby="faq-heading">
        <div className="container">
          <SectionHeader label="FAQ" title="Common questions." />
          <dl className={styles.faqList}>
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                className={styles.faqItem}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              >
                <dt className={`heading-3 ${styles.faqQ}`}>{item.q}</dt>
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
            className={`glass-card ${styles.ctaCard}`}
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 id="mentorship-cta-heading" className="heading-2">Not sure where to start?</h2>
            <p className={styles.ctaBody}>
              Drop me an email describing where you are and what you're trying to achieve.
              I'll point you in the right direction — even if that's not me.
            </p>
            <Button as="a" href="mailto:vdraganer@gmail.com?subject=Mentorship Enquiry" variant="primary" size="lg">
              Send me a message
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
