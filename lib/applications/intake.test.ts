import { expect, it } from 'vitest';
import { submitApplication } from './intake';

const input = {
  id: '6ff56922-4287-4ad0-a8a2-9e93dc0a5dc8',
  name: 'Test Volunteer',
  contact: '@example',
  roles: ['volunteer'],
  referral: '',
  website: '',
  volunteer: {
    description: 'I would like to help at the door.',
    assignments: ['Door'],
    other: '',
  },
};

it('accepts a beginner volunteer and delivers one correctly mapped row before reporting success', async () => {
  const deliveries: string[][] = [];
  const result = await submitApplication(
    input,
    {
      save: async (application) => {
        deliveries.push(application.row);
        return { status: 'saved' };
      },
      notify: async () => ({ status: 'sent' }),
    },
    { now: new Date('2026-09-25T12:00:00Z'), rateKey: 'test' },
  );
  expect(result.status).toBe('saved');
  expect(deliveries).toEqual([
    [
      '2026-09-25T12:00:00.000Z',
      'Test Volunteer',
      '@example',
      '',
      '',
      'Volunteer',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'I would like to help at the door.',
      'Door',
    ],
  ]);
});

it('rejects blank required fields, unknown choices, and incomplete Other before delivery', async () => {
  let wrote = false;
  const result = await submitApplication(
    {
      ...input,
      name: ' ',
      contact: '',
      roles: [],
      volunteer: { description: '', assignments: ['Other'], other: '' },
    },
    {
      save: async () => {
        wrote = true;
        return { status: 'saved' };
      },
      notify: async () => ({ status: 'sent' }),
    },
    { now: new Date(), rateKey: 'test' },
  );
  expect(result.status).toBe('invalid');
  expect(result.errors).toMatchObject({
    name: expect.any(String),
    contact: expect.any(String),
    roles: expect.any(String),
  });
  expect(wrote).toBe(false);
});

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { googleGateway } from '../../tests/support/google-gateway';

it('authenticates and preserves Unicode names and answers through the Google gateway', async () => {
  const provider = googleGateway(':memory:');
  const unicodeInput = {
    ...input,
    name: 'Zoë — 🌈',
    volunteer: { ...input.volunteer, description: '欢迎！I’d love to help.' },
  };
  try {
    expect(
      (await submitApplication(unicodeInput, provider.gateway, {
        now: new Date(),
        rateKey: 'unicode-test',
      })).status,
    ).toBe('saved');
    expect(provider.rows()).toHaveLength(1);
    expect(provider.rows()[0][1]).toBe(unicodeInput.name);
    expect(provider.rows()[0][17]).toBe(unicodeInput.volunteer.description);
  } finally {
    provider.close();
  }
});

it('reconciles a lost response after a server restart without duplicate rows', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'thirst-intake-'));
  const context = { now: new Date(), rateKey: 'test' };
  let provider = googleGateway(join(directory, 'google.db'));
  try {
    provider.fault.lostResponse = true;
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('retry');
    provider.close();
    provider = googleGateway(join(directory, 'google.db'));
    const results = await Promise.all([
      submitApplication(input, provider.gateway, context),
      submitApplication(input, provider.gateway, context),
    ]);
    expect(results.map((result) => result.status)).toEqual(['saved', 'saved']);
    expect(provider.rows()).toHaveLength(1);
    expect(
      (
        await submitApplication(
          { ...input, id: '23934190-47ae-469d-a56a-667b1dd33f6c' },
          provider.gateway,
          context,
        )
      ).status,
    ).toBe('saved');
    expect(provider.rows()).toHaveLength(2);
  } finally {
    provider.close();
    rmSync(directory, { recursive: true });
  }
});

it('keeps saved applications successful when email fails and retries only safe notification failures', async () => {
  const provider = googleGateway(':memory:');
  const context = { now: new Date(), rateKey: 'test' };
  try {
    provider.fault.quota = 0;
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('saved');
    expect(provider.notifications().records).toEqual([
      { id: input.id, status: 'failed' },
    ]);
    expect(provider.mail()).toHaveLength(0);
    provider.fault.quota = 100;
    expect(await provider.gateway.notify(input.id)).toEqual({ status: 'sent' });
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('saved');
    expect(provider.rows()).toHaveLength(1);
    expect(provider.mail()).toHaveLength(1);
    expect(provider.mail()[0]).toEqual({
      to: 'test@example.invalid',
      name: 'Thirst Trap',
      subject: 'New Thirst Trap application',
      body: 'A new application of interest is ready to review.\n\nhttps://docs.google.com/spreadsheets/d/test-sheet/edit#gid=123',
    });
  } finally {
    provider.close();
  }
});

it('reconciles an ambiguous Sheets write, refuses conflicting answers, and never blindly repeats an unresolved append', async () => {
  const provider = googleGateway(':memory:');
  const context = { now: new Date(), rateKey: 'test' };
  try {
    provider.fault.appendAfterWrite = true;
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('retry');
    provider.fault.appendAfterWrite = false;
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('saved');
    expect(
      (
        await submitApplication(
          { ...input, name: 'Changed' },
          provider.gateway,
          context,
        )
      ).status,
    ).toBe('conflict');
    const second = { ...input, id: '23934190-47ae-469d-a56a-667b1dd33f6c' };
    provider.fault.appendBeforeWrite = true;
    expect(
      (await submitApplication(second, provider.gateway, context)).status,
    ).toBe('retry');
    provider.fault.appendBeforeWrite = false;
    expect(
      (await submitApplication(second, provider.gateway, context)).status,
    ).toBe('retry');
    expect(provider.rows()).toHaveLength(1);
  } finally {
    provider.close();
  }
});

