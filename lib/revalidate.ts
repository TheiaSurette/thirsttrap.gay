/**
 * Revalidate cache tags via the revalidation API route.
 * Called from Payload CMS afterChange hooks.
 */
export async function revalidateCache(tags: string[]): Promise<void> {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!secret) {
    console.warn('REVALIDATE_SECRET not set, skipping cache revalidation');
    return;
  }

  try {
    await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags }),
    });
  } catch (error) {
    console.error('Cache revalidation failed:', error);
  }
}
