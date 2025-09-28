'use server';

import { getEvents } from '@/utils/airtable';
import { Event } from '@/utils/event.types';
import { isAfter, parseISO } from 'date-fns';

const sortDatesAsc = (firstEvent: Event, secondEvent: Event) =>
  parseISO(firstEvent.date).getTime() - parseISO(secondEvent.date).getTime();

const sortDatesDesc = (firstEvent: Event, secondEvent: Event) =>
  parseISO(secondEvent.date).getTime() - parseISO(firstEvent.date).getTime();

export async function getEventsData() {
  const allEvents = await getEvents();
  const now = new Date();

  const futureEvents = allEvents
    .filter((event) => isAfter(parseISO(event.date), now))
    .sort(sortDatesAsc);

  const pastEvents = allEvents
    .filter((event) => !isAfter(parseISO(event.date), now))
    .sort(sortDatesDesc);

  return {
    nextEvent: futureEvents.length > 0 ? futureEvents[0] : null,
    pastEvents: pastEvents.slice(0, 10),
    showLoadMore: pastEvents.length > 10,
    hasPastEvents: pastEvents.length > 0,
    lastEvent: pastEvents.length > 0 ? pastEvents[0] : null
  };
}
