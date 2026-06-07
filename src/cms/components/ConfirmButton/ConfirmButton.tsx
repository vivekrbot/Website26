import { useEffect, useRef, useState } from 'react';
import styles from './ConfirmButton.module.css';

interface ConfirmButtonProps {
  onConfirm: () => void;
  label: string;
  confirmLabel?: string;
  className?: string;
}

export function ConfirmButton({
  onConfirm,
  label,
  confirmLabel = 'Are you sure?',
  className = '',
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = () => {
    if (armed) {
      onConfirm();
      setArmed(false);
    } else {
      setArmed(true);
      timerRef.current = setTimeout(() => setArmed(false), 3000);
    }
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.btn} ${armed ? styles.armed : ''} ${className}`}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
