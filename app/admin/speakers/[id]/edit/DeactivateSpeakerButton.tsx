'use client';

import type { JSX } from 'react';

import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';

import { deactivateSpeakerAction } from '../../actions';

type DeactivateSpeakerButtonProps = {
  speakerId: string;
  speakerName: string;
};

/**
 * Thin client wrapper that binds deactivateSpeakerAction to a specific speaker ID
 * so the Server Component edit page can render it without passing closures across
 * the RSC boundary.
 */
export const DeactivateSpeakerButton = ({ speakerId, speakerName }: DeactivateSpeakerButtonProps): JSX.Element => (
  <SoftDeleteButton
    label="Deactivate"
    confirmMessage="This will deactivate the speaker. They will no longer appear as an option for new event assignments but historical data is preserved."
    onConfirm={() => deactivateSpeakerAction(speakerId)}
    pendingLabel="Deactivating..."
    itemName={speakerName}
    confirmTitle="Deactivate Speaker"
    tooltipLabel="Deactivate"
  />
);
