import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { SpaceCanvas } from '../canvas/SpaceCanvas';
import { SkipLink } from '../components/SkipLink/SkipLink';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { PageTransition } from '../components/PageTransition/PageTransition';
import { useLenis } from '../hooks/useLenis';
import styles from './Layout.module.css';

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useLenis();

  // Move focus to main on route change (a11y)
  useEffect(() => {
    mainRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className={styles.root} id="top">
      <SkipLink />
      <CustomCursor />
      <SpaceCanvas />
      <Nav />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className={styles.main}
        aria-label="Main content"
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
