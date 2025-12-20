'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faChevronLeft,
  faChevronRight
} from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import styles from './PhotoLightbox.module.css';

type PhotoLightboxProps = {
  photo: string;
  photos: string[];
  onClose: () => void;
};

export function PhotoLightbox({ photo, photos, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(
    photos.findIndex(p => p === photo)
  );
  const [mounted, setMounted] = useState(false);

  const currentPhoto = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [hasPrev]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [hasNext]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, handlePrev, handleNext]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const lightboxContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close photo viewer"
      >
        <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} />
      </button>

      <div className={styles.lightboxContent}>
        <div className={styles.imageContainer}>
          <Image
            src={currentPhoto}
            alt="Event photo"
            width={1200}
            height={800}
            className={styles.image}
            priority
          />
        </div>
      </div>

      {/* Navigation buttons */}
      {photos.length > 1 && (
        <>
          {hasPrev && (
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          {hasNext && (
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Next photo"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </>
      )}

      {/* Photo counter */}
      {photos.length > 1 && (
        <div className={styles.counter}>
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );

  if (!mounted) return null;

  return createPortal(lightboxContent, document.body);
}
