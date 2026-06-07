import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { projects } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './WorkDetail.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const reducedMotion = useReducedMotion();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/works" replace />;

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];
  const prev = projects[(currentIndex - 1 + projects.length) % projects.length];

  return (
    <>
      <Helmet>
        <title>{project.title} — Vivek Ramachandran</title>
        <meta name="description" content={project.tagline} />
        <meta property="og:title" content={`${project.title} — Vivek Ramachandran`} />
        <meta property="og:description" content={project.tagline} />
      </Helmet>

      {/* Hero */}
      <section className={`section ${styles.hero}`} aria-labelledby="case-study-heading">
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            variants={fadeUp}
            initial={reducedMotion ? 'visible' : 'hidden'}
            animate="visible"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/works" className={styles.back}>← All work</Link>
            <div className={styles.heroMeta}>
              <span className={`label ${styles.category}`}>{project.category}</span>
              <span className={styles.year}>{project.year}</span>
            </div>
            <h1 id="case-study-heading" className={`display-2 ${styles.title}`}>{project.title}</h1>
            <p className={styles.tagline}>{project.tagline}</p>

            <div className={styles.metaGrid}>
              <div>
                <p className={`label ${styles.metaLabel}`}>Role</p>
                <p className={styles.metaValue}>{project.role}</p>
              </div>
              <div>
                <p className={`label ${styles.metaLabel}`}>Category</p>
                <p className={styles.metaValue}>{project.category}</p>
              </div>
              <div>
                <p className={`label ${styles.metaLabel}`}>Year</p>
                <p className={styles.metaValue}>{project.year}</p>
              </div>
            </div>

            {project.links.length > 0 && (
              <div className={styles.links}>
                {project.links.map((link) => (
                  <Button key={link.label} as="a" href={link.url} variant="secondary" size="sm">
                    {link.label} ↗
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Cover placeholder */}
        <div className={styles.coverWrap} aria-hidden="true">
          <div className={styles.cover}>
            <div className={styles.coverGradient} />
            <div className={styles.coverPattern} />
            <p className={styles.coverPlaceholder}>[Project cover image — replace with real visual]</p>
          </div>
        </div>
      </section>

      {/* Tags */}
      <div className={`container ${styles.tagsRow}`}>
        <ul className={styles.tags} role="list" aria-label="Project tags">
          {project.tags.map((tag) => (
            <li key={tag} className={styles.tag}>{tag}</li>
          ))}
        </ul>
      </div>

      {/* Case study body */}
      <article className="container" aria-label="Case study">
        {/* Problem */}
        <motion.section
          className={styles.caseSection}
          aria-labelledby="problem-heading"
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={`label ${styles.caseLabel}`}>01 — The Problem</p>
          <h2 id="problem-heading" className={`heading-2 ${styles.caseTitle}`}>What we were solving</h2>
          <p className={styles.caseBody}>{project.problem}</p>
        </motion.section>

        {/* Visual placeholder */}
        <div className={styles.visualPlaceholder} aria-hidden="true">
          [Visual / screenshot — replace with real project image]
        </div>

        {/* Process */}
        <motion.section
          className={styles.caseSection}
          aria-labelledby="process-heading"
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={`label ${styles.caseLabel}`}>02 — The Process</p>
          <h2 id="process-heading" className={`heading-2 ${styles.caseTitle}`}>How we got there</h2>
          <ol className={styles.processList}>
            {project.process.map((step, i) => (
              <li key={i} className={styles.processItem}>
                <span className={styles.processNum} aria-hidden="true">0{i + 1}</span>
                <p className={styles.processText}>{step}</p>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Visual placeholder 2 */}
        <div className={styles.visualPlaceholder} aria-hidden="true">
          [Process visual / wireframe — replace with real project image]
        </div>

        {/* Outcome */}
        <motion.section
          className={styles.caseSection}
          aria-labelledby="outcome-heading"
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={`label ${styles.caseLabel}`}>03 — The Outcome</p>
          <h2 id="outcome-heading" className={`heading-2 ${styles.caseTitle}`}>What we shipped</h2>
          <p className={`${styles.caseBody} ${styles.outcomeBody}`}>{project.outcome}</p>
        </motion.section>
      </article>

      {/* Next/Prev navigation */}
      <nav className={`container ${styles.projectNav}`} aria-label="Navigate between projects">
        <Link to={`/works/${prev.slug}`} className={`glass-card ${styles.navCard}`}>
          <span className={`label ${styles.navDir}`}>← Previous</span>
          <span className={styles.navTitle}>{prev.title}</span>
        </Link>
        <Link to={`/works/${next.slug}`} className={`glass-card ${styles.navCard}`}>
          <span className={`label ${styles.navDir}`}>Next →</span>
          <span className={styles.navTitle}>{next.title}</span>
        </Link>
      </nav>

      <div className={`container ${styles.bottomPad}`} />
    </>
  );
}
