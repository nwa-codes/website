'use server';

import { getEvents } from '@/utils/airtable';
import { Event } from '@/utils/event.types';
import { isAfter, parseISO } from 'date-fns';
import { toDate } from 'date-fns-tz';

// Helper to parse date from Airtable as CST
// Assumes the date string is in format that should be interpreted as CST
const parseEventDate = (dateString: string): Date => {
  // If the date string doesn't have timezone info, treat it as CST
  if (!dateString.includes('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
    return toDate(dateString, { timeZone: 'America/Chicago' });
  }
  // If it has timezone info, parse it normally
  return parseISO(dateString);
};

const sortDatesAsc = (firstEvent: Event, secondEvent: Event) =>
  parseEventDate(firstEvent.date).getTime() - parseEventDate(secondEvent.date).getTime();

const sortDatesDesc = (firstEvent: Event, secondEvent: Event) =>
  parseEventDate(secondEvent.date).getTime() - parseEventDate(firstEvent.date).getTime();

export async function getEventsData() {
  const allEvents = await getEvents();
  const now = new Date();

  const futureEvents = allEvents
    .filter((event) => isAfter(parseEventDate(event.date), now))
    .sort(sortDatesAsc);

  const pastEvents = allEvents
    .filter((event) => !isAfter(parseEventDate(event.date), now))
    .sort(sortDatesDesc);

  return {
    nextEvent: futureEvents.length > 0 ? futureEvents[0] : null,
    pastEvents: pastEvents.slice(0, 10),
    showLoadMore: pastEvents.length > 10,
    hasPastEvents: pastEvents.length > 0,
    lastEvent: pastEvents.length > 0 ? pastEvents[0] : null
  };
}
