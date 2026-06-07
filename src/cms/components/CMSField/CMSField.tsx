import styles from './CMSField.module.css';

interface CMSFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function CMSField({ label, hint, required, children }: CMSFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
      {hint && <p className={styles.hint}>{hint}</p>}
      {children}
    </div>
  );
}
