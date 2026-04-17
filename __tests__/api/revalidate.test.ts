import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRevalidateTag = vi.fn();

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
}));

const { POST } = await import('@/app/api/revalidate/route');

function makeRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost:3000/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('REVALIDATE_SECRET', 'test-secret');
    mockRevalidateTag.mockClear();
  });

  it('returns 401 for invalid secret', async () => {
    const res = await POST(makeRequest({ secret: 'wrong', tags: ['events'] }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toMatch(/invalid secret/i);
  });

  it('returns 400 when tags array is missing', async () => {
    const res = await POST(makeRequest({ secret: 'test-secret' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toMatch(/tags/i);
  });

  it('returns 400 when tags array is empty', async () => {
    const res = await POST(makeRequest({ secret: 'test-secret', tags: [] }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toMatch(/tags/i);
  });

  it('revalidates all provided tags', async () => {
    const tags = ['homepage', 'events', 'event-my-event'];
    const res = await POST(makeRequest({ secret: 'test-secret', tags }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.tags).toEqual(tags);
    expect(mockRevalidateTag).toHaveBeenCalledTimes(3);
    expect(mockRevalidateTag).toHaveBeenCalledWith('homepage', 'max');
    expect(mockRevalidateTag).toHaveBeenCalledWith('events', 'max');
    expect(mockRevalidateTag).toHaveBeenCalledWith('event-my-event', 'max');
  });
});
