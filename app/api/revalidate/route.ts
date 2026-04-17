import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { secret, tags } = body;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json({ message: 'Tags array required' }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({ revalidated: true, tags });
}
