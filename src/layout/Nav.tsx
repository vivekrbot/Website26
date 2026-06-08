import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { navItems } from '../data/navigation';
import styles from './Nav.module.css';

export function Nav() {
  const { isDark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Trap scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <nav className={`${styles.nav} container`} aria-label="Main navigation">
        <Link to="/" className={styles.logo} aria-label="Vivek Ramachandran — Home">
          <span className={styles.logoName}>ItsVivek.</span>
        </Link>

        {/* Desktop nav */}
        <ul className={styles.links} role="list">
          {navItems.map((item) =>
            item.isExternal ? (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle isDark={isDark} onToggle={toggle} />
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className={styles.mobileLinks} role="list">
              {navItems.map((item) =>
                item.isExternal ? (
                  <li key={item.label}>
                    <a href={item.href} className={styles.mobileLink} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `${styles.mobileLink} ${isActive ? styles.active : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
