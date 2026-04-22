import type { JSX } from 'react';

import { formatInTimeZone } from 'date-fns-tz';

import { getAdminEvent, getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';

import { EventForm } from '../../EventForm';
import { CancelEventButton } from './CancelEventButton';
import styles from './page.module.css';

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

const EditEventPage = async ({ params }: EditEventPageProps): Promise<JSX.Element> => {
  const { id } = await params;

  const [event, speakers, sponsors] = await Promise.all([
    getAdminEvent(id),
    getAdminSpeakers(),
    getAdminSponsors(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Edit Event</h1>
        <CancelEventButton eventId={event.id} eventTitle={event.title} />
      </div>
      <EventForm
        eventId={event.id}
        speakers={speakers}
        sponsors={sponsors}
        defaultValues={{
          title: event.title,
          eventStartTime: formatInTimeZone(new Date(event.eventStartTime), 'America/Chicago', "yyyy-MM-dd'T'HH:mm"),
          venueName: event.venueName ?? '',
          venueAddress: event.venueAddress ?? '',
          status: event.status,
          imageUrl: event.imageUrl ?? '',
          videoUrl: event.videoUrl ?? '',
          speakers: event.speakers,
          sponsors: event.sponsors,
        }}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditEventPage;
