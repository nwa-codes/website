'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createSponsor, updateSponsor, deactivateSponsor } from '@/utils/admin-api';

const SponsorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
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
export const updateSponsorAction = async (id: number, payload: SponsorFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = SponsorSchema.parse(payload);
  await updateSponsor(String(id), parsed);
  redirect('/admin/sponsors');
};

/**
 * Deactivates a sponsor by ID and redirects to the sponsors list on success.
 * Requires admin authentication.
 */
export const deactivateSponsorAction = async (id: number): Promise<void> => {
  await requireAdmin();
  await deactivateSponsor(String(id));
  redirect('/admin/sponsors');
};
