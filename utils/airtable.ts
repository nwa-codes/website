import Airtable from 'airtable';
import type { Event } from './event.types';

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
        linkedEvent: [eventId]
      }
    }
  ]);
}

export async function getEvents(): Promise<Event[]> {
  const records = await eventsTable
    .select({
      sort: [{ field: 'date', direction: 'desc' }]
    })
    .all();

  const airtableEvents = records.map((record) => {
    const fields = record.fields;
    const sponsoredBy = fields.sponsoredBy as string[] | undefined;
    const sponsoredByLogos = sponsoredBy?.map((sponsor) => sponsorLogoMap[sponsor]).filter(Boolean);

    return {
      id: record.id,
      date: fields.date as string,
      title: fields.title as string,
      imageUrl: fields.imageUrl as string | undefined,
      speaker: {
        name: fields.speakerName as string,
        speakerTitle: fields.speakerTitle as string,
        imageUrl: fields.speakerImageUrl as string
      },
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
  });

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
          sponsoredBy: mockEvent.sponsoredBy ? [mockEvent.sponsoredBy] : undefined,
          sponsoredByLogos: mockEvent.sponsoredByLogo ? [mockEvent.sponsoredByLogo] : undefined
        }) as Event
    );

    return [...airtableEvents, ...mockEventsToAdd];
  }

  return airtableEvents;
}
