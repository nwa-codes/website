import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { EventCard } from '@/components/EventCard';
import { ContactFormWrapper } from '@/components/ContactFormWrapper';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { getEventsData } from '@/app/actions/events';
import styles from './page.module.css';
import type { JSX } from 'react';

export default async function Component(): Promise<JSX.Element> {
  const { nextEvent, pastEvents, showLoadMore, hasPastEvents, lastEvent } = await getEventsData();

  return (
    <div className={styles.container}>
      <Header />
      <Hero nextEvent={nextEvent} hasPastEvents={hasPastEvents} lastEvent={lastEvent} />

      <main id="main-content" className={styles.main}>
        {hasPastEvents && (
          <section className={styles.pastEvents} data-section="past-events">
            <h2 className={styles.sectionTitle}>Past Events</h2>

            <div className={styles.eventsGrid}>
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {showLoadMore && (
              <div className={styles.loadMoreContainer}>
                <Button variant="outline" className={styles.loadMoreButton}>
                  LOAD MORE
                </Button>
              </div>
            )}
          </section>
        )}

        <section className={styles.partnership}>
          <h2 className={styles.partnershipTitle}>In Proud Partnership With</h2>
          <ul className={styles.partners}>
            <li className={styles.partnerLogo}>
              <Image src="/sponsors/sleepy-fox-logo.svg" alt="Sleepy Fox" width={160} height={80} />
            </li>
            <li className={styles.partnerLogo}>
              <Image src="/sponsors/akra-logo.svg" alt="Akra" width={160} height={80} />
            </li>
          </ul>
        </section>

        <ContactFormWrapper />
      </main>

      <Footer />
    </div>
  );
}
