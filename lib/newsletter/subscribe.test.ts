import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribeToNewsletter } from './subscribe';

const provider = vi.fn<typeof fetch>();
const reply = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status });

beforeEach(() => {
  vi.stubGlobal('fetch', provider);
  vi.stubEnv('RESEND_API_KEY', 'test-secret');
  vi.stubEnv('RESEND_NEWSLETTER_SEGMENT_ID', 'newsletter-segment');
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  provider.mockReset();
});

describe('newsletter delivery', () => {
  it('rejects invalid input and honeypots without contacting Resend', async () => {
    for (const email of [
      null,
      '',
      'bad',
      'person@',
      'a@b.c\nBad: header',
      'a'.repeat(255) + '@b.co',
    ]) {
      expect((await subscribeToNewsletter({ email })).success).toBe(false);
    }
    expect(
      (
        await subscribeToNewsletter({
          email: 'person@example.com',
          website: 'spam',
        })
      ).success,
    ).toBe(false);
    expect(provider).not.toHaveBeenCalled();
  });

  it('requires configuration and never pretends a subscriber was saved', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect(
      (await subscribeToNewsletter({ email: 'person@example.com' })).success,
    ).toBe(false);
    expect(provider).not.toHaveBeenCalled();
  });

  it('creates a subscribed contact in the newsletter segment', async () => {
    provider
      .mockResolvedValueOnce(reply({}, 404))
      .mockResolvedValueOnce(reply({ id: 'contact-id' }));
    expect(
      (await subscribeToNewsletter({ email: ' Person@Example.com ' })).success,
    ).toBe(true);
    expect(provider.mock.calls[1][0]).toBe('https://api.resend.com/contacts');
    expect(JSON.parse(provider.mock.calls[1][1]!.body as string)).toEqual({
      email: 'person@example.com',
      unsubscribed: false,
      segments: [{ id: 'newsletter-segment' }],
    });
  });

  it('handles repeat signups and explicit re-subscriptions using the existing contact', async () => {
    provider
      .mockResolvedValueOnce(reply({ id: 'contact-id', unsubscribed: true }))
      .mockResolvedValueOnce(reply({ id: 'newsletter-segment' }))
      .mockResolvedValueOnce(reply({ id: 'contact-id' }));
    expect(
      (await subscribeToNewsletter({ email: 'person+tag@example.com' }))
        .success,
    ).toBe(true);
    expect(provider.mock.calls[1][0]).toBe(
      'https://api.resend.com/contacts/person%2Btag%40example.com/segments/newsletter-segment',
    );
    expect(provider.mock.calls[2][1]).toMatchObject({
      method: 'PATCH',
      body: '{"unsubscribed":false}',
    });
  });

  it.each([401, 403, 429, 500])(
    'reports provider failure %s without exposing provider details',
    async (status) => {
      provider.mockResolvedValue(
        reply({ message: 'test-secret person@example.com' }, status),
      );
      const result = await subscribeToNewsletter({
        email: 'person@example.com',
      });
      expect(result.success).toBe(false);
      expect(result.message).not.toContain('test-secret');
      expect(result.message).not.toContain('person@example.com');
    },
  );

  it('does not claim success after partial delivery or malformed confirmation', async () => {
    provider
      .mockResolvedValueOnce(reply({ id: 'contact-id' }))
      .mockResolvedValueOnce(reply({}, 500));
    expect(
      (await subscribeToNewsletter({ email: 'person@example.com' })).success,
    ).toBe(false);
    provider
      .mockResolvedValueOnce(reply({}, 404))
      .mockResolvedValueOnce(reply({}));
    expect(
      (await subscribeToNewsletter({ email: 'person@example.com' })).success,
    ).toBe(false);
  });

  it('handles network failures and timeouts as retryable failures', async () => {
    provider.mockRejectedValue(new Error('Timed out'));
    expect(
      (await subscribeToNewsletter({ email: 'person@example.com' })).success,
    ).toBe(false);
  });
});
