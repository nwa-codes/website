'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createSponsor, updateSponsor, deactivateSponsor } from '@/utils/admin-api';

const SponsorSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  tier: z.string().min(1),
});

export type SponsorFormValues = z.input<typeof SponsorSchema>;

/**
 * Creates a new sponsor and redirects to the sponsors list on success.
 * Requires admin authentication.
 */
export const createSponsorAction = async (payload: SponsorFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = SponsorSchema.parse(payload);
  await createSponsor(parsed);
  redirect('/admin/sponsors');
};

/**
 * Updates an existing sponsor by ID and redirects to the sponsors list on success.
 * Requires admin authentication.
 */
export const updateSponsorAction = async (id: string, payload: SponsorFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = SponsorSchema.parse(payload);
  await updateSponsor(id, parsed);
  redirect('/admin/sponsors');
};

/**
 * Deactivates a sponsor by ID and redirects to the sponsors list on success.
 * Requires admin authentication.
 */
export const deactivateSponsorAction = async (id: string): Promise<void> => {
  await requireAdmin();
  await deactivateSponsor(id);
  redirect('/admin/sponsors');
};
