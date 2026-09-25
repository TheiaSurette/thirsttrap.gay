import * as eventEnd from './20260925_001_event_end';
import * as migration_20260228_001329_add_events_collection from './20260228_001329_add_events_collection';

export const migrations = [
  // Keep migrations in chronological order.
  {
    up: migration_20260228_001329_add_events_collection.up,
    down: migration_20260228_001329_add_events_collection.down,
    name: '20260228_001329_add_events_collection',
  },
  { up: eventEnd.up, down: eventEnd.down, name: '20260925_001_event_end' },
];
