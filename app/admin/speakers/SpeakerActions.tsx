'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';
import tooltipStyles from '@/components/admin/tooltip.module.css';

import { deactivateSpeakerAction } from './actions';
import styles from './SpeakerActions.module.css';

type SpeakerActionsProps = {
  speakerId: string;
  speakerName: string;
};

/**
 * Client component rendering the edit link and deactivate button for a speaker row.
 * Extracted to avoid 'use server' / client boundary conflicts inside AdminTable render props.
 */
export const SpeakerActions = ({ speakerId, speakerName }: SpeakerActionsProps): JSX.Element => {
  return (
    <div className={styles.actions}>
      <Link
        href={`/admin/speakers/${speakerId}/edit`}
        className={`${styles.editLink} ${tooltipStyles.tooltip}`}
        data-tooltip="Edit"
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px' }} />
      </Link>
      <SoftDeleteButton
        label={<FontAwesomeIcon icon={faBan} style={{ fontSize: '16px' }} />}
        confirmMessage="This will deactivate the speaker. They will no longer appear as an option for new event assignments but historical data is preserved."
        onConfirm={() => deactivateSpeakerAction(speakerId)}
        pendingLabel="Deactivating..."
        buttonTitle="Deactivate"
        itemName={speakerName}
        confirmTitle="Deactivate Speaker"
        tooltipLabel="Deactivate"
      />
    </div>
  );
};
