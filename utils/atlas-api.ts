import { endOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

import type { Event, Speaker } from './event.types';

const CHICAGO_TIME_ZONE = 'America/Chicago';

type ApiSpeaker = {
  id: number;
  name: string;
  title: string;
  bio?: string | null;
  imageUrl?: string | null;
  socialLinks?: unknown;
};

type ApiSponsorRecord = {
  id: number;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
};

export type ApiSponsor = {
  sponsorshipType: string;
  displayOrder: number;
  sponsor: ApiSponsorRecord;
};

type ApiEvent = {
  id: number;
  title: string;
  eventStartTime: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
  videoUrl?: string | null;
  photoUrls?: string[];
  venueName?: string | null;
  venueAddress?: string | null;
  speakers?: ApiSpeaker[];
  sponsors?: ApiSponsor[];
};

const sponsorLogoMap: Record<string, string> = {
  'Sleepy Fox': '/sponsors/sleepy-fox-event-logo.svg',
  'Akra Collective': '/sponsors/akra-logo.svg',
  'U of A Collaborative': '/sponsors/ua-collaborative-logo.png',
};

/**
 * Resolves a logo path for a sponsor, preferring the API-provided logoUrl
 * and falling back to the local sponsorLogoMap.
 */
const resolveLogoPath = (sponsorEntry: ApiSponsor): string | null => {
  if (sponsorEntry.sponsor.logoUrl) {
    return sponsorEntry.sponsor.logoUrl;
  }
  return sponsorLogoMap[sponsorEntry.sponsor.name] ?? null;
};

/**
 * Maps an API speaker record to the website Speaker type.
 * Omits bio and socialLinks; converts numeric id to string.
 */
const mapApiSpeakerToSpeaker = (speaker: ApiSpeaker): Speaker => ({
  id: String(speaker.id),
  name: speaker.name,
  speakerTitle: speaker.title,
  imageUrl: speaker.imageUrl ?? '',
});

/**
 * Maps a raw Atlas API event record to the website Event type.
 * Omits optional fields when they are null or empty.
 */
const mapApiEventToEvent = (apiEvent: ApiEvent): Event => {
  const speakers =
    apiEvent.speakers && apiEvent.speakers.length > 0
      ? apiEvent.speakers.map(mapApiSpeakerToSpeaker)
      : undefined;

  const photos =
    apiEvent.photoUrls && apiEvent.photoUrls.length > 0
      ? apiEvent.photoUrls
      : undefined;

  const sponsorNames =
    apiEvent.sponsors && apiEvent.sponsors.length > 0
      ? apiEvent.sponsors.map((sponsorEntry) => sponsorEntry.sponsor.name)
      : undefined;

  const resolvedLogos = apiEvent.sponsors
    ?.map(resolveLogoPath)
    .filter((logo): logo is string => logo !== null);

  const sponsoredByLogos =
    resolvedLogos && resolvedLogos.length > 0 ? resolvedLogos : undefined;

  const event: Event = {
    id: String(apiEvent.id),
    date: apiEvent.eventStartTime,
    title: apiEvent.title,
    venue: {
      name: apiEvent.venueName ?? '',
      address: apiEvent.venueAddress ?? '',
    },
  };

  if (apiEvent.imageUrl) {
    event.imageUrl = apiEvent.imageUrl;
  }

  if (apiEvent.imageCredit) {
    event.imageCredit = apiEvent.imageCredit;
  }

  if (apiEvent.videoUrl) {
    event.videoUrl = apiEvent.videoUrl;
  }

  if (photos) {
    event.photos = photos;
  }

  if (speakers) {
    event.speakers = speakers;
  }

  if (sponsorNames) {
    event.sponsoredBy = sponsorNames;
  }

  if (sponsoredByLogos) {
    event.sponsoredByLogos = sponsoredByLogos;
  }

  return event;
};

/**
 * Computes the real UTC instant of 23:59:59.999 America/Chicago local time
 * on the calendar day an event's start time falls on. Round-trips through
 * the zoned wall-clock time so the UTC offset used is the one in effect at
 * the end of that Chicago day, not at the event's start.
 */
const chicagoEndOfEventDay = (event: Event): Date => {
  const zonedStart = toZonedTime(new Date(event.date), CHICAGO_TIME_ZONE);
  return fromZonedTime(endOfDay(zonedStart), CHICAGO_TIME_ZONE);
};

/**
 * Splits events into the nearest current-or-upcoming event and a
 * most-recent-first list of past events, using an America/Chicago
 * end-of-calendar-day cutoff. Sorts both buckets explicitly so the result
 * is correct regardless of the order `events` arrives in.
 */
export const partitionEvents = (
  events: Event[],
  now: Date
): { nextEvent: Event | null; pastEvents: Event[] } => {
  const isPast = (event: Event): boolean => chicagoEndOfEventDay(event).getTime() < now.getTime();

  const upcoming = events.filter((event) => !isPast(event));
  const past = events.filter(isPast);

  const nextEvent =
    upcoming.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ??
    null;
  const pastEvents = past.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return { nextEvent, pastEvents };
};

/**
 * Fetches all published and completed events from the Atlas API and splits
 * them into the next upcoming event and a list of past events.
 */
export const getEvents = async (): Promise<{ nextEvent: Event | null; pastEvents: Event[] }> => {
  const response = await fetch(
    `${process.env.ATLAS_API_URL}/api/events?status=published,completed&orderBy=eventStartTime:desc&limit=50`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error(`Atlas API error ${response.status}: GET /api/events`);
  }

  const { events } = await response.json();
  const mapped = (events as ApiEvent[]).map(mapApiEventToEvent);

  return partitionEvents(mapped, new Date());
};


/**
 * Fetches a single event by ID from the Atlas API.
 * Returns null if the event is not found (404), throws on other errors.
 */
export const getEvent = async (id: string): Promise<Event | null> => {
  const response = await fetch(
    `${process.env.ATLAS_API_URL}/api/events/${id}`,
    { cache: 'no-store' }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Atlas API error ${response.status}: GET /api/events/${id}`);
  }

  const event = await response.json();
  return mapApiEventToEvent(event as ApiEvent);
};
