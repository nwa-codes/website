import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getEventsData } from './events';

type ApiEventFixture = {
  id: number;
  title: string;
  eventStartTime: string;
};

/**
 * Builds a minimal Atlas API event fixture with the given id, ISO start
 * time, and title.
 */
const buildApiEvent = (id: number, eventStartTime: string, title = `Event ${id}`): ApiEventFixture => ({
  id,
  title,
  eventStartTime
});

/**
 * Builds a fetch-shaped mock response carrying the given JSON body.
 */
const mockFetchResponse = (body: unknown, init: { ok?: boolean; status?: number } = {}) => {
  const { ok = true, status = 200 } = init;
  return {
    ok,
    status,
    json: async () => body
  };
};

describe('getEventsData', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    process.env.ATLAS_API_URL = 'https://atlas.example.test';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('AC-8: exposes the most recent past event as lastEvent from a shuffled API fixture', async () => {
    const oldest = buildApiEvent(1, '2026-05-01T18:00:00.000Z');
    const upcoming = buildApiEvent(4, '2026-07-01T18:00:00.000Z');
    const mostRecentPast = buildApiEvent(3, '2026-06-10T18:00:00.000Z');
    const middlePast = buildApiEvent(2, '2026-06-01T18:00:00.000Z');
    const shuffledFixture = [oldest, upcoming, mostRecentPast, middlePast];

    vi.setSystemTime(new Date('2026-06-20T12:00:00.000Z'));
    fetchMock.mockResolvedValue(mockFetchResponse({ events: shuffledFixture }));

    const result = await getEventsData();

    expect(result.lastEvent?.id).toBe(String(mostRecentPast.id));
  });

  it('AC-7: preserves newest-first ordering through getEventsData from a shuffled API fixture', async () => {
    const oldest = buildApiEvent(1, '2026-05-01T18:00:00.000Z');
    const upcoming = buildApiEvent(4, '2026-07-01T18:00:00.000Z');
    const mostRecentPast = buildApiEvent(3, '2026-06-10T18:00:00.000Z');
    const middlePast = buildApiEvent(2, '2026-06-01T18:00:00.000Z');
    const shuffledFixture = [oldest, upcoming, mostRecentPast, middlePast];

    vi.setSystemTime(new Date('2026-06-20T12:00:00.000Z'));
    fetchMock.mockResolvedValue(mockFetchResponse({ events: shuffledFixture }));

    const result = await getEventsData();

    expect(result.pastEvents.map((event) => event.id)).toEqual([
      String(mostRecentPast.id),
      String(middlePast.id),
      String(oldest.id)
    ]);
  });

  it('AC-9: from a shuffled all-past API fixture, returns null nextEvent, hasPastEvents true, and lastEvent = the most recent event', async () => {
    const oldest = buildApiEvent(12, '2026-04-01T18:00:00.000Z');
    const mostRecent = buildApiEvent(11, '2026-06-01T18:00:00.000Z');
    const middle = buildApiEvent(10, '2026-05-01T18:00:00.000Z');
    const shuffledFixture = [middle, mostRecent, oldest];

    vi.setSystemTime(new Date('2026-06-20T12:00:00.000Z'));
    fetchMock.mockResolvedValue(mockFetchResponse({ events: shuffledFixture }));

    const result = await getEventsData();

    expect(result.nextEvent).toBeNull();
    expect(result.hasPastEvents).toBe(true);
    expect(result.lastEvent?.id).toBe(String(mostRecent.id));
  });

  it('AC-11: throws an Error naming the status when the Atlas API responds 500', async () => {
    vi.setSystemTime(new Date('2026-06-20T12:00:00.000Z'));
    fetchMock.mockResolvedValue(mockFetchResponse({}, { ok: false, status: 500 }));

    await expect(getEventsData()).rejects.toThrow(/500/);
  });

  it('AC-11: throws, rather than returning an empty page, when the response body omits events', async () => {
    vi.setSystemTime(new Date('2026-06-20T12:00:00.000Z'));
    fetchMock.mockResolvedValue(mockFetchResponse({}));

    await expect(getEventsData()).rejects.toThrow();
  });
});
