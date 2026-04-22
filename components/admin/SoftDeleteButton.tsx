'use client';

import { useState, useTransition } from 'react';
import type { JSX } from 'react';

import styles from './SoftDeleteButton.module.css';

type SoftDeleteButtonProps = {
  label: string;
  confirmMessage: string;
  onConfirm: () => Promise<void>;
};

/**
 * Danger button that requires window.confirm before invoking onConfirm.
 * Shows a disabled loading state during the async operation and an inline
 * error message if onConfirm throws.
 */
export const SoftDeleteButton = ({
  label,
  confirmMessage,
  onConfirm,
}: SoftDeleteButtonProps): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await onConfirm();
      } catch {
        setError('Something went wrong. Please try again.');
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? 'Deleting...' : label}
      </button>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
};
