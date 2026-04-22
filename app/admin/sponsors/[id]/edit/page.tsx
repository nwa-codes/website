import type { JSX } from 'react';

import { getAdminSponsor } from '@/utils/admin-api';

import { SponsorForm } from '../../SponsorForm';
import { DeactivateSponsorButton } from './DeactivateSponsorButton';
import styles from './page.module.css';

type EditSponsorPageProps = {
  params: Promise<{ id: string }>;
};

const EditSponsorPage = async ({ params }: EditSponsorPageProps): Promise<JSX.Element> => {
  const { id } = await params;
  const sponsor = await getAdminSponsor(id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Edit Sponsor</h1>
        <DeactivateSponsorButton sponsorId={sponsor.id} sponsorName={sponsor.name} />
      </div>
      <SponsorForm
        sponsorId={sponsor.id}
        defaultValues={{
          name: sponsor.name,
          logoUrl: sponsor.logoUrl ?? '',
          websiteUrl: sponsor.websiteUrl ?? '',
          tier: sponsor.tier,
        }}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditSponsorPage;
