import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import Shuffle from '../../components/Shuffle/Shuffle';
import BorderGlow from '../../components/BorderGlow/BorderGlow';
import { Button } from '../../components/Button/Button';
import { StampSeal } from '../../components/StampSeal/StampSeal';
import { skills, values, aboutFull, quickFacts } from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import avatarImg from '../../img/IMG_5501.JPG';
import styles from './About.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const SKILL_CATEGORIES = ['craft', 'strategy', 'tools', 'ai'] as const;
const CATEGORY_LABELS: Record<typeof SKILL_CATEGORIES[number], string> = {
  craft: 'Design Craft',
  strategy: 'Strategy & Leadership',
  tools: 'Tools & Tech',
  ai: 'AI & Automation',
};

export default function About() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>Itsvivek.About</title>
        <meta name="description" content="Learn about Vivek Ramachandran — product designer, strategist, and mentor with deep expertise in design systems, UX research, and product strategy." />
        <meta property="og:title" content="About — Vivek Ramachandran" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className={`section ${styles.hero}`} aria-labelledby="about-page-heading">
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            animate="visible"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`label ${styles.eyebrow}`}>About me</p>
            <h1 id="about-page-heading" className={`display-2 ${styles.headline}`}>
              <span style={{ display: 'block' }}><Shuffle tag="span" text="I design at the" textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></span>
              <span style={{ display: 'block' }}><Shuffle tag="span" text="intersection of craft" textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></span>
              <span style={{ display: 'block' }}><Shuffle tag="span" text="and consequence." textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></span>
            </h1>
          </motion.div>

          <motion.div
            className={styles.avatarWrap}
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            animate="visible"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <img src={avatarImg} alt="Photo of Vivek Ramachandran" className={styles.avatar} />
            <StampSeal size={110} animate={false} opacity={0.6} className={styles.avatarSeal} />
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className={`section ${styles.story}`} aria-labelledby="story-heading">
        <div className="container">
          <div className={styles.storyGrid}>
            <motion.div
              variants={fadeUp}
              initial={reducedMotion ? 'visible' : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 id="story-heading" className={`heading-2 ${styles.storyTitle}`}>
                <Shuffle tag="span" text="My story" textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} />
              </h2>
              {aboutFull.split('\n\n').map((para, i) => (
                <p key={i} className={styles.storyPara}>{para}</p>
              ))}
              <div className={styles.storyCtas}>
                <Button as="a" href="mailto:vdraganer@gmail.com" variant="primary" size="md">
                  Get in touch
                </Button>
                <Button as="link" href="/works" variant="secondary" size="md">
                  View my work →
                </Button>
              </div>
            </motion.div>

            {/* Quick facts sidebar */}
            <motion.aside
              aria-label="Quick facts"
              variants={fadeUp}
              initial={reducedMotion ? 'visible' : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <BorderGlow className={styles.facts} backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
                <dl className={styles.factList}>
                  {[
                    { dt: 'Based in',   dd: quickFacts.city },
                    { dt: 'Experience', dd: quickFacts.years },
                    { dt: 'Background', dd: quickFacts.background },
                    { dt: 'Currently',  dd: quickFacts.currentRole },
                    { dt: 'Education',  dd: quickFacts.education },
                  ].map(({ dt, dd }) => (
                    <div key={dt} className={styles.fact}>
                      <dt className={`label ${styles.factLabel}`}>{dt}</dt>
                      <dd className={styles.factValue}>{dd}</dd>
                    </div>
                  ))}
                </dl>
              </BorderGlow>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className={`section ${styles.skillsSection}`} aria-labelledby="skills-heading">
        <div className="container">
          <SectionHeader label="Skills & Expertise" title="What I bring to the table." />
          <div className={styles.skillsGrid}>
            {SKILL_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                <BorderGlow className={styles.skillCategory} backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
                  <h3 className={`label ${styles.catLabel}`}>{CATEGORY_LABELS[cat]}</h3>
                  <ul className={styles.skillList} role="list">
                    {skills.filter((s) => s.category === cat).map((skill) => (
                      <li key={skill.name} className={styles.skillItem}>{skill.name}</li>
                    ))}
                  </ul>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`} aria-labelledby="values-heading">
        <div className="container">
          <SectionHeader label="How I work" title="Principles I design by." />
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              >
                <BorderGlow className={styles.valueCard} backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
                  <span className={styles.valueNumber} aria-hidden="true">0{i + 1}</span>
                  <h3 className={`heading-3 ${styles.valueTitle}`}><Shuffle tag="span" text={v.title} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} /></h3>
                  <p className={styles.valueBody}>{v.body}</p>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`} aria-labelledby="cta-heading">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <BorderGlow backgroundColor="var(--bg-primary)" borderRadius={0} glowColor="0 0 88" colors={['#ffffff', '#cccccc', '#888888']} glowIntensity={0.85}>
              <div className={styles.ctaCard}>
                <h2 id="cta-heading" className="heading-2">
                  <Shuffle tag="span" text="Ready to work together?" textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0.1} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} />
                </h2>
                <p className={styles.ctaBody}>
                  Whether you have a project in mind, want mentorship, or just want to connect - my inbox is open.
                </p>
                <div className={styles.ctaBtns}>
                  <Button as="a" href="https://calendly.com/vdraganer" variant="primary" size="lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Book a Call
                  </Button>
                  <Button as="a" href="mailto:vdraganer@gmail.com" variant="secondary" size="lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Send an Email
                  </Button>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </section>
    </>
  );
}
