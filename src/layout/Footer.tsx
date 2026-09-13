import { Link } from 'react-router-dom';
import { socialLinks } from '../data/navigation';
import { StampSeal } from '../components/StampSeal/StampSeal';
import { safeHref } from '../utils/safeHref';
import { SOCIAL_ICONS } from '../lib/socialIcons';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logoLink} aria-label="Vivek Ramachandran — Home">
              <StampSeal size={80} animate={false} opacity={0.7} className={styles.footerSeal} />
            </Link>
            <div>
              <p className={styles.name}>Vivek Ramachandran</p>
              <p className={styles.tagline}>Product Design &amp; Strategy</p>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <ul className={styles.footerLinks} role="list">
              <li><Link to="/works" className={styles.footerLink}>Work</Link></li>
              <li><Link to="/about" className={styles.footerLink}>About</Link></li>
              <li><Link to="/mentorship" className={styles.footerLink}>Mentorship</Link></li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {year} BotStudio | ItsVivek. All rights reserved.
          </p>

          <ul className={styles.social} role="list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={safeHref(link.href)}
                  className={styles.socialLink}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SOCIAL_ICONS[link.icon]}
                </a>
              </li>
            ))}
          </ul>

          <a href="#top" className={styles.backToTop} aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span>Top</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
