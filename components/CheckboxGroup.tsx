import type { JSX } from 'react';
import { Checkbox } from './Checkbox';
import styles from './CheckboxGroup.module.css';

interface CheckboxOption {
  id: string;
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: CheckboxOption[];
  errors?: string[];
  disabled?: boolean;
}

export const CheckboxGroup = ({
  label,
  name,
  options,
  errors,
  disabled = false
}: CheckboxGroupProps): JSX.Element => {
  const hasErrors = errors && errors.length > 0;
  const errorId = `${name}-error`;

  return (
    <fieldset className={styles.checkboxGroup} aria-describedby={hasErrors ? errorId : undefined}>
      <legend className={styles.formLabel}>{label}</legend>
      <div className={styles.checkboxes}>
        {options.map((option) => (
          <div key={option.id} className={styles.checkboxItem}>
            <Checkbox id={option.id} name={name} value={option.value} disabled={disabled} />
            <label htmlFor={option.id} className={styles.checkboxLabel}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {hasErrors && (
        <div id={errorId} className={styles.fieldError}>
          {errors.join(', ')}
        </div>
      )}
    </fieldset>
  );
};
