import type { JSX } from 'react';

import { getAdminEvent, getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';
import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';

import { EventForm } from '../../EventForm';
import { updateEventAction, softDeleteEventAction } from '../../actions';
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
        <SoftDeleteButton
          label="Cancel Event"
          confirmMessage="This will cancel the event. It will be marked as cancelled and hidden from the public site."
          onConfirm={() => softDeleteEventAction(event.id)}
          pendingLabel="Cancelling..."
          itemName={event.title}
          confirmTitle="Cancel Event"
          tooltipLabel="Cancel Event"
        />
      </div>
      <EventForm
        speakers={speakers}
        sponsors={sponsors}
        defaultValues={{
          title: event.title,
          description: event.description ?? '',
          eventStartTime: event.eventStartTime.slice(0, 16),
          eventEndTime: event.eventEndTime ? event.eventEndTime.slice(0, 16) : '',
          venueName: event.venueName ?? '',
          venueAddress: event.venueAddress ?? '',
          status: event.status,
          eventType: event.eventType ?? '',
          tags: event.tags.join(', '),
          maxAttendees: event.maxAttendees ?? undefined,
          imageUrl: event.imageUrl ?? '',
          videoUrl: event.videoUrl ?? '',
          speakers: event.speakers,
          sponsors: event.sponsors,
        }}
        onSubmit={(data) => updateEventAction(event.id, data)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditEventPage;
