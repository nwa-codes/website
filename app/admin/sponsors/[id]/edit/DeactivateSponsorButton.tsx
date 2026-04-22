'use client';

import type { JSX } from 'react';

import { SoftDeleteButton } from '@/components/admin/SoftDeleteButton';

import { deactivateSponsorAction } from '../../actions';

type DeactivateSponsorButtonProps = {
  sponsorId: string;
  sponsorName: string;
};

/**
 * Thin client wrapper that binds deactivateSponsorAction to a specific sponsor ID
 * so the Server Component edit page can render it without passing closures across
 * the RSC boundary.
 */
export const DeactivateSponsorButton = ({ sponsorId, sponsorName }: DeactivateSponsorButtonProps): JSX.Element => (
  <SoftDeleteButton
    label="Deactivate"
    confirmMessage="This will deactivate the sponsor. They will no longer appear as an option for new event assignments but historical data is preserved."
    onConfirm={() => deactivateSponsorAction(sponsorId)}
    pendingLabel="Deactivating..."
    itemName={sponsorName}
    confirmTitle="Deactivate Sponsor"
    tooltipLabel="Deactivate"
  />
);
