import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'default' | 'outline';
  color?: 'primary' | 'secondary';
  ref?: Ref<HTMLButtonElement>;
};

export const Button = ({
  children,
  className,
  variant = 'default',
  color = 'primary',
  ref,
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={ref}
      className={clsx(styles.button, styles[variant], styles[color], className)}
      {...props}
    >
      {children}
    </button>
  );
};
