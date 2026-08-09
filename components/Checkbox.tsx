import type { InputHTMLAttributes, Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  ref?: Ref<HTMLInputElement>;
};

export const Checkbox = ({ className = '', ref, ...props }: CheckboxProps) => {
  return (
    <input ref={ref} type="checkbox" className={`${styles.checkbox} ${className}`} {...props} />
  );
};
