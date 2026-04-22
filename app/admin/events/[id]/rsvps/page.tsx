import type { JSX } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import { getAdminEvent, getEventRsvps } from '@/utils/admin-api';

import { RsvpList } from './RsvpList';
import styles from './page.module.css';

type RsvpsPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * RSC page showing all RSVPs for a given event.
 * Parallel-fetches event metadata and RSVPs, then renders the RsvpTable.
 */
const RsvpsPage = async ({ params }: RsvpsPageProps): Promise<JSX.Element> => {
  const { id } = await params;

  const [event, { rsvps, total }] = await Promise.all([
    getAdminEvent(id),
    getEventRsvps(id),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/events" className={styles.backLink}>
            <FontAwesomeIcon icon={faChevronLeft} />
            Back to events
          </Link>
          <h1 className={styles.heading}>{event.title}</h1>
          <p className={styles.subheading}>{total} RSVP{total !== 1 ? 's' : ''}</p>
        </div>
        <Link href={`/admin/events/${id}/edit`} className={styles.editLink}>
          Edit event
        </Link>
      </div>
      <RsvpList rsvps={rsvps} />
    </div>
  );
};

export default RsvpsPage;
