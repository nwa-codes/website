import type { JSX } from 'react';

import { SponsorForm } from '../SponsorForm';
import { createSponsorAction } from '../actions';
import styles from './page.module.css';

const NewSponsorPage = async (): Promise<JSX.Element> => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>New Sponsor</h1>
      <SponsorForm onSubmit={createSponsorAction} submitLabel="Create Sponsor" />
    </div>
  );
};

export default NewSponsorPage;
