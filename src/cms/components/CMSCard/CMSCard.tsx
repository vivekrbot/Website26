import styles from './CMSCard.module.css';

interface CMSCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  savedAt?: Date | null;
}

export function CMSCard({ title, description, actions, children, savedAt }: CMSCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.headerActions}>
          {savedAt && (
            <span className={styles.saved} aria-live="polite">
              Saved · {formatTime(savedAt)}
            </span>
          )}
          {actions}
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

function formatTime(date: Date): string {
  const diff = Math.round((Date.now() - date.getTime()) / 1000);
  if (diff < 5)  return 'just now';
  if (diff < 60) return `${diff}s ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
