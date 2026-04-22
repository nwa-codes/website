'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';
import tooltipStyles from '@/components/admin/tooltip.module.css';

import { deactivateSponsorAction } from './actions';
import styles from './SponsorActions.module.css';

type SponsorActionsProps = {
  sponsorId: string;
  sponsorName: string;
};

/**
 * Client component rendering the edit link and deactivate button for a sponsor row.
 * Extracted to avoid 'use server' / client boundary conflicts inside AdminTable render props.
 */
export const SponsorActions = ({ sponsorId, sponsorName }: SponsorActionsProps): JSX.Element => {
  return (
    <div className={styles.actions}>
      <Link
        href={`/admin/sponsors/${sponsorId}/edit`}
        className={`${styles.editLink} ${tooltipStyles.tooltip}`}
        data-tooltip="Edit"
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px' }} />
      </Link>
      <SoftDeleteButton
        label={<FontAwesomeIcon icon={faBan} style={{ fontSize: '16px' }} />}
        confirmMessage="This will deactivate the sponsor. They will no longer appear as an option for new event assignments but historical data is preserved."
        onConfirm={() => deactivateSponsorAction(sponsorId)}
        pendingLabel="Deactivating..."
        buttonTitle="Deactivate"
        itemName={sponsorName}
        confirmTitle="Deactivate Sponsor"
        tooltipLabel="Deactivate"
      />
    </div>
  );
};
