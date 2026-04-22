'use client';

import type { JSX } from 'react';

import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';

import { softDeleteEventAction } from '../../actions';

type CancelEventButtonProps = {
  eventId: string;
  eventTitle: string;
};

/**
 * Thin client wrapper that binds softDeleteEventAction to a specific event ID
 * so the Server Component edit page can render it without passing closures across
 * the RSC boundary.
 */
export const CancelEventButton = ({ eventId, eventTitle }: CancelEventButtonProps): JSX.Element => (
  <SoftDeleteButton
    label="Cancel Event"
    confirmMessage="This will cancel the event. It will be marked as cancelled and hidden from the public site."
    onConfirm={() => softDeleteEventAction(eventId)}
    pendingLabel="Cancelling..."
    itemName={eventTitle}
    confirmTitle="Cancel Event"
    tooltipLabel="Cancel Event"
  />
);
