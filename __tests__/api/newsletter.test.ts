import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => ({
  Resend: class MockResend {
    contacts = {
      create: vi.fn().mockResolvedValue({ id: 'contact-123' }),
    };
  },
}));

// Must import AFTER mocking
const { POST } = await import('@/app/api/newsletter/route');

function makeRequest(body: Record<string, unknown>, ip = '127.0.0.1'): Request {
  return new Request('http://localhost:3000/api/newsletter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('RESEND_API_KEY', 'test-api-key');
    vi.stubEnv('RESEND_AUDIENCE_ID', 'test-audience-id');
  });

  it('returns 400 for missing email', async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/valid email/i);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/valid email/i);
  });

  it('returns 500 when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');

    const res = await POST(makeRequest({ email: 'test@example.com' }, '10.0.0.1'));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/not available/i);
  });

  it('returns 500 when RESEND_AUDIENCE_ID is missing', async () => {
    vi.stubEnv('RESEND_AUDIENCE_ID', '');

    const res = await POST(makeRequest({ email: 'test@example.com' }, '10.0.0.2'));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/not available/i);
  });

  it('returns success for valid email', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com' }, '10.0.0.3'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 429 after exceeding rate limit', async () => {
    const ip = '10.99.99.99';

    for (let i = 0; i < 5; i++) {
      await POST(makeRequest({ email: 'test@example.com' }, ip));
    }

    const res = await POST(makeRequest({ email: 'test@example.com' }, ip));
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.error).toMatch(/too many/i);
    expect(res.headers.get('Retry-After')).toBeTruthy();
  });
});
