import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  as?: 'button';
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
  as: 'link';
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonAsAnchor extends ButtonBaseProps {
  as: 'a';
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  type?: never;
  disabled?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...rest },
  ref
) {
  const cls = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ');

  if (rest.as === 'link') {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} to={rest.href} className={cls}>
        {children}
      </Link>
    );
  }

  if (rest.as === 'a') {
    const { as: _as, href, onClick, ...anchorRest } = rest;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  const { as: _as, onClick, type = 'button', disabled, ...btnRest } = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cls}
      {...btnRest}
    >
      {children}
    </button>
  );
});
