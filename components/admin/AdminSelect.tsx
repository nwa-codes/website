'use client';

import type { JSX } from 'react';

import styles from './AdminSelect.module.css';

type AdminSelectOption = {
  label: string;
  value: string;
};

type AdminSelectProps = {
  options: AdminSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Styled native select element for admin forms.
 * Supports an optional placeholder option rendered as the first disabled choice.
 */
export const AdminSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: AdminSelectProps): JSX.Element => {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
