import { Navigate, Outlet, Link } from 'react-router-dom';
import styles from './CMSLayout.module.css';

export default function CMSLayout() {
  // Belt-and-suspenders: should never reach here in prod due to router tree-shaking
  if (!import.meta.env.DEV) return <Navigate to="/" replace />;

  return (
    <div className={styles.root}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.badge}>CMS</span>
          <span className={styles.title}>Content Editor</span>
          <span className={styles.hint}>Changes save instantly to localStorage · reload portfolio to see updates</span>
        </div>
        <Link to="/" className={styles.backLink}>
          ← Back to site
        </Link>
      </header>

      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
}
