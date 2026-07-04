import Shuffle from '../Shuffle/Shuffle';
import SplitText from '../SplitText/SplitText';
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
      <h2 className={`${titleClass} ${styles.title}`}>
        <Shuffle
          tag="span"
          text={title}
          textAlign={align === 'center' ? 'center' : 'left'}
          shuffleDirection="right"
          duration={0.4}
          stagger={0.022}
          threshold={0.1}
          rootMargin="0px"
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
        />
      </h2>
      {subtitle && (
        <SplitText
          tag="p"
          text={subtitle}
          className={styles.subtitle}
          splitType="words"
          from={{ opacity: 0, y: 18 }}
          to={{ opacity: 1, y: 0 }}
          duration={0.55}
          delay={25}
          ease="power2.out"
          threshold={0.1}
          rootMargin="0px"
          textAlign={align === 'center' ? 'center' : 'left'}
        />
      )}
    </header>
  );
}
