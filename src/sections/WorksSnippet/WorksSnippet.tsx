import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { Button } from '../../components/Button/Button';
import { featuredProjects } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './WorksSnippet.module.css';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Design Systems':    'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
  'Product Design':    'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)',
  'UX Research':       'linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%)',
  'Strategy':          'linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)',
  'Mobile':            'linear-gradient(135deg,#10b981 0%,#3b82f6 100%)',
};
const DEFAULT_GRADIENT = 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export function WorksSnippet() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="works"
      className={`section ${styles.works}`}
      aria-labelledby="works-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <SectionHeader
            label="Selected Work"
            title="Projects that moved the needle."
            subtitle="A cross-section of product design, strategy, and systems work across consumer and enterprise."
          />
          <Button as="link" href="/works" variant="secondary" size="md" className={styles.seeAll}>
            See all work →
          </Button>
        </div>

        <motion.ul
          className={styles.grid}
          role="list"
          variants={stagger}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {featuredProjects.map((project) => (
            <motion.li key={project.slug} variants={cardAnim}>
              <Link
                to={`/works/${project.slug}`}
                className={`glass-card ${styles.card}`}
                aria-label={`${project.title} — ${project.tagline}`}
              >
                <div className={styles.cover} aria-hidden="true">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt="" className={styles.coverImg} loading="lazy" />
                  ) : (
                    <div
                      className={styles.coverInner}
                      style={{ background: CATEGORY_GRADIENTS[project.category] ?? DEFAULT_GRADIENT }}
                    >
                      <span className={styles.coverLabel}>{project.category}</span>
                    </div>
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.meta}>
                    <span className={`label ${styles.category}`}>{project.category}</span>
                    <span className={styles.year}>{project.year}</span>
                  </div>
                  <h3 className={`heading-3 ${styles.title}`}>{project.title}</h3>
                  <p className={styles.tagline}>{project.tagline}</p>

                  <ul className={styles.tags} role="list" aria-label="Technologies used">
                    {project.tags.slice(0, 3).map((tag) => (
                      <li key={tag} className={styles.tag}>{tag}</li>
                    ))}
                  </ul>

                  <span className={styles.cta} aria-hidden="true">
                    View case study →
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
