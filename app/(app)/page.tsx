import { connection } from 'next/server';
import { loadEventDiscovery } from '@/lib/events/repository';
import HomePage from './HomePageView';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ fixture?: string }>;
}) {
  await connection();
  const events = await loadEventDiscovery((await searchParams).fixture);
  return <HomePage {...events} />;
}
