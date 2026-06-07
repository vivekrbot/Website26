import { useState } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { ExportModal } from '../components/ExportModal/ExportModal';
import styles from './CMSLayout.module.css';

export default function CMSLayout() {
  if (!import.meta.env.DEV) return <Navigate to="/" replace />;

  return <CMSLayoutInner />;
}

function CMSLayoutInner() {
  const [showExport, setShowExport] = useState(false);

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.badge}>CMS</span>
          <span className={styles.title}>Content Editor</span>
          <span className={styles.hint}>Changes save instantly to localStorage · reload portfolio to see updates</span>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.exportBtn} onClick={() => setShowExport(true)} type="button">
            Export to code ↗
          </button>
          <Link to="/" className={styles.backLink}>
            ← Back to site
          </Link>
        </div>
      </header>

      <div className={styles.body}>
        <Outlet />
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
