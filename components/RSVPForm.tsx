'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faTriangleExclamation,
  faCircleCheck,
  faCalendarPlus
} from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { submitRSVP } from '@/app/actions/rsvp';
import { downloadICSFile } from '@/utils/calendar';
import type { Event } from '@/utils/event.types';
import styles from './RSVPForm.module.css';

type RSVPFormProps = {
  event: Event;
};

const validateEmail = (email: string) => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return '';
};

export function RSVPForm({ event }: RSVPFormProps) {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleRSVPClick = async () => {
    if (!showEmailInput) {
      setShowEmailInput(true);
      return;
    }

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError('');
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const result = await submitRSVP(event.id, email);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      setSubmitError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setShowEmailInput(false);
    setEmail('');
    setEmailError('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSubmitError('');
  }, []);

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showEmailInput) {
        handleClose();
      }
    };

    if (showEmailInput) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showEmailInput, handleClose]);

  // Handle click outside modal
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleAddToCalendar = () => {
    downloadICSFile(event);
  };

  const hasAlreadyRSVPd = submitError.includes("already RSVP'd");
  const showCalendarButton = isSubmitted || hasAlreadyRSVPd;

  const modalContent = showEmailInput && (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-title"
    >
      <div className={styles.overlayContent}>
        <header className={styles.overlayHeader}>
          <div className={styles.titleSection}>
            <h3 id="rsvp-title" className={styles.overlayTitle}>
              RSVP for:
            </h3>
            <h4 className={styles.eventTitle}>{event.title}</h4>
          </div>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close RSVP form">
            <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} />
          </button>
        </header>

        {isSubmitted && (
          <>
            <div className={styles.successMessage} role="status" aria-live="polite">
              <FontAwesomeIcon icon={faCircleCheck} />
              Thank you! Your RSVP has been received.
            </div>
            <Button
              variant="outline"
              className={styles.calendarButton}
              onClick={handleAddToCalendar}
            >
              <FontAwesomeIcon icon={faCalendarPlus} className={styles.calendarIcon} />
              ADD TO CALENDAR
            </Button>
          </>
        )}

        {!isSubmitted && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRSVPClick();
            }}
          >
            <div className={styles.inputWrapper}>
              <label htmlFor="rsvp-email" className="sr-only">
                Email address
              </label>
              <TextInput
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                errors={emailError ? [emailError] : undefined}
                autoFocus={showEmailInput}
                id="rsvp-email"
                disabled={isSubmitting || hasAlreadyRSVPd}
                required
              />
              {submitError && (
                <>
                  <div className={styles.errorMessage} role="alert">
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    {submitError}
                  </div>
                  {hasAlreadyRSVPd && (
                    <Button
                      variant="outline"
                      className={styles.calendarButton}
                      onClick={handleAddToCalendar}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faCalendarPlus} className={styles.calendarIcon} />
                      ADD TO CALENDAR
                    </Button>
                  )}
                </>
              )}
            </div>

            {!hasAlreadyRSVPd && (
              <Button
                type="submit"
                color="secondary"
                className={styles.overlaySubmitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'CONFIRM RSVP'}
              </Button>
            )}
          </form>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Button
        color="secondary"
        className={styles.rsvpButton}
        onClick={handleRSVPClick}
        disabled={isSubmitting}
      >
        RSVP NOW
      </Button>

      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