it('does not report a schema failure as saved or resend a mail with an unknown provider outcome', async () => {
  const provider = googleGateway(':memory:');
  const context = { now: new Date(), rateKey: 'test' };
  try {
    provider.fault.schema = true;
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('retry');
    expect(provider.rows()).toHaveLength(0);
    provider.fault.schema = false;
    provider.fault.mail = true;
    expect(
      (await submitApplication(input, provider.gateway, context)).status,
    ).toBe('saved');
    expect(provider.notifications().records).toEqual([
      { id: input.id, status: 'uncertain' },
    ]);
    provider.fault.mail = false;
    expect(await provider.gateway.notify(input.id)).toEqual({
      status: 'uncertain',
    });
    expect(provider.mail()).toHaveLength(0);
  } finally {
    provider.close();
  }
});

const multiRole = {
  ...input,
  roles: ['volunteer', 'vendor', 'dj', 'drag'],
  referral: ' A friend ',
  dj: {
    description: 'House, disco, and pop',
    experience: 'Just starting',
    examples: '@dj',
    rate: 'Negotiable',
  },
  drag: {
    description: 'Comedy and lip sync',
    experience: '',
    examples: 'Ask for clips',
    rate: '$100–200',
  },
  vendor: {
    description: '=Handmade accessories',
    experience: 'First market',
    examples: 'https://example.org/shop',
  },
  volunteer: {
    description: ' Happy to learn ',
    assignments: ['Other', 'Door'],
    other: 'Photography',
  },
};

it('puts all selected roles in one literal-text row in the existing column order', async () => {
  const provider = googleGateway(':memory:');
  try {
    const result = await submitApplication(multiRole, provider.gateway, {
      now: new Date('2026-09-25T12:00Z'),
      rateKey: 'test',
    });
    expect(result.status).toBe('saved');
    expect(provider.rows()).toEqual([
      [
        '2026-09-25T12:00:00.000Z',
        'Test Volunteer',
        '@example',
        '',
        'A friend',
        'DJ, Drag, Vendor, Volunteer',
        'Just starting',
        'House, disco, and pop',
        '@dj',
        'Negotiable',
        '',
        'Comedy and lip sync',
        'Ask for clips',
        '$100–200',
        '=Handmade accessories',
        'First market',
        'https://example.org/shop',
        'Happy to learn',
        'Door, Other: Photography',
      ],
    ]);
  } finally {
    provider.close();
  }
});

const roleCombinations = Array.from({ length: 15 }, (_, index) =>
  ['dj', 'drag', 'vendor', 'volunteer'].filter(
    (_, bit) => (index + 1) & (1 << bit),
  ),
);
it.each(roleCombinations.map((roles) => [roles]))(
  'accepts selected roles %j and excludes deselected answers',
  async (roles) => {
    const provider = googleGateway(':memory:');
    try {
      expect(
        (
          await submitApplication({ ...multiRole, roles }, provider.gateway, {
            now: new Date(),
            rateKey: 'test',
          })
        ).status,
      ).toBe('saved');
      const row = provider.rows()[0];
      expect(row[5].split(', ')).toHaveLength(roles.length);
      for (const [role, start, end] of [
        ['dj', 6, 10],
        ['drag', 10, 14],
        ['vendor', 14, 17],
        ['volunteer', 17, 19],
      ] as const) {
        if (!roles.includes(role))
          expect(
            row.slice(start, end).every((cell: string) => cell === ''),
          ).toBe(true);
      }
    } finally {
      provider.close();
    }
  },
);

it.each([
  { volunteer: { description: '', assignments: ['Other'], other: '' } },
  { volunteer: { description: 'New', assignments: ['Invalid'], other: '' } },
  { roles: ['volunteer', 'volunteer'] },
  { roles: ['admin'] },
  { name: 'x'.repeat(201) },
  { contact: 42 },
  { website: 'https://spam.example' },
  { roles: ['dj'], dj: { description: '' } },
])(
  'rejects malformed or incomplete input without external effects: %j',
  async (changes) => {
    const provider = googleGateway(':memory:');
    try {
      const result = await submitApplication(
        { ...input, ...changes },
        provider.gateway,
        { now: new Date(), rateKey: 'test' },
      );
      expect(result.status).toBe('invalid');
      expect(Object.keys(result.errors || {}).length).toBeGreaterThan(0);
      expect(provider.rows()).toHaveLength(0);
      expect(provider.mail()).toHaveLength(0);
    } finally {
      provider.close();
    }
  },
);

it.each(['@@', '??', '___', '...'])(
  'rejects unusable punctuation-only contact %s',
  async (contact) => {
    const provider = googleGateway(':memory:');
    try {
      const result = await submitApplication(
        { ...input, contact },
        provider.gateway,
        { now: new Date(), rateKey: 'test' },
      );
      expect(result.status).toBe('invalid');
      expect(result.errors?.contact).toBeTruthy();
      expect(provider.rows()).toHaveLength(0);
    } finally {
      provider.close();
    }
  },
);
