import { createHmac } from 'node:crypto';
import type { Gateway, DeliveryResult } from './intake';

export function applicationGateway(
  configuration = {
    url: process.env.APPLICATIONS_GATEWAY_URL,
    secret: process.env.APPLICATIONS_GATEWAY_SECRET,
  },
): Gateway & {
  notifications: () => Promise<Record<string, unknown>>;
  health: () => Promise<Record<string, unknown>>;
  status: (id: string) => Promise<Record<string, unknown>>;
} {
  const { url, secret } = configuration;
  async function call(
    request: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    if (
      !url ||
      !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url) ||
      !secret ||
      secret.length < 32
    )
      throw new Error('Application gateway is not configured.');
    const payload = JSON.stringify({ ...request, sentAt: Date.now() });
    const signature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ payload, signature }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw new Error('Application gateway unavailable.');
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('status' in result))
      throw new Error('Invalid gateway response.');
    return result as Record<string, unknown>;
  }
  return {
    save: async (application) => {
      const result = await call({ action: 'save', ...application });
      const status = ['saved', 'uncertain', 'conflict', 'limited'].includes(
        String(result.status),
      )
        ? result.status
        : 'unavailable';
      return { status } as DeliveryResult;
    },
    notify: async (id) => {
      const result = await call({ action: 'notify', id });
      return { status: String(result.status) };
    },
    notifications: () => call({ action: 'notifications' }),
    health: () => call({ action: 'health' }),
    status: (id) => call({ action: 'status', id }),
  };
}
