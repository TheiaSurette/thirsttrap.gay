export type SubscriptionResult = { success: boolean; message: string };

const unavailable: SubscriptionResult = {
  success: false,
  message: 'We couldn’t sign you up right now. Please try again in a moment.',
};

export async function subscribeToNewsletter(input: {
  email: unknown;
  website?: unknown;
}): Promise<SubscriptionResult> {
  if (input.website) return unavailable;
  const email =
    typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Enter a valid email address.' };
  }
  const key = process.env.RESEND_API_KEY;
  const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (!key || !segment) return unavailable;

  const request = (path: string, method: string, body?: object) =>
    fetch(`https://api.resend.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

  try {
    const contactPath = `/contacts/${encodeURIComponent(email)}`;
    const existing = await request(contactPath, 'GET');
    if (existing.status === 404) {
      const created = await request('/contacts', 'POST', {
        email,
        unsubscribed: false,
        segments: [{ id: segment }],
      });
      if (!created.ok || typeof (await created.json()).id !== 'string')
        return unavailable;
    } else {
      if (!existing.ok) return unavailable;
      // A new submission is an explicit opt-in, including for returning subscribers.
      const membership = await request(
        `${contactPath}/segments/${encodeURIComponent(segment)}`,
        'POST',
      );
      if (!membership.ok) return unavailable;
      const updated = await request(contactPath, 'PATCH', {
        unsubscribed: false,
      });
      if (!updated.ok || typeof (await updated.json()).id !== 'string')
        return unavailable;
    }
    return {
      success: true,
      message: 'You’re on the list! Look out for news from Thirst Trap.',
    };
  } catch {
    // Provider responses can contain contact details; never return or log them.
    return unavailable;
  }
}
