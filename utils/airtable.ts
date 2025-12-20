import Airtable from 'airtable';
import type { Event, Speaker } from './event.types';

const sponsorLogoMap: Record<string, string> = {
  'Sleepy Fox': '/sponsors/sleepy-fox-event-logo.svg',
  'Akra Collective': '/sponsors/akra-logo.svg',
  'U of A Collaborative': '/sponsors/ua-collaborative-logo.png'
};

const DEFAULT_IMAGE_CREDIT = 'Photo by Mohammad Rahmani on Unsplash';

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

export const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
export const eventsTable = base('events');
export const rsvpsTable = base('event_rsvps');
export const speakersTable = base('speakers');

export async function checkExistingRSVP(eventId: string, email: string): Promise<boolean> {
  const records = await rsvpsTable
    .select({
      filterByFormula: `AND({eventId} = '${eventId}', {email} = '${email}')`
    })
    .all();

  return records.length > 0;
}

export async function createRSVP(eventId: string, email: string): Promise<void> {
  await rsvpsTable.create([
    {
      fields: {
        eventId,
        email,
        linkedEvent: [eventId],
        source: 'website'
      }
    }
  ]);
}

export async function getSpeakers(speakerIds: string[]): Promise<Speaker[]> {
  if (!speakerIds || speakerIds.length === 0) return [];

  const records = await speakersTable
    .select({
      filterByFormula: `OR(${speakerIds.map(id => `RECORD_ID()='${id}'`).join(',')})`
    })
    .all();

  return records.map(record => ({
    id: record.id,
    name: record.fields.name as string,
    speakerTitle: record.fields.title as string,
    imageUrl: record.fields.imageUrl as string,
  }));
}

export async function getEvents(): Promise<Event[]> {
  const records = await eventsTable
    .select({
      sort: [{ field: 'date', direction: 'desc' }]
    })
    .all();

  const airtableEvents = await Promise.all(records.map(async (record) => {
    const fields = record.fields;
    const sponsoredBy = fields.sponsoredBy as string[] | undefined;
    const sponsoredByLogos = sponsoredBy?.map((sponsor) => sponsorLogoMap[sponsor]).filter(Boolean);

    // Fetch linked speakers
    const speakerIds = fields.speakers as string[] | undefined;
    let speakers = speakerIds ? await getSpeakers(speakerIds) : [];

    // Fallback to legacy single speaker if no linked speakers
    if (speakers.length === 0 && fields.speakerName) {
      speakers = [{
        id: 'legacy',
        name: fields.speakerName as string,
        speakerTitle: fields.speakerTitle as string,
        imageUrl: fields.speakerImageUrl as string,
      }];
    }

    // Parse photos from comma-separated URLs
    let photos: string[] = [];
    if (fields.photoUrls) {
      const photoUrls = fields.photoUrls as string;
      photos = photoUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    }

    return {
      id: record.id,
      date: fields.date as string,
      title: fields.title as string,
      imageUrl: fields.imageUrl as string | undefined,
      speakers,
      photos,
      venue: {
        name: fields.venueName as string,
        address: fields.venueAddress as string
      },
      videoUrl: fields.videoUrl as string | undefined,
      sponsoredBy,
      sponsoredByLogos,
      imageCredit: fields.imageUrl
        ? (fields.imageCredit as string | undefined)
        : DEFAULT_IMAGE_CREDIT
    };
  }));

  // In development, if we have fewer than 6 events, supplement with mock data
  if (process.env.NODE_ENV === 'development' && airtableEvents.length < 6) {
    // Import mock events dynamically to avoid issues in production builds
    const { events: mockEvents } = await import('./mock-events');
    const neededEvents = 6 - airtableEvents.length;
    const mockEventsToAdd = mockEvents.slice(0, neededEvents).map(
      (mockEvent, index) =>
        ({
          id: `mock-${index}`,
          ...mockEvent,
          speakers: mockEvent.speakers ?? [],
          photos: mockEvent.photos ?? [],
          sponsoredBy: mockEvent.sponsoredBy ? [mockEvent.sponsoredBy] : undefined,
          sponsoredByLogos: mockEvent.sponsoredByLogo ? [mockEvent.sponsoredByLogo] : undefined
        }) as Event
    );

    return [...airtableEvents, ...mockEventsToAdd];
  }

  return airtableEvents;
}
