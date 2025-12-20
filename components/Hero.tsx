import type { JSX } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import { RSVPForm } from '@/components/RSVPForm';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import styles from './Hero.module.css';
import type { Event } from '@/utils/event.types';
import { format, addMonths, parseISO, isAfter } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type HeroProps = {
  nextEvent: Event | null;
  hasPastEvents: boolean;
  lastEvent: Event | null;
};

type BackgroundImageStyle = React.CSSProperties & { '--background-image': string };

const determineDisplayMonth = (lastEvent: Event | null) => {
  const now = new Date();
  if (!lastEvent) {
    return now;
  }

  const monthAfterLastEvent = addMonths(parseISO(lastEvent.date), 1);
  return isAfter(now, monthAfterLastEvent) ? now : monthAfterLastEvent;
};

export const Hero = ({ nextEvent, hasPastEvents, lastEvent }: HeroProps): JSX.Element => {
  // If no upcoming event, show default background with message
  if (!nextEvent) {
    const backgroundImageStyle: BackgroundImageStyle = {
      '--background-image': `url('https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg')`
    };

    const displayMonth = determineDisplayMonth(lastEvent);
    const formattedMonth = format(displayMonth, 'MMMM yyyy');

    return (
      <section
        className={styles.hero}
        aria-label="Hero background image"
        style={backgroundImageStyle}
      >
        <header className={styles.heroContent}>
          <time className={styles.eventDate}>{formattedMonth}</time>
          <h1 className={styles.heroTitle}>Stay Tuned for Our Next Event</h1>

          <div className={styles.noEventMessage}>
            <p>Our next event hasn't been scheduled yet, but check back soon for updates!</p>
          </div>
        </header>

        <ScrollIndicator hasPastEvents={hasPastEvents} />
      </section>
    );
  }

  const formattedDate = formatInTimeZone(
    new Date(nextEvent.date),
    'America/Chicago',
    'EEE, MMM d, yyyy, h:mm a'
  );
  const backgroundImage = nextEvent.imageUrl || 'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg';

  const backgroundImageStyle: BackgroundImageStyle = {
    '--background-image': `url('${backgroundImage}')`
  };

  return (
    <section
      className={styles.hero}
      aria-label={nextEvent.imageCredit || 'Hero background image'}
      style={backgroundImageStyle}
    >
      <header className={styles.heroContent}>
        <time className={styles.eventDate} dateTime={nextEvent.date}>
          {formattedDate}
        </time>
        <h1 className={styles.heroTitle}>{nextEvent.title}</h1>

        <dl className={styles.eventDetails}>
          {(nextEvent.speakers?.length ?? 0) > 0 && (
            <div className={styles.speakerInfo}>
              <dt className="sr-only">Speaker{(nextEvent.speakers?.length ?? 0) > 1 ? 's' : ''}</dt>
              <dd className={styles.speakersList}>
                {nextEvent.speakers?.map((speaker) => (
                  <div key={speaker.id} className={styles.speakerItem}>
                    <Image
                      src={speaker.imageUrl || '/placeholder.svg?height=60&width=60'}
                      alt={`${speaker.name}, Speaker`}
                      width={72}
                      height={72}
                      className={styles.speakerAvatar}
                    />
                    <div className={styles.speakerDetails}>
                      <div className={styles.speakerName}>{speaker.name}</div>
                      <div className={styles.speakerTitle}>{speaker.speakerTitle}</div>
                    </div>
                  </div>
                ))}
              </dd>
            </div>
          )}

          <div className={styles.locationInfo}>
            <dt className="sr-only">Location</dt>
            <dd>
              <FontAwesomeIcon
                icon={faLocationDot}
                className={styles.locationIcon}
                aria-hidden="true"
              />
              <address className={styles.venueAddress}>
                <div className={styles.venueName}>{nextEvent.venue.name}</div>
                <div>{nextEvent.venue.address}</div>
              </address>
            </dd>
          </div>
        </dl>

        <div className={styles.heroActions}>
          <RSVPForm event={nextEvent} />
          {nextEvent.sponsoredBy &&
            nextEvent.sponsoredBy.length > 0 &&
            nextEvent.sponsoredByLogos && (
              <aside className={styles.sponsorInfo} aria-label="Event sponsors">
                <span>Sponsored By:</span>
                {nextEvent.sponsoredByLogos.map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`${nextEvent.sponsoredBy![index]} logo`}
                    className={styles.sponsorLogo}
                  />
                ))}
              </aside>
            )}
        </div>
      </header>

      <ScrollIndicator hasPastEvents={hasPastEvents} />
    </section>
  );
};
