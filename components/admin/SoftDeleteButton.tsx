'use client';

import { useState, useTransition } from 'react';
import type { JSX } from 'react';
import type React from 'react';

import { ConfirmModal } from './ConfirmModal';
import styles from './SoftDeleteButton.module.css';
import tooltipStyles from './tooltip.module.css';

type SoftDeleteButtonProps = {
  label: React.ReactNode;
  confirmMessage: string;
  onConfirm: () => Promise<void>;
  pendingLabel?: string;
  buttonTitle?: string;
  itemName: string;
  confirmTitle: string;
  tooltipLabel: string;
};

/**
 * Danger button that opens a ConfirmModal before invoking onConfirm.
 * Shows a disabled loading state during the async operation and an inline
 * error message if onConfirm throws.
 */
export const SoftDeleteButton = ({
  label,
  confirmMessage,
  onConfirm,
  pendingLabel,
  buttonTitle,
  itemName,
  confirmTitle,
  tooltipLabel,
}: SoftDeleteButtonProps): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    setError(null);
    startTransition(async () => {
      try {
        await onConfirm();
      } catch {
        setError('Something went wrong. Please try again.');
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={[styles.button, tooltipStyles.tooltip].filter(Boolean).join(' ')}
        data-tooltip={tooltipLabel}
        onClick={handleClick}
        disabled={isPending}
        title={buttonTitle}
      >
        {isPending ? (pendingLabel ?? label) : label}
      </button>
      {error ? <span className={styles.error}>{error}</span> : null}
      <ConfirmModal
        isOpen={isModalOpen}
        title={confirmTitle}
        itemName={itemName}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
