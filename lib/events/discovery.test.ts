import { describe, it, expect } from 'vitest';
import { discoverEvents, type EventRecord } from './discovery';

const event = (
  id: number,
  overrides: Partial<EventRecord> = {},
): EventRecord => ({
  id,
  slug: `party-${id}`,
  title: `Party ${id}`,
  status: 'published',
  date: '2026-09-26T02:00:00Z',
  ...overrides,
});

describe('event discovery', () => {
  it('features the earliest eligible event and keeps other featured events discoverable', () => {
    const result = discoverEvents(
      [
        event(3, { featured: true, date: '2026-10-01T02:00:00Z' }),
        event(1),
        event(2, { featured: true, date: '2026-09-28T02:00:00Z' }),
      ],
      new Date('2026-09-25T12:00:00Z'),
    );
    expect(result.featured?.id).toBe(2);
    expect(result.featuredLabel).toBe('Featured event');
    expect(result.others.map((e) => e.id)).toEqual([1, 3]);
  });
  it.each([
    ['2026-09-26T03:59:59Z', true],
    ['2026-09-26T04:00:00Z', false],
  ])('keeps running events until their explicit end at %s', (now, visible) => {
    const result = discoverEvents(
      [event(1, { endDate: '2026-09-26T04:00:00Z' })],
      new Date(now),
    );
    expect(Boolean(result.featured)).toBe(visible);
  });
});

it.each([
  ['2026-09-26T02:00:00Z', '2026-09-26T09:59:59Z', true],
  ['2026-09-26T02:00:00Z', '2026-09-26T10:00:00Z', false],
  ['2026-09-26T05:00:00Z', '2026-09-26T10:00:00Z', false],
  ['2026-03-08T04:00:00Z', '2026-03-08T10:00:00Z', false],
  ['2026-11-01T03:00:00Z', '2026-11-01T10:59:59Z', true],
  ['2026-11-01T03:00:00Z', '2026-11-01T11:00:00Z', false],
])(
  'uses a local 6 AM fallback across midnight and DST: %s',
  (date, now, visible) => {
    expect(
      Boolean(discoverEvents([event(1, { date })], new Date(now)).featured),
    ).toBe(visible);
  },
);

it('falls back to the next event, excludes drafts and expired records, and never truncates a backlog', () => {
  const past = Array.from({ length: 80 }, (_, i) =>
    event(i, { date: '2020-01-01T20:00:00Z', featured: true }),
  );
  const result = discoverEvents(
    [...past, event(101), event(100), event(102, { status: 'draft' })],
    new Date('2026-09-25T12:00:00Z'),
  );
  expect(result.featured?.id).toBe(100);
  expect(result.others.map((e) => e.id)).toEqual([101]);
  expect(result.featured?.displayDate).toBe('Fri, Sep 25');
  expect(result.featured?.displayTime).toBe('10:00 PM EDT');
  expect(result.featuredLabel).toBe('Up next');
});

it('re-evaluates the same records when time passes and returns a useful empty result', () => {
  const records = [event(1, { endDate: '2026-09-26T04:00:00Z' })];
  expect(
    discoverEvents(records, new Date('2026-09-26T03:59:00Z')).featured?.id,
  ).toBe(1);
  expect(
    discoverEvents(records, new Date('2026-09-26T04:00:00Z')),
  ).toMatchObject({ featured: null, others: [] });
  expect(discoverEvents([], new Date())).toMatchObject({
    featured: null,
    others: [],
  });
});
