import type { JSX } from 'react';

import { getAdminSponsor } from '@/utils/admin-api';
import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';

import { SponsorForm } from '../../SponsorForm';
import { updateSponsorAction, deactivateSponsorAction } from '../../actions';
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
        <SoftDeleteButton
          label="Deactivate"
          confirmMessage="This will deactivate the sponsor. They will no longer appear as an option for new event assignments but historical data is preserved."
          onConfirm={() => deactivateSponsorAction(sponsor.id)}
          pendingLabel="Deactivating..."
          itemName={sponsor.name}
          confirmTitle="Deactivate Sponsor"
          tooltipLabel="Deactivate"
        />
      </div>
      <SponsorForm
        defaultValues={{
          name: sponsor.name,
          logoUrl: sponsor.logoUrl ?? '',
          websiteUrl: sponsor.websiteUrl ?? '',
          tier: sponsor.tier,
        }}
        onSubmit={(data) => updateSponsorAction(sponsor.id, data)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditSponsorPage;
