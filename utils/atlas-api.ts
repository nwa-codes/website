import type { Event, Speaker } from './event.types';

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

  const now = new Date();
  const nextEvent = mapped.find((event: Event) => new Date(event.date) >= now) ?? null;
  const pastEvents = mapped.filter((event: Event) => new Date(event.date) < now);

  return { nextEvent, pastEvents };
};

/**
 * Hardcoded logo overrides for the partners section only.
 * These take precedence over the API logoUrl when rendering sponsor partnerships.
 */
const partnerLogoOverrides: Record<string, string> = {
  'Sleepy Fox': '/sponsors/sleepy-fox-logo.svg',
};

/**
 * Fetches the full list of sponsors from the Atlas API.
 * Returns an empty array if the request fails.
 */
export const getSponsors = async (): Promise<ApiSponsorRecord[]> => {
  const response = await fetch(`${process.env.ATLAS_API_URL}/api/sponsors`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const { sponsors } = await response.json();
  return sponsors as ApiSponsorRecord[];
};

/**
 * Resolves a logo path for the partners section, applying any hardcoded
 * partner logo overrides (e.g. Sleepy Fox uses the larger partnership logo).
 * Falls back to the API logoUrl, then to the global sponsorLogoMap.
 * Returns null if no logo is available.
 */
export const resolvePartnerLogoPath = (sponsor: ApiSponsorRecord): string | null => {
  if (partnerLogoOverrides[sponsor.name]) {
    return partnerLogoOverrides[sponsor.name];
  }
  if (sponsor.logoUrl) {
    return sponsor.logoUrl;
  }
  return sponsorLogoMap[sponsor.name] ?? null;
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
