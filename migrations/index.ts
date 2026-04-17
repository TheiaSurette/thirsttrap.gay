import * as migration_20260228_001329_add_events_collection from './20260228_001329_add_events_collection';

export const migrations = [
  {
    up: migration_20260228_001329_add_events_collection.up,
    down: migration_20260228_001329_add_events_collection.down,
    name: '20260228_001329_add_events_collection'
  },
];
