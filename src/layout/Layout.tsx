import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { SpaceCanvas } from '../canvas/SpaceCanvas';
import LightRays from '../components/LightRays/LightRays';
import { SkipLink } from '../components/SkipLink/SkipLink';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { PageTransition } from '../components/PageTransition/PageTransition';
import { PageLoader } from '../components/PageLoader/PageLoader';
import { useLenis } from '../hooks/useLenis';
import styles from './Layout.module.css';

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [loaderDone, setLoaderDone] = useState(false);

  useLenis();

  // Move focus to main on route change (a11y)
  useEffect(() => {
    mainRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className={styles.root} id="top">
      {!loaderDone && <PageLoader onDone={() => setLoaderDone(true)} />}
      <SkipLink />
      <CustomCursor />
      <SpaceCanvas />
      <div className={styles.lightRays} aria-hidden="true">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.6}
          lightSpread={0.7}
          rayLength={1.8}
          fadeDistance={1.2}
          saturation={0.0}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.04}
          distortion={0.02}
        />
      </div>
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
