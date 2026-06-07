import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { Button } from '../../components/Button/Button';
import { skills, values, aboutFull, quickFacts } from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './About.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const SKILL_CATEGORIES = ['craft', 'strategy', 'tools'] as const;
const CATEGORY_LABELS: Record<typeof SKILL_CATEGORIES[number], string> = {
  craft: 'Design Craft',
  strategy: 'Strategy & Leadership',
  tools: 'Tools & Tech',
};

export default function About() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>About — Vivek Ramachandran</title>
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
              I design at the<br />
              <span className="gradient-text">intersection of craft</span><br />
              and consequence.
            </h1>
          </motion.div>

          <motion.div
            className={styles.avatarWrap}
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            animate="visible"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            {/* Avatar placeholder — replace with <img src="..." alt="Vivek Ramachandran" /> */}
            <div className={styles.avatarPlaceholder} role="img" aria-label="Photo of Vivek Ramachandran — placeholder">
              <span>VR</span>
            </div>
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
              <h2 id="story-heading" className={`heading-2 ${styles.storyTitle}`}>My story</h2>
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
              className={`glass-card ${styles.facts}`}
              aria-label="Quick facts"
              variants={fadeUp}
              initial={reducedMotion ? 'visible' : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
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
                className={`glass-card ${styles.skillCategory}`}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                <h3 className={`label ${styles.catLabel}`}>{CATEGORY_LABELS[cat]}</h3>
                <ul className={styles.skillList} role="list">
                  {skills.filter((s) => s.category === cat).map((skill) => (
                    <li key={skill.name} className={styles.skillItem}>{skill.name}</li>
                  ))}
                </ul>
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
                className={`glass-card ${styles.valueCard}`}
                variants={fadeUp}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              >
                <span className={styles.valueNumber} aria-hidden="true">0{i + 1}</span>
                <h3 className={`heading-3 ${styles.valueTitle}`}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`} aria-labelledby="cta-heading">
        <div className="container">
          <motion.div
            className={`glass-card ${styles.ctaCard}`}
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 id="cta-heading" className="heading-2">Ready to work together?</h2>
            <p className={styles.ctaBody}>
              Whether you have a project in mind, want mentorship, or just want to connect — my inbox is open.
            </p>
            <div className={styles.ctaBtns}>
              <Button as="a" href="mailto:vdraganer@gmail.com" variant="primary" size="lg">
                Say hello
              </Button>
              <Button as="link" href="/mentorship" variant="secondary" size="lg">
                Explore mentorship
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
