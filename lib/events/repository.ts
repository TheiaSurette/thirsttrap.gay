import { unstable_cache } from 'next/cache';
import { describeEvent, discoverEvents, type EventRecord } from './discovery';

function fixtureMode() {
  return (
    process.env.NODE_ENV !== 'production' && process.env.E2E_FIXTURES === '1'
  );
}

async function fixtures(scenario?: string) {
  const { fixtureEvents } = await import('../../tests/fixtures/events');
  return fixtureEvents(scenario);
}

const publishedEvents = unstable_cache(
  async (): Promise<EventRecord[]> => {
    const { getPayloadClient } = await import('@/lib/payload');
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'events',
      where: { status: { equals: 'published' } },
      sort: 'date',
      pagination: false,
      depth: 1,
      overrideAccess: false,
    });
    return docs as EventRecord[];
  },
  ['published-event-records'],
  { tags: ['events', 'homepage'], revalidate: 300 },
);

export async function loadEventDiscovery(scenario?: string) {
  const records = fixtureMode()
    ? await fixtures(scenario)
    : await publishedEvents();
  const now = fixtureMode() ? new Date('2026-09-25T12:00:00Z') : new Date();
  return discoverEvents(records, now);
}

export async function loadEvent(slug: string) {
  const records = fixtureMode() ? await fixtures() : await publishedEvents();
  const record = records.find(
    (e) => e.status === 'published' && e.slug === slug,
  );
  return record
    ? describeEvent(
        record,
        fixtureMode() ? new Date('2026-09-25T12:00:00Z') : new Date(),
      )
    : null;
}
