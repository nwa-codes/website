import type { JSX } from 'react';

import { SpeakerForm } from '../SpeakerForm';
import { createSpeakerAction } from '../actions';
import styles from './page.module.css';

const NewSpeakerPage = async (): Promise<JSX.Element> => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>New Speaker</h1>
      <SpeakerForm onSubmit={createSpeakerAction} submitLabel="Create Speaker" />
    </div>
  );
};

export default NewSpeakerPage;
