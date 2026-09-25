'use server';

import { headers } from 'next/headers';
import { createHmac } from 'node:crypto';
import { submitApplication, type Gateway } from '@/lib/applications/intake';
import { applicationGateway } from '@/lib/applications/gateway';

export async function sendApplication(input: unknown) {
  const requestHeaders = await headers();
  const secret = process.env.APPLICATIONS_GATEWAY_SECRET || 'unconfigured';
  // Vercel sets x-vercel-forwarded-for. Other hosts must sanitize forwarded headers.
  const address = requestHeaders.get('x-vercel-forwarded-for') || 'shared';
  const rateKey = createHmac('sha256', secret)
    .update(address)
    .digest('hex')
    .slice(0, 20);
  let gateway: Gateway = applicationGateway();
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.E2E_FIXTURES === '1'
  ) {
    const { fixtureGateway } = await import(
      '@/tests/fixtures/application-gateway'
    );
    gateway = fixtureGateway;
  }
  return submitApplication(input, gateway, { now: new Date(), rateKey });
}
