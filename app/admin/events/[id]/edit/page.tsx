import type { JSX } from 'react';

import { formatInTimeZone } from 'date-fns-tz';

import { getAdminEvent, getAdminEvents, getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';

import { EventForm } from '../../EventForm';
import { CancelEventButton } from './CancelEventButton';
import styles from './page.module.css';

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

const EditEventPage = async ({ params }: EditEventPageProps): Promise<JSX.Element> => {
  const { id } = await params;

  const [event, speakers, sponsors, allEvents] = await Promise.all([
    getAdminEvent(id),
    getAdminSpeakers(),
    getAdminSponsors(),
    getAdminEvents(),
  ]);

  const previousImages = [...new Set(allEvents.map((e) => e.imageUrl).filter((url): url is string => !!url))];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Edit Event</h1>
          <p className={styles.eventId}>ID: {id}</p>
        </div>
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
        previousImages={previousImages}
      />
    </div>
  );
};

export default EditEventPage;
