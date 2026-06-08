import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { projects } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './Works.module.css';

const ALL = 'All';
const categories = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))];

const cardAnim = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};

export default function Works() {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const reducedMotion = useReducedMotion();

  const filtered = activeFilter === ALL
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <Helmet>
        <title>Itsvivek.Works</title>
        <meta name="description" content="Selected product design and strategy projects by Vivek Ramachandran — design systems, mobile apps, dashboards, branding, and more." />
        <meta property="og:title" content="Work — Vivek Ramachandran" />
      </Helmet>

      <section className={`section ${styles.hero}`} aria-labelledby="works-page-heading">
        <div className="container">
          <SectionHeader
            label="Selected Work"
            title="Products, systems, and strategies."
            subtitle="A curated selection of design and strategy work across consumer, enterprise, and brand contexts."
          />

          {/* Filter bar */}
          <nav aria-label="Filter projects by category">
            <ul className={styles.filters} role="list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`${styles.filter} ${activeFilter === cat ? styles.filterActive : ''}`}
                    onClick={() => setActiveFilter(cat)}
                    aria-pressed={activeFilter === cat}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className={styles.grid} aria-label="Projects">
        <div className="container">
          <motion.ul
            className={styles.projectGrid}
            role="list"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.li
                  key={project.slug}
                  layout
                  variants={reducedMotion ? {} : cardAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    to={`/works/${project.slug}`}
                    className={`glass-card ${styles.card}`}
                    aria-label={`${project.title} — ${project.tagline}`}
                  >
                    <div className={styles.cover} aria-hidden="true">
                      <div className={styles.coverGradient} />
                      <span className={styles.coverYear}>{project.year}</span>
                    </div>
                    <div className={styles.info}>
                      <div className={styles.meta}>
                        <span className={`label ${styles.category}`}>{project.category}</span>
                        {project.featured && (
                          <span className={styles.featuredBadge} aria-label="Featured project">Featured</span>
                        )}
                      </div>
                      <h2 className={`heading-3 ${styles.title}`}>{project.title}</h2>
                      <p className={styles.tagline}>{project.tagline}</p>
                      <p className={styles.role}>{project.role}</p>
                      <ul className={styles.tags} role="list" aria-label="Tags">
                        {project.tags.map((tag) => (
                          <li key={tag} className={styles.tag}>{tag}</li>
                        ))}
                      </ul>
                      <span className={styles.cta} aria-hidden="true">View case study →</span>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>
    </>
  );
}
