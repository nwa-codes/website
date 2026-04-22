'use client';

import { useId, useEffect } from 'react';
import type { JSX } from 'react';

import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  itemName: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Modal dialog that replaces window.confirm for destructive admin actions.
 * Displays the action title, item name, and a description before asking the
 * user to confirm or cancel.
 */
export const ConfirmModal = ({
  isOpen,
  title,
  itemName,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps): JSX.Element | null => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={styles.dialog}>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <p className={styles.itemName}>{itemName}</p>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
