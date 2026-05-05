'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createEvent, updateEvent, softDeleteEvent } from '@/utils/admin-api';

const SpeakerInputSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().optional(),
  title: z.string().optional(),
  speakerTitle: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  displayOrder: z.number().int().optional(),
}).passthrough();

const SponsorInputSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().optional(),
  logoUrl: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  sponsorshipType: z.string().optional(),
  displayOrder: z.number().int().optional(),
}).passthrough();

const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventStartTime: z.string().min(1, 'Start time is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().optional(),
  status: z.enum(['draft', 'published', 'completed', 'cancelled'], { errorMap: () => ({ message: 'Status is required' }) }),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  speakers: z.array(SpeakerInputSchema).optional(),
  sponsors: z.array(SponsorInputSchema).optional(),
});

export type EventFormValues = z.input<typeof EventSchema>;

/**
 * Maps a speaker object to only the fields the Atlas API accepts.
 * Converts null values to undefined and normalises speakerTitle → title.
 */
const mapSpeaker = (speaker: z.output<typeof SpeakerInputSchema>) => ({
  id: speaker.id,
  ...(speaker.name ? { name: speaker.name } : {}),
  ...(speaker.title ?? speaker.speakerTitle ? { title: speaker.title ?? speaker.speakerTitle } : {}),
  ...(speaker.imageUrl ? { imageUrl: speaker.imageUrl } : {}),
  ...(speaker.displayOrder != null ? { displayOrder: speaker.displayOrder } : {}),
});

/**
 * Maps a sponsor object to only the fields the Atlas API accepts.
 * Converts null values to undefined.
 */
const mapSponsor = (sponsor: z.output<typeof SponsorInputSchema>) => ({
  id: sponsor.id,
  ...(sponsor.name ? { name: sponsor.name } : {}),
  ...(sponsor.logoUrl ? { logoUrl: sponsor.logoUrl } : {}),
  ...(sponsor.websiteUrl ? { websiteUrl: sponsor.websiteUrl } : {}),
  ...(sponsor.sponsorshipType ? { sponsorshipType: sponsor.sponsorshipType } : {}),
  ...(sponsor.displayOrder != null ? { displayOrder: sponsor.displayOrder } : {}),
});

/**
 * Builds a clean event payload for the Atlas API, stripping empty strings
 * and mapping speakers/sponsors to only the fields the API schema accepts.
 */
const buildAtlasPayload = (parsed: z.output<typeof EventSchema>) => ({
  title: parsed.title,
  eventStartTime: parsed.eventStartTime,
  venueName: parsed.venueName,
  ...(parsed.venueAddress ? { venueAddress: parsed.venueAddress } : {}),
  status: parsed.status,
  ...(parsed.imageUrl ? { imageUrl: parsed.imageUrl } : {}),
  ...(parsed.videoUrl ? { videoUrl: parsed.videoUrl } : {}),
  ...(parsed.speakers ? { speakers: parsed.speakers.map(mapSpeaker) } : {}),
  ...(parsed.sponsors ? { sponsors: parsed.sponsors.map(mapSponsor) } : {}),
});

/**
 * Creates a new event and redirects to the events list on success.
 * Automatically sets eventEndTime to 2 hours after eventStartTime.
 * Requires admin authentication.
 */
export const createEventAction = async (payload: EventFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = EventSchema.parse(payload);
  const endTime = new Date(new Date(parsed.eventStartTime).getTime() + 2 * 60 * 60 * 1000).toISOString();
  await createEvent({ ...buildAtlasPayload(parsed), eventEndTime: endTime });
  redirect('/admin/events');
};

/**
 * Updates an existing event by ID and redirects to the events list on success.
 * Requires admin authentication.
 */
export const updateEventAction = async (id: string, payload: EventFormValues): Promise<void> => {
  await requireAdmin();
  const parsed = EventSchema.parse(payload);
  await updateEvent(id, buildAtlasPayload(parsed));
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
