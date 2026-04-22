import type { JSX } from 'react';

import { AdminTable } from '@/components/admin/AdminTable';
import type { AdminRsvp } from '@/utils/event.types';

import styles from './RsvpTable.module.css';

type RsvpTableProps = {
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

const buildColumns = () => [
  {
    key: 'attendee',
    label: 'Attendee',
    render: (rsvp: AdminRsvp) => resolveAttendeeName(rsvp),
  },
  {
    key: 'source',
    label: 'Source',
    render: (rsvp: AdminRsvp) => (
      <span className={`${styles.badge} ${styles[rsvp.source]}`}>
        {SOURCE_LABELS[rsvp.source]}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Registered',
    render: (rsvp: AdminRsvp) => formatRegisteredDate(rsvp.createdAt),
  },
];

/**
 * Renders the list of RSVPs for an event using the shared AdminTable component.
 * Displays attendee name (email for website, display name for discord), source badge, and registration date.
 */
export const RsvpTable = ({ rsvps }: RsvpTableProps): JSX.Element => {
  const columns = buildColumns();
  return <AdminTable columns={columns} rows={rsvps} keyField="id" />;
};
