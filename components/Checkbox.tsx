import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export const Checkbox = ({ className = '', children, ref, ...props }: CheckboxProps) => {
  return (
    <input ref={ref} type="checkbox" className={`${styles.checkbox} ${className}`} {...props} />
  );
};
