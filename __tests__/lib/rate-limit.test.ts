import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within the limit', () => {
    const config = { maxRequests: 3, windowMs: 60_000 };

    const r1 = rateLimit('test-key-1', config);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit('test-key-1', config);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit('test-key-1', config);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks requests exceeding the limit', () => {
    const config = { maxRequests: 2, windowMs: 60_000 };

    rateLimit('test-key-2', config);
    rateLimit('test-key-2', config);

    const blocked = rateLimit('test-key-2', config);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets after the window expires', () => {
    const config = { maxRequests: 1, windowMs: 10_000 };

    rateLimit('test-key-3', config);

    const blocked = rateLimit('test-key-3', config);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(10_001);

    const after = rateLimit('test-key-3', config);
    expect(after.allowed).toBe(true);
    expect(after.remaining).toBe(0);
  });

  it('tracks different keys independently', () => {
    const config = { maxRequests: 1, windowMs: 60_000 };

    rateLimit('key-a', config);
    rateLimit('key-b', config);

    const blockedA = rateLimit('key-a', config);
    const blockedB = rateLimit('key-b', config);

    expect(blockedA.allowed).toBe(false);
    expect(blockedB.allowed).toBe(false);
  });

  it('returns correct resetAt timestamp', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const config = { maxRequests: 5, windowMs: 60_000 };

    const result = rateLimit('test-key-4', config);
    expect(result.resetAt).toBe(Date.now() + 60_000);
  });
});
