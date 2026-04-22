import type { JSX, ReactNode } from 'react';

import styles from './FormField.module.css';

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

/**
 * Wraps a form control with a label above and an optional error message below.
 * Intended for use in admin forms with dark theme styling.
 */
export const FormField = ({ label, error, children }: FormFieldProps): JSX.Element => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
};
