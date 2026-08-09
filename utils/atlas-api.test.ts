import { describe, expect, it } from 'vitest';

import { partitionEvents } from './atlas-api';
import type { Event } from './event.types';

/**
 * Builds a minimal Event fixture with the given id, ISO date, and title.
 * Venue fields are irrelevant to partitionEvents and left blank.
 */
const buildEvent = (id: string, date: string, title = `Event ${id}`): Event => ({
  id,
  date,
  title,
  venue: { name: '', address: '' }
});

const idsOf = (events: Event[]): string[] => events.map((event) => event.id);

describe('partitionEvents', () => {
  describe('AC-1: nearest upcoming event selection', () => {
    const far = buildEvent('far', '2026-08-15T18:00:00.000Z', 'Far Future Event');
    const near = buildEvent('near', '2026-06-20T18:00:00.000Z', 'Near Future Event');
    const pastRecent = buildEvent('pastRecent', '2026-06-01T18:00:00.000Z');
    const pastOlder = buildEvent('pastOlder', '2026-05-01T18:00:00.000Z');
    const now = new Date('2026-06-15T12:00:00.000Z');

    it('selects the nearest upcoming event from a descending fixture (real API order)', () => {
      const descendingFixture = [far, near, pastRecent, pastOlder];

      const { nextEvent } = partitionEvents(descendingFixture, now);

      expect(nextEvent?.id).toBe(near.id);
    });

    it('selects the same nearest upcoming event from a shuffled fixture', () => {
      const shuffledFixture = [pastOlder, far, pastRecent, near];

      const { nextEvent } = partitionEvents(shuffledFixture, now);

      expect(nextEvent?.id).toBe(near.id);
    });
  });

  describe('AC-2 and AC-3: Chicago calendar-day cutoff', () => {
    const inProgress = buildEvent('inProgress', '2026-06-15T18:00:00.000Z');

    it('AC-2: retains an event whose start time passed earlier the same Chicago day', () => {
      const now = new Date('2026-06-15T23:00:00.000Z');

      const { nextEvent, pastEvents } = partitionEvents([inProgress], now);

      expect(nextEvent?.id).toBe(inProgress.id);
      expect(pastEvents).toHaveLength(0);
    });

    it('AC-3: excludes an event from the previous Chicago day from nextEvent', () => {
      const now = new Date('2026-06-16T05:00:00.000Z');

      const { nextEvent } = partitionEvents([inProgress], now);

      expect(nextEvent).toBeNull();
    });

    it('AC-3: places the previous Chicago day event into pastEvents', () => {
      const now = new Date('2026-06-16T05:00:00.000Z');

      const { pastEvents } = partitionEvents([inProgress], now);

      expect(idsOf(pastEvents)).toEqual([inProgress.id]);
    });
  });

  describe('AC-4: UTC/Chicago calendar-date divergence', () => {
    const event = buildEvent('ac4', '2026-08-31T23:00:00.000Z');

    it('keeps the event eligible at now=2026-09-01T02:00:00.000Z', () => {
      const { nextEvent } = partitionEvents([event], new Date('2026-09-01T02:00:00.000Z'));

      expect(nextEvent?.id).toBe(event.id);
    });

    it('drops the event at now=2026-09-01T05:00:00.000Z', () => {
      const { nextEvent, pastEvents } = partitionEvents(
        [event],
        new Date('2026-09-01T05:00:00.000Z')
      );

      expect(nextEvent).toBeNull();
      expect(idsOf(pastEvents)).toEqual([event.id]);
    });
  });

  describe('AC-5: daylight-saving transition boundaries', () => {
    const springEvent = buildEvent('ac5-spring', '2026-03-08T07:30:00.000Z');
    const fallEvent = buildEvent('ac5-fall', '2026-11-01T06:30:00.000Z');

    it('keeps the spring-forward event eligible at now=2026-03-09T04:59:59.999Z', () => {
      const { nextEvent } = partitionEvents(
        [springEvent],
        new Date('2026-03-09T04:59:59.999Z')
      );

      expect(nextEvent?.id).toBe(springEvent.id);
    });

    it('drops the spring-forward event at now=2026-03-09T05:00:00.000Z', () => {
      const { nextEvent, pastEvents } = partitionEvents(
        [springEvent],
        new Date('2026-03-09T05:00:00.000Z')
      );

      expect(nextEvent).toBeNull();
      expect(idsOf(pastEvents)).toEqual([springEvent.id]);
    });

    it('keeps the fall-back event eligible at now=2026-11-02T05:59:59.999Z', () => {
      const { nextEvent } = partitionEvents([fallEvent], new Date('2026-11-02T05:59:59.999Z'));

      expect(nextEvent?.id).toBe(fallEvent.id);
    });

    it('drops the fall-back event at now=2026-11-02T06:00:00.000Z', () => {
      const { nextEvent, pastEvents } = partitionEvents(
        [fallEvent],
        new Date('2026-11-02T06:00:00.000Z')
      );

      expect(nextEvent).toBeNull();
      expect(idsOf(pastEvents)).toEqual([fallEvent.id]);
    });
  });

  describe('AC-6: host-timezone independence', () => {
    type BoundaryRow = {
      label: string;
      event: Event;
      now: Date;
      eligible: boolean;
    };

    const boundaryRows: BoundaryRow[] = [
      {
        label: 'AC-4 a eligible',
        event: buildEvent('ac6-ac4a', '2026-08-31T23:00:00.000Z'),
        now: new Date('2026-09-01T02:00:00.000Z'),
        eligible: true
      },
      {
        label: 'AC-4 b not eligible',
        event: buildEvent('ac6-ac4b', '2026-08-31T23:00:00.000Z'),
        now: new Date('2026-09-01T05:00:00.000Z'),
        eligible: false
      },
      {
        label: 'AC-5 spring eligible',
        event: buildEvent('ac6-ac5springelig', '2026-03-08T07:30:00.000Z'),
        now: new Date('2026-03-09T04:59:59.999Z'),
        eligible: true
      },
      {
        label: 'AC-5 spring not eligible',
        event: buildEvent('ac6-ac5springnot', '2026-03-08T07:30:00.000Z'),
        now: new Date('2026-03-09T05:00:00.000Z'),
        eligible: false
      },
      {
        label: 'AC-5 fall eligible',
        event: buildEvent('ac6-ac5fallelig', '2026-11-01T06:30:00.000Z'),
        now: new Date('2026-11-02T05:59:59.999Z'),
        eligible: true
      },
      {
        label: 'AC-5 fall not eligible',
        event: buildEvent('ac6-ac5fallnot', '2026-11-01T06:30:00.000Z'),
        now: new Date('2026-11-02T06:00:00.000Z'),
        eligible: false
      }
    ];

    const hostZones = ['UTC', 'America/Chicago', 'Asia/Tokyo'];

    it('returns the Chicago-correct partition for every AC-4/AC-5 boundary row under every host zone', () => {
      const originalTz = process.env.TZ;

      try {
        hostZones.forEach((zone) => {
          process.env.TZ = zone;

          boundaryRows.forEach((row) => {
            const { nextEvent, pastEvents } = partitionEvents([row.event], row.now);

            if (row.eligible) {
              expect(nextEvent?.id).toBe(row.event.id);
              expect(pastEvents).toHaveLength(0);
            } else {
              expect(nextEvent).toBeNull();
              expect(idsOf(pastEvents)).toEqual([row.event.id]);
            }
          });
        });
      } finally {
        process.env.TZ = originalTz;
      }
    });
  });

  describe('AC-7: pastEvents ordering', () => {
    it('orders pastEvents most-recent-first from a shuffled fixture', () => {
      const older = buildEvent('older', '2026-01-01T12:00:00.000Z');
      const mid = buildEvent('mid', '2026-02-01T12:00:00.000Z');
      const recent = buildEvent('recent', '2026-03-01T12:00:00.000Z');
      const now = new Date('2026-06-15T12:00:00.000Z');
      const shuffledFixture = [mid, recent, older];

      const { pastEvents } = partitionEvents(shuffledFixture, now);

      expect(idsOf(pastEvents)).toEqual([recent.id, mid.id, older.id]);
    });
  });

  describe('AC-9: no current or upcoming event', () => {
    it('returns null nextEvent for an all-past list', () => {
      const older = buildEvent('older', '2026-01-01T12:00:00.000Z');
      const recent = buildEvent('recent', '2026-02-01T12:00:00.000Z');
      const now = new Date('2026-06-15T12:00:00.000Z');

      const { nextEvent } = partitionEvents([older, recent], now);

      expect(nextEvent).toBeNull();
    });

    it('returns null nextEvent with empty pastEvents for an empty list', () => {
      const now = new Date('2026-06-15T12:00:00.000Z');

      const { nextEvent, pastEvents } = partitionEvents([], now);

      expect(nextEvent).toBeNull();
      expect(pastEvents).toEqual([]);
    });
  });

  describe('AC-10: no double membership', () => {
    it('keeps nextEvent out of pastEvents and includes only Chicago-day-ended events in pastEvents', () => {
      const olderPast = buildEvent('olderPast', '2026-05-01T18:00:00.000Z');
      const recentPast = buildEvent('recentPast', '2026-06-01T18:00:00.000Z');
      const inProgress = buildEvent('inProgress', '2026-06-15T18:00:00.000Z');
      const future = buildEvent('future', '2026-07-01T18:00:00.000Z');
      const now = new Date('2026-06-15T23:00:00.000Z');
      const shuffledFixture = [olderPast, future, inProgress, recentPast];

      const { nextEvent, pastEvents } = partitionEvents(shuffledFixture, now);

      expect(nextEvent?.id).toBe(inProgress.id);
      expect(idsOf(pastEvents)).not.toContain(inProgress.id);
      expect(idsOf(pastEvents)).toEqual([recentPast.id, olderPast.id]);
    });
  });
});
