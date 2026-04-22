import type { JSX } from 'react';
import Link from 'next/link';

import { AdminTable } from '@/components/admin/AdminTable';
import { getAdminEvents } from '@/utils/admin-api';
import type { AdminEvent } from '@/utils/event.types';

import { EventActions } from './EventActions';
import styles from './page.module.css';

const EVENT_STATUS_COLORS: Record<AdminEvent['status'], string> = {
  draft: '#a0a0a0',
  published: '#4caf50',
  completed: '#2196f3',
  cancelled: '#e05a5a',
};

const buildColumns = () => [
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'eventStartTime',
    label: 'Date',
    render: (row: AdminEvent) => new Date(row.eventStartTime).toLocaleDateString(),
  },
  {
    key: 'venueName',
    label: 'Venue',
    render: (row: AdminEvent) => row.venueName ?? '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: AdminEvent) => (
      <span style={{ color: EVENT_STATUS_COLORS[row.status] ?? '#a0a0a0', fontWeight: 600 }}>{row.status}</span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row: AdminEvent) => <EventActions eventId={row.id} eventTitle={row.title} />,
  },
];

const EventsPage = async (): Promise<JSX.Element> => {
  const events = await getAdminEvents();
  const columns = buildColumns();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Events</h1>
        <Link href="/admin/events/new" className={styles.createLink}>
          New Event
        </Link>
      </div>
      <AdminTable columns={columns} rows={events} keyField="id" />
    </div>
  );
};

export default EventsPage;
