import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  titleClass?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'left',
  titleClass = 'heading-2',
}: SectionHeaderProps) {
  return (
    <header className={`${styles.header} ${styles[align]}`}>
      {label && <p className={`label ${styles.label}`}>{label}</p>}
      <h2 className={`${titleClass} ${styles.title}`}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
