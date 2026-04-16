'use server';

import { getEvents } from '@/utils/atlas-api';

/**
 * Fetches all events from the Atlas API and derives computed fields
 * needed by the homepage (nextEvent, pastEvents, showLoadMore, etc.).
 */
export const getEventsData = async () => {
  const { nextEvent, pastEvents } = await getEvents();

  return {
    nextEvent,
    pastEvents: pastEvents.slice(0, 10),
    showLoadMore: pastEvents.length > 10,
    hasPastEvents: pastEvents.length > 0,
    lastEvent: pastEvents.length > 0 ? pastEvents[0] : null
  };
};
