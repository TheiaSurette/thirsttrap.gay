import { expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { applicationGateway } from '../../lib/applications/gateway';
import { submitApplication } from '../../lib/applications/intake';

// Explicit opt-in, isolated destination, and controlled inbox. Never use production defaults.
it.skipIf(process.env.RUN_GOOGLE_CONTRACT !== '1')(
  'reconciles real Sheets delivery across concurrent requests and a lost HTTP response',
  async () => {
    const configuration = {
      url: process.env.GOOGLE_TEST_GATEWAY_URL,
      secret: process.env.GOOGLE_TEST_GATEWAY_SECRET,
    };
    const gateway = applicationGateway(configuration);
    const health = await gateway.health();
    expect(health.status).toBe('ok');
    expect(process.env.GOOGLE_TEST_SPREADSHEET_ID).toBeTruthy();
    expect(health.spreadsheetId).toBe(process.env.GOOGLE_TEST_SPREADSHEET_ID);
    expect(health.spreadsheetId).not.toBe(
      '1VJp3nZzBRH260rGipYrwhPEYt46F4FQaWDhiAql79fM',
    );
    expect(process.env.GOOGLE_TEST_NOTIFICATION_TO).toBeTruthy();
    expect(health.notificationTo).toBe(process.env.GOOGLE_TEST_NOTIFICATION_TO);
    expect(String(health.notificationTo).toLowerCase()).not.toContain(
      'contact@thirsttrap.gay',
    );
    const input = {
      id: randomUUID(),
      name: 'INTEGRATION TEST — synthetic applicant',
      contact: '@synthetic-test',
      roles: ['volunteer'],
      volunteer: {
        description: '=Literal text, never a formula',
        assignments: ['Door'],
      },
    };
    const context = { now: new Date(), rateKey: 'isolated-contract-test' };
    const lostResponse = {
      ...gateway,
      save: async (delivery: Parameters<typeof gateway.save>[0]) => {
        await gateway.save(delivery);
        throw new Error('Simulated response loss after actual remote request');
      },
    };
    expect((await submitApplication(input, lostResponse, context)).status).toBe(
      'retry',
    );
    const freshGateway = applicationGateway(configuration);
    const results = await Promise.all([
      submitApplication(input, freshGateway, context),
      submitApplication(input, freshGateway, context),
    ]);
    expect(results.map((result) => result.status)).toEqual(['saved', 'saved']);
    expect(await freshGateway.status(input.id)).toMatchObject({
      status: 'saved',
      matchingRows: 1,
      notification: 'sent',
    });
  },
  120000,
);
