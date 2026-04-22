import type { JSX } from 'react';

import { getAdminSpeaker } from '@/utils/admin-api';
import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';

import { SpeakerForm } from '../../SpeakerForm';
import { updateSpeakerAction, deactivateSpeakerAction } from '../../actions';
import styles from './page.module.css';

type EditSpeakerPageProps = {
  params: Promise<{ id: string }>;
};

const EditSpeakerPage = async ({ params }: EditSpeakerPageProps): Promise<JSX.Element> => {
  const { id } = await params;
  const speaker = await getAdminSpeaker(id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Edit Speaker</h1>
        <SoftDeleteButton
          label="Deactivate"
          confirmMessage="This will deactivate the speaker. They will no longer appear as an option for new event assignments but historical data is preserved."
          onConfirm={() => deactivateSpeakerAction(speaker.id)}
          pendingLabel="Deactivating..."
          itemName={speaker.name}
          confirmTitle="Deactivate Speaker"
          tooltipLabel="Deactivate"
        />
      </div>
      <SpeakerForm
        defaultValues={{
          name: speaker.name,
          speakerTitle: speaker.speakerTitle,
          bio: speaker.bio ?? '',
          imageUrl: speaker.imageUrl ?? '',
          socialLinks: {
            twitter: speaker.socialLinks?.twitter ?? '',
            linkedin: speaker.socialLinks?.linkedin ?? '',
            github: speaker.socialLinks?.github ?? '',
            website: speaker.socialLinks?.website ?? '',
          },
        }}
        onSubmit={(data) => updateSpeakerAction(speaker.id, data)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditSpeakerPage;
