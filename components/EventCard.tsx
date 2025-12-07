'use client';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import { Button } from './Button';
import type { Event } from '@/utils/event.types';
import styles from './EventCard.module.css';
import { formatInTimeZone } from 'date-fns-tz';
import type { JSX } from 'react';

interface EventCardProps {
  event: Event;
}

type BackgroundImageStyle = React.CSSProperties & { '--background-image': string };

export function EventCard({ event }: EventCardProps): JSX.Element {
  const backgroundImage = event.imageUrl || '/events/default-event-background.jpg';
  const formattedDate = formatInTimeZone(
    new Date(event.date),
    'America/Chicago',
    'EEE, MMM d, yyyy, h:mm a'
  );

  const backgroundImageStyle: BackgroundImageStyle = {
    '--background-image': `url('${backgroundImage}')`
  };

  return (
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
            {event.videoUrl && (
              <Button
                variant="outline"
                className={styles.watchButton}
                aria-label={`Watch ${event.title} video`}
              >
                WATCH
                <FontAwesomeIcon icon={faPlay} className={styles.playIcon} aria-hidden="true" />
              </Button>
            )}
            {event.speaker?.name && (
              <Image
                src={event.speaker.imageUrl || '/placeholder.svg'}
                alt={`${event.speaker.name}, Speaker`}
                width={48}
                height={48}
                className={styles.eventSpeaker}
                title={event.speaker.name}
              />
            )}
          </div>
        </header>
      </div>
    </article>
  );
}
