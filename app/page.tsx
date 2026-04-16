import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { EventCard } from '@/components/EventCard';
import { ContactFormWrapper } from '@/components/ContactFormWrapper';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { getEventsData } from '@/app/actions/events';
import { getSponsors, resolvePartnerLogoPath } from '@/utils/atlas-api';
import styles from './page.module.css';
import type { JSX } from 'react';

export default async function Component(): Promise<JSX.Element> {
  const [{ nextEvent, pastEvents, showLoadMore, hasPastEvents, lastEvent }, sponsors] =
    await Promise.all([getEventsData(), getSponsors()]);

  const partnersWithLogos = sponsors
    .map((sponsor) => ({
      name: sponsor.name,
      logoPath: resolvePartnerLogoPath(sponsor),
      websiteUrl: sponsor.websiteUrl,
    }))
    .filter((partner): partner is { name: string; logoPath: string; websiteUrl: string | null | undefined } =>
      partner.logoPath !== null
    );

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

        {partnersWithLogos.length > 0 ? (
          <section className={styles.partnership}>
            <h2 className={styles.partnershipTitle}>In Proud Partnership With</h2>
            <ul className={styles.partners}>
              {partnersWithLogos.map((partner) => (
                <li key={partner.name} className={styles.partnerLogo}>
                  <Image src={partner.logoPath} alt={partner.name} width={160} height={80} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ContactFormWrapper />
      </main>

      <Footer />
    </div>
  );
}
