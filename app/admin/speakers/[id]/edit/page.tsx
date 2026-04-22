import type { JSX } from 'react';

import { getAdminSpeaker } from '@/utils/admin-api';

import { SpeakerForm } from '../../SpeakerForm';
import { DeactivateSpeakerButton } from './DeactivateSpeakerButton';
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
        <DeactivateSpeakerButton speakerId={speaker.id} speakerName={speaker.name} />
      </div>
      <SpeakerForm
        speakerId={speaker.id}
        defaultValues={{
          name: speaker.name,
          speakerTitle: speaker.speakerTitle,
          imageUrl: speaker.imageUrl ?? '',
        }}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditSpeakerPage;
