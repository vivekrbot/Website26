import styles from './Ticker.module.css';

const ITEMS = [
  'Vivek Ramachandran',
  'Product Design & Strategy',
  '8+ Years Experience',
  'Available for Mentorship',
  'Design Systems',
  'UX Research',
  'Product Strategy',
  'AI-Assisted Design',
  'Chennai, India',
];

export function Ticker() {
  const double = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {double.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.sep}> //////// </span>
          </span>
        ))}
      </div>
    </div>
  );
}
