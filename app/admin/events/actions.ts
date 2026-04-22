'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createEvent, updateEvent, softDeleteEvent } from '@/utils/admin-api';

const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventStartTime: z.string().min(1, 'Start time is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().optional(),
  status: z.enum(['draft', 'published', 'completed', 'cancelled'], { errorMap: () => ({ message: 'Status is required' }) }),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  speakers: z.array(z.unknown()).optional(),
  sponsors: z.array(z.unknown()).optional(),
});

export type EventFormValues = z.input<typeof EventSchema>;

/**
 * Creates a new event and redirects to the events list on success.
 * Automatically sets eventEndTime to 2 hours after eventStartTime.
 * Requires admin authentication.
 */
export const createEventAction = async (payload: EventFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = EventSchema.parse(payload);
  const endTime = new Date(new Date(parsed.eventStartTime).getTime() + 2 * 60 * 60 * 1000).toISOString();
  await createEvent({ ...parsed, eventEndTime: endTime });
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
