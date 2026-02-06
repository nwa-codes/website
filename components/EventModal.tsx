'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faLocationDot, faPlay } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import { Button } from '@/components/Button';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import type { Event } from '@/utils/event.types';
import { getAvatarUrl } from '@/utils/cloudinary-client';
import { formatInTimeZone } from 'date-fns-tz';
import styles from './EventModal.module.css';

type EventModalProps = {
  event: Event;
  onClose: () => void;
};

export function EventModal({ event, onClose }: EventModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const formattedDate = formatInTimeZone(
    new Date(event.date),
    'America/Chicago',
    'EEE, MMM d, yyyy, h:mm a'
  );

  const backgroundImage = event.imageUrl || 'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const modalContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className={styles.overlayContent}>
        <header
          className={styles.overlayHeader}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
          <div className={styles.titleSection}>
            <h3 id="event-modal-title" className={styles.eventTitle}>
              {event.title}
            </h3>
            <time className={styles.eventDate} dateTime={event.date}>
              {formattedDate}
            </time>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close event details"
          >
            <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} />
          </button>
        </header>

        <div className={styles.eventInfo}>
          {/* Speakers section */}
          {(event.speakers?.length ?? 0) > 0 && (
            <section className={styles.speakersSection}>
              <h4 className={styles.sectionTitle}>
                Speaker{(event.speakers?.length ?? 0) > 1 ? 's' : ''}
              </h4>
              <div className={styles.speakersList}>
                {event.speakers?.map((speaker) => (
                  <div key={speaker.id} className={styles.speakerItem}>
                    <Image
                      src={getAvatarUrl(speaker.imageUrl || '/placeholder.svg', 60)}
                      alt={speaker.name}
                      width={60}
                      height={60}
                      className={styles.speakerAvatar}
                    />
                    <div className={styles.speakerDetails}>
                      <div className={styles.speakerName}>{speaker.name}</div>
                      <div className={styles.speakerTitle}>{speaker.speakerTitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Venue section */}
          <section className={styles.venueSection}>
            <h4 className={styles.sectionTitle}>Location</h4>
            <div className={styles.venueInfo}>
              <FontAwesomeIcon icon={faLocationDot} className={styles.locationIcon} />
              <address className={styles.venueAddress}>
                <div className={styles.venueName}>{event.venue.name}</div>
                <div>{event.venue.address}</div>
              </address>
            </div>
          </section>

          {/* Video button */}
          {event.videoUrl && (
            <section className={styles.videoSection}>
              <a
                href={event.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.videoLink}
              >
                <Button variant="outline" className={styles.videoButton}>
                  WATCH
                  <FontAwesomeIcon icon={faPlay} className={styles.playIcon} />
                </Button>
              </a>
            </section>
          )}

          {/* Photo gallery */}
          {(event.photos?.length ?? 0) > 0 && (
            <section className={styles.photosSection}>
              <h4 className={styles.sectionTitle}>Photos</h4>
              <div className={styles.photoGrid}>
                {event.photos?.map((photoUrl, index) => (
                  <button
                    key={index}
                    className={styles.photoThumbnail}
                    onClick={() => setSelectedPhoto(photoUrl)}
                    aria-label="View photo"
                  >
                    <Image
                      src={photoUrl}
                      alt="Event photo"
                      width={300}
                      height={200}
                      className={styles.photoImage}
                    />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <>
      {createPortal(modalContent, document.body)}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          photos={event.photos}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
