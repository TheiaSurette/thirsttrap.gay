import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rate-limit';

const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, resetAt } = rateLimit(`newsletter:${ip}`, RATE_LIMIT_CONFIG);

    if (!allowed) {
      const retryAfterSec = Math.ceil((resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfterSec) },
        },
      );
    }

    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Newsletter signup is not available right now.' },
        { status: 500 },
      );
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID is not configured');
      return NextResponse.json(
        { error: 'Newsletter signup is not available right now.' },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    await resend.contacts.create({
      email,
      audienceId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
