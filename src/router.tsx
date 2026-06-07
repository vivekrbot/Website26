import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';

const Home       = lazy(() => import('./pages/Home/Home'));
const About      = lazy(() => import('./pages/About/About'));
const Works      = lazy(() => import('./pages/Works/Works'));
const WorkDetail = lazy(() => import('./pages/WorkDetail/WorkDetail'));
const Mentorship = lazy(() => import('./pages/Mentorship/Mentorship'));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
      }}
      aria-label="Loading page"
    >
      Loading…
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true,              element: withSuspense(Home) },
        { path: 'about',            element: withSuspense(About) },
        { path: 'works',            element: withSuspense(Works) },
        { path: 'works/:slug',      element: withSuspense(WorkDetail) },
        { path: 'mentorship',       element: withSuspense(Mentorship) },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
