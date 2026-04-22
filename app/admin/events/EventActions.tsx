'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';
import tooltipStyles from '@/components/admin/tooltip.module.css';

import { softDeleteEventAction } from './actions';
import styles from './EventActions.module.css';

type EventActionsProps = {
  eventId: string;
  eventTitle: string;
};

/**
 * Client component rendering the edit link and soft-delete button for an event row.
 * Extracted to avoid 'use server' / client boundary conflicts inside AdminTable render props.
 */
export const EventActions = ({ eventId, eventTitle }: EventActionsProps): JSX.Element => {
  return (
    <div className={styles.actions}>
      <Link
        href={`/admin/events/${eventId}/edit`}
        className={`${styles.editLink} ${tooltipStyles.tooltip}`}
        data-tooltip="Edit"
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px' }} />
      </Link>
      <SoftDeleteButton
        label={<FontAwesomeIcon icon={faBan} style={{ fontSize: '16px' }} />}
        confirmMessage="This will cancel the event. It will be marked as cancelled and hidden from the public site."
        onConfirm={() => softDeleteEventAction(eventId)}
        pendingLabel="Cancelling..."
        buttonTitle="Cancel Event"
        itemName={eventTitle}
        confirmTitle="Cancel Event"
        tooltipLabel="Cancel Event"
      />
    </div>
  );
};
