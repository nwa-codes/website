'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createSpeaker, updateSpeaker, deactivateSpeaker } from '@/utils/admin-api';

const SpeakerSchema = z.object({
  name: z.string().min(1),
  speakerTitle: z.string().min(1),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

export type SpeakerFormValues = z.input<typeof SpeakerSchema>;

/**
 * Creates a new speaker and redirects to the speakers list on success.
 * Requires admin authentication.
 */
export const createSpeakerAction = async (payload: SpeakerFormValues): Promise<void> => {
  await requireAdmin();
  const { speakerTitle, ...rest } = SpeakerSchema.parse(payload);
  await createSpeaker({ ...rest, title: speakerTitle });
  redirect('/admin/speakers');
};

/**
 * Updates an existing speaker by ID and redirects to the speakers list on success.
 * Requires admin authentication.
 */
export const updateSpeakerAction = async (id: string, payload: SpeakerFormValues): Promise<void> => {
  await requireAdmin();
  const { speakerTitle, ...rest } = SpeakerSchema.parse(payload);
  await updateSpeaker(id, { ...rest, title: speakerTitle });
  redirect('/admin/speakers');
};

/**
 * Deactivates a speaker by ID and redirects to the speakers list on success.
 * Requires admin authentication.
 */
export const deactivateSpeakerAction = async (id: string): Promise<void> => {
  await requireAdmin();
  await deactivateSpeaker(id);
  redirect('/admin/speakers');
};
