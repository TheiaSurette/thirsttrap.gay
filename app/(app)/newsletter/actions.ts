'use server';

import {
  subscribeToNewsletter,
  type SubscriptionResult,
} from '@/lib/newsletter/subscribe';

export async function signUpForNewsletter(
  _previous: SubscriptionResult | null,
  formData: FormData,
): Promise<SubscriptionResult> {
  return subscribeToNewsletter({
    email: formData.get('email'),
    website: formData.get('website'),
  });
}
