'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createEvent, updateEvent, softDeleteEvent } from '@/utils/admin-api';

const EventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  eventStartTime: z.string().min(1),
  eventEndTime: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  status: z.enum(['draft', 'published', 'completed', 'cancelled']),
  eventType: z.string().optional(),
  tags: z
    .string()
    .transform((val) => val.split(',').map((segment) => segment.trim()).filter(Boolean)),
  maxAttendees: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  speakers: z.array(z.unknown()).optional(),
  sponsors: z.array(z.unknown()).optional(),
});

export type EventFormValues = z.input<typeof EventSchema>;

/**
 * Creates a new event and redirects to the events list on success.
 * Requires admin authentication.
 */
export const createEventAction = async (payload: EventFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = EventSchema.parse(payload);
  await createEvent(parsed);
  redirect('/admin/events');
};

/**
 * Updates an existing event by ID and redirects to the events list on success.
 * Requires admin authentication.
 */
export const updateEventAction = async (id: string, payload: EventFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = EventSchema.parse(payload);
  await updateEvent(id, parsed);
  redirect('/admin/events');
};

/**
 * Soft-deletes an event by ID and redirects to the events list on success.
 * Requires admin authentication.
 */
export const softDeleteEventAction = async (id: string): Promise<void> => {
  await requireAdmin();
  await softDeleteEvent(id);
  redirect('/admin/events');
};
