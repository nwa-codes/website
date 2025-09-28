import type { JSX, InputHTMLAttributes } from 'react';
import styles from './TextInput.module.css';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  errors?: string[];
}

export const TextInput = ({ label, errors, ...inputProps }: TextInputProps): JSX.Element => {
  return (
    <div className={styles.formField}>
      {label && (
        <label className={styles.formLabel} htmlFor={inputProps.id}>
          {label}
        </label>
      )}
      <input
        className={styles.formInput}
        aria-invalid={errors && errors.length > 0 ? 'true' : 'false'}
        {...inputProps}
      />
      {errors && errors.length > 0 && <div className={styles.fieldError}>{errors.join(', ')}</div>}
    </div>
  );
};
