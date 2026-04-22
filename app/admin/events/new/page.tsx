import type { JSX } from 'react';

import { getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';

import { EventForm } from '../EventForm';
import styles from './page.module.css';

const NewEventPage = async (): Promise<JSX.Element> => {
  const [speakers, sponsors] = await Promise.all([getAdminSpeakers(), getAdminSponsors()]);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>New Event</h1>
      <EventForm speakers={speakers} sponsors={sponsors} submitLabel="Create Event" />
    </div>
  );
};

export default NewEventPage;
