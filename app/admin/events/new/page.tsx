import type { JSX } from 'react';

import { getAdminEvents, getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';

import { EventForm } from '../EventForm';
import styles from './page.module.css';

const NewEventPage = async (): Promise<JSX.Element> => {
  const [events, speakers, sponsors] = await Promise.all([
    getAdminEvents(),
    getAdminSpeakers(),
    getAdminSponsors(),
  ]);

  const previousImages = [...new Set(events.map((e) => e.imageUrl).filter((url): url is string => !!url))];

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>New Event</h1>
      <EventForm speakers={speakers} sponsors={sponsors} submitLabel="Create Event" previousImages={previousImages} />
    </div>
  );
};

export default NewEventPage;
