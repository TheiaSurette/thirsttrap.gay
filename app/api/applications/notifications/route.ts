import { getPayload } from 'payload';
import config from '@/payload.config';
import { applicationGateway } from '@/lib/applications/gateway';

export const maxDuration = 60;
async function isAdmin(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  return user?.role === 'admin';
}

export async function GET(request: Request) {
  if (!(await isAdmin(request)))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return Response.json(await applicationGateway().notifications(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: 'Gateway unavailable' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin)
    return Response.json({ error: 'Invalid origin' }, { status: 403 });
  if (!(await isAdmin(request)))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();
    if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id))
      return Response.json(
        { error: 'Invalid application reference' },
        { status: 400 },
      );
    return Response.json(await applicationGateway().notify(id));
  } catch {
    return Response.json({ error: 'Gateway unavailable' }, { status: 503 });
  }
}
