import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Seo } from '../../components/Seo/Seo';
import { Button } from '../../components/Button/Button';
import Shuffle from '../../components/Shuffle/Shuffle';
import { GlowCard } from '../../components/GlowCard/GlowCard';
import { projects } from '../../data/projects';
import { projectBodies } from '../../data/project-bodies';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { fadeUp } from '../../lib/motion';
import styles from './WorkDetail.module.css';

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const reducedMotion = useReducedMotion();
  const project = projects.find((p) => p.slug === slug);
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);

  useScrollLock(Boolean(expandedImage));

  useEffect(() => {
    if (!expandedImage) return;
    const lightbox = lightboxRef.current;
    lightbox?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedImage(null);
        return;
      }
      if (e.key !== 'Tab' || !lightbox) return;
      // Focus trap: the close button is the only focusable element today,
      // but this stays correct if more are added later.
      const focusable = lightbox.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      lightboxTriggerRef.current?.focus();
      lightboxTriggerRef.current = null;
    };
  }, [expandedImage]);

  // Memoized so @portabletext/react doesn't see a new `image` renderer identity
  // on every render — an unmemoized one here remounts every body-image button
  // whenever WorkDetail re-renders (e.g. the very re-render that opening the
  // lightbox itself triggers), which was silently breaking focus restoration:
  // the button captured in lightboxTriggerRef got replaced by a new DOM node
  // before the lightbox's cleanup tried to focus it back.
  const portableTextComponents: PortableTextComponents = useMemo(() => ({
    types: {
      image: ({ value }) => {
        const src = value?.asset?.url;
        const alt = value?.alt ?? '';
        const width = value?.asset?.width;
        const height = value?.asset?.height;
        if (!src) return null;
        return (
          <button
            type="button"
            className={styles.bodyImageButton}
            onClick={(e) => { lightboxTriggerRef.current = e.currentTarget; setExpandedImage({ src, alt }); }}
            aria-label={alt ? `Expand image: ${alt}` : 'Expand image'}
          >
            {/* width/height (not just CSS) let the browser reserve the right
                aspect ratio before the image loads, instead of the layout
                jumping once it does. */}
            <img
              className={styles.bodyImage}
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
            />
          </button>
        );
      },
    },
  }), [setExpandedImage]);

  if (!project) return <Navigate to="/works" replace />;

  const body = projectBodies[project.slug] ?? [];
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const hasOtherProjects = projects.length > 1;
  const next = hasOtherProjects ? projects[(currentIndex + 1) % projects.length] : undefined;
  const prev = hasOtherProjects ? projects[(currentIndex - 1 + projects.length) % projects.length] : undefined;

  return (
    <>
      <Seo
        title={`${project.title} — Vivek Ramachandran`}
        description={project.tagline}
        path={`/works/${project.slug}`}
        type="article"
        image={project.coverImage || undefined}
      />

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
            <h1 id="case-study-heading" className={`display-2 ${styles.title}`}>
              <Shuffle tag="span" text={project.title} textAlign="left" shuffleDirection="right" duration={0.4} stagger={0.022} threshold={0} rootMargin="0px" triggerOnce={true} triggerOnHover={true} respectReducedMotion={true} />
            </h1>
            <p className={styles.tagline}>{project.tagline}</p>

            <div className={styles.metaGrid}>
              {project.role && (
                <div>
                  <p className={`label ${styles.metaLabel}`}>Role</p>
                  <p className={styles.metaValue}>{project.role}</p>
                </div>
              )}
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

        {/* Cover */}
        <div className={styles.coverWrap}>
          <div className={`${styles.cover} ${project.coverImage ? styles.coverHasImage : ''}`}>
            {project.coverImage ? (
              <button
                type="button"
                className={styles.coverButton}
                onClick={(e) => { lightboxTriggerRef.current = e.currentTarget; setExpandedImage({ src: project.coverImage!, alt: `${project.title} cover image` }); }}
                aria-label={`Expand cover image for ${project.title}`}
              >
                <img src={project.coverImage} alt="" className={styles.coverImg} />
              </button>
            ) : (
              <>
                <div className={styles.coverGradient} />
                <div className={styles.coverPattern} />
              </>
            )}
          </div>
        </div>
      </section>

      {expandedImage && createPortal(
        <div
          ref={lightboxRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={expandedImage.alt || 'Expanded image'}
          tabIndex={-1}
          onClick={() => setExpandedImage(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setExpandedImage(null)}
            aria-label="Close expanded image"
          >
            &#10005;
          </button>
          <img
            src={expandedImage.src}
            alt={expandedImage.alt}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className={`container ${styles.tagsRow}`}>
          <ul className={styles.tags} role="list" aria-label="Project tags">
            {project.tags.map((tag, i) => (
              <li key={`${tag}-${i}`} className={styles.tag}>{tag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Short description */}
      {project.shortDescription && (
        <motion.section
          className={`container ${styles.caseStudy}`}
          aria-label="About this project"
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.shortDesc}>{project.shortDescription}</p>
        </motion.section>
      )}

      {/* Full case study */}
      {body.length > 0 && (
        <motion.section
          className={`container ${styles.bodySection}`}
          aria-label="Case study"
          variants={fadeUp}
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.body}>
            <PortableText value={body} components={portableTextComponents} />
          </div>
        </motion.section>
      )}

      {/* Next/Prev navigation */}
      {prev && next && (
        <nav className={`container ${styles.projectNav}`} aria-label="Navigate between projects">
          <GlowCard>
            <Link to={`/works/${prev.slug}`} className={styles.navCard}>
              <span className={`label ${styles.navDir}`}>← Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          </GlowCard>
          <GlowCard>
            <Link to={`/works/${next.slug}`} className={styles.navCard}>
              <span className={`label ${styles.navDir}`}>Next →</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          </GlowCard>
        </nav>
      )}

      <div className={`container ${styles.bottomPad}`} />
    </>
  );
}
