'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faChevronRight } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import { Button } from './Button';
import { EventModal } from './EventModal';
import type { Event } from '@/utils/event.types';
import { getAvatarUrl } from '@/utils/cloudinary-client';
import styles from './EventCard.module.css';
import { formatInTimeZone } from 'date-fns-tz';
import type { JSX } from 'react';

interface EventCardProps {
  event: Event;
}

type BackgroundImageStyle = React.CSSProperties & { '--background-image': string };

export function EventCard({ event }: EventCardProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const backgroundImage = event.imageUrl || 'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg';
  const formattedDate = formatInTimeZone(
    new Date(event.date),
    'America/Chicago',
    'EEE, MMM d, yyyy, h:mm a'
  );

  const backgroundImageStyle: BackgroundImageStyle = {
    '--background-image': `url('${backgroundImage}')`
  };

  const hasMoreInfo = (event.photos?.length ?? 0) > 0 || !!event.videoUrl;
  const displaySpeakers = event.speakers?.slice(0, 3) ?? [];
  const additionalSpeakersCount = Math.max(0, (event.speakers?.length ?? 0) - 3);

  return (
    <>
    <article className={styles.eventCard} aria-labelledby={`event-title-${event.id}`}>
      <div
        className={styles.eventImageContainer}
        style={backgroundImageStyle}
        role="img"
        aria-label={event.imageCredit || 'Event background image'}
      >
        <header className={styles.contentWrapper}>
          <div className={styles.eventContent}>
            <time className={styles.eventDate} dateTime={event.date}>
              {formattedDate}
            </time>
            <h3 id={`event-title-${event.id}`} className={styles.eventTitle}>
              {event.title}
            </h3>
          </div>
          <div className={styles.buttonSection}>
            {hasMoreInfo && (
              <Button
                variant="outline"
                className={styles.moreInfoButton}
                onClick={() => setShowModal(true)}
                aria-label={`View more information about ${event.title}`}
              >
                MORE INFO
                <FontAwesomeIcon icon={faChevronRight} className={styles.chevronIcon} aria-hidden="true" />
              </Button>
            )}
            {displaySpeakers.length > 0 && (
              <div className={styles.speakerAvatars} aria-label="Event speakers">
                {displaySpeakers.map((speaker, index) => (
                  <Image
                    key={speaker.id}
                    src={getAvatarUrl(speaker.imageUrl || '/placeholder.svg', 48)}
                    alt={`${speaker.name}, Speaker`}
                    width={48}
                    height={48}
                    className={styles.speakerAvatar}
                    style={{ zIndex: displaySpeakers.length - index }}
                    title={speaker.name}
                  />
                ))}
                {additionalSpeakersCount > 0 && (
                  <div
                    className={styles.additionalSpeakers}
                    aria-label={`${additionalSpeakersCount} more speaker${additionalSpeakersCount > 1 ? 's' : ''}`}
                  >
                    +{additionalSpeakersCount}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
      </div>
    </article>

      {showModal && (
        <EventModal
          event={event}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
