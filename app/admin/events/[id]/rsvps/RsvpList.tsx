import type { JSX } from 'react';

import type { AdminRsvp } from '@/utils/event.types';

import styles from './RsvpList.module.css';
import { RsvpTable } from './RsvpTable';

type RsvpListProps = {
  rsvps: AdminRsvp[];
};

const SOURCE_LABELS: Record<AdminRsvp['source'], string> = {
  website: 'website',
  discord: 'discord',
};

const resolveAttendeeName = (rsvp: AdminRsvp): string => {
  if (rsvp.source === 'website') {
    return rsvp.email ?? '—';
  }
  return rsvp.discordDisplayName ?? rsvp.discordUsername ?? '—';
};

const formatRegisteredDate = (createdAt: string): string =>
  new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const MobileRsvpRow = ({ rsvp }: { rsvp: AdminRsvp }): JSX.Element => (
  <li className={styles.row}>
    <div className={styles.primary}>
      <span className={`${styles.badge} ${styles[rsvp.source]}`}>
        {SOURCE_LABELS[rsvp.source]}
      </span>
      <span className={styles.attendee}>{resolveAttendeeName(rsvp)}</span>
    </div>
    <span className={styles.date}>{formatRegisteredDate(rsvp.createdAt)}</span>
  </li>
);

/**
 * Responsive RSVP list that renders a compact mobile layout below 768px
 * and delegates to AdminTable for desktop. The two views are toggled via
 * CSS `display` so only one is ever visible.
 */
export const RsvpList = ({ rsvps }: RsvpListProps): JSX.Element => (
  <>
    <div className={styles.desktopOnly}>
      <RsvpTable rsvps={rsvps} />
    </div>
    <ul className={styles.mobileOnly}>
      {rsvps.length === 0 ? (
        <li className={styles.empty}>No RSVPs yet.</li>
      ) : (
        rsvps.map((rsvp) => <MobileRsvpRow key={rsvp.id} rsvp={rsvp} />)
      )}
    </ul>
  </>
);
