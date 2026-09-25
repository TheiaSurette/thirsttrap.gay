import type { EventRecord } from '../../lib/events/discovery';

export const eventFixtures: EventRecord[] = [
  {
    id: 1,
    slug: 'after-hours',
    status: 'published',
    title: 'After Hours',
    date: '2026-10-10T02:00:00Z',
    featured: true,
    location: { venueName: 'Taffeta Music Hall', city: 'Lowell', state: 'MA' },
    eventLinks: [
      {
        url: 'https://example.com/tickets',
        text: 'Get tickets',
        icon: 'ticket',
      },
    ],
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'A night for the dance floor. Local DJs, drag, and a room full of your people.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: 2,
    slug: 'spill-the-tea',
    status: 'published',
    title: 'Spill the Tea',
    date: '2026-10-24T00:00:00Z',
    location: { city: 'Lowell', state: 'MA' },
  },
  {
    id: 3,
    slug: 'past-party',
    status: 'published',
    title: 'Past party',
    date: '2026-06-13T02:00:00Z',
    eventLinks: [
      { url: 'https://example.com/expired', text: 'Tickets', icon: 'ticket' },
    ],
  },
  {
    id: 4,
    slug: 'draft-party',
    status: 'draft',
    title: 'Draft party',
    date: '2026-10-01T02:00:00Z',
  },
];

export function fixtureEvents(scenario?: string) {
  if (scenario === 'empty')
    return eventFixtures.filter((event) => Number(event.id) > 2);
  if (scenario === 'one') return [eventFixtures[0]];
  if (
    scenario === 'portrait' ||
    scenario === 'landscape' ||
    scenario === 'long'
  ) {
    const width = scenario === 'landscape' ? 1200 : 600;
    const height = scenario === 'landscape' ? 600 : 900;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#191126"/><rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#ff00ae" stroke-width="4"/><text x="30" y="60" fill="#eeedf5" font-size="28">TEST ARTWORK — TOP EDGE</text><text x="30" y="${height - 30}" fill="#eeedf5" font-size="24">FULL BOTTOM EDGE</text></svg>`;
    return [
      {
        ...eventFixtures[0],
        title:
          scenario === 'long'
            ? 'A Very Long Night of Dancing, Drag & Queer Joy in Lowell'
            : eventFixtures[0].title,
        image: {
          url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
          alt: `${scenario} test flyer`,
          width,
          height,
        },
      },
      ...eventFixtures.slice(1),
    ];
  }
  return eventFixtures;
}
