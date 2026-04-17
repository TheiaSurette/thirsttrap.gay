import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Events } from './payload/collections/Events';
import { Media as MediaCollection } from './payload/collections/Media';
import { Users } from './payload/collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Support both DATABASE_URI and POSTGRES_URL (Supabase Vercel integration provides POSTGRES_URL)
const databaseUriRaw = process.env.DATABASE_URI || process.env.POSTGRES_URL;
if (!databaseUriRaw) {
  throw new Error('DATABASE_URI or POSTGRES_URL environment variable is required');
}

// Check if Supabase Storage is configured
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const hasStorageConfig = Boolean(
  process.env.SUPABASE_STORAGE_BUCKET &&
  process.env.SUPABASE_STORAGE_ACCESS_KEY_ID &&
  process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY &&
  process.env.SUPABASE_STORAGE_ENDPOINT
);

if (isProduction && !hasStorageConfig) {
  console.warn(
    '⚠️  Supabase Storage is not configured. Media uploads will fail in production.\n' +
      'Please set the following environment variables:\n' +
      '- SUPABASE_STORAGE_BUCKET\n' +
      '- SUPABASE_STORAGE_ACCESS_KEY_ID\n' +
      '- SUPABASE_STORAGE_SECRET_ACCESS_KEY\n' +
      '- SUPABASE_STORAGE_ENDPOINT\n' +
      'See env.example for setup instructions.'
  );
}

// Ensure Supabase connections use SSL properly
let databaseUri = databaseUriRaw;
const isSupabaseConnection = databaseUri.includes('supabase.com');
if (isSupabaseConnection) {
  if (databaseUri.includes('sslmode=require')) {
    databaseUri = databaseUri.replace('sslmode=require', 'sslmode=no-verify');
  } else if (!databaseUri.includes('sslmode=')) {
    const separator = databaseUri.includes('?') ? '&' : '?';
    databaseUri = `${databaseUri}${separator}sslmode=no-verify`;
  }
}

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Events,
    MediaCollection,
    Users,
  ],
  globals: [],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
    },
    push: process.env.VERCEL === '1' || process.env.NODE_ENV === 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  plugins: [
    s3Storage({
      collections: hasStorageConfig ? {
        media: {
          signedDownloads: process.env.SUPABASE_STORAGE_USE_SIGNED_URLS === 'true' ? {
            shouldUseSignedURL: () => true,
          } : undefined,
        },
      } : {},
      bucket: hasStorageConfig ? process.env.SUPABASE_STORAGE_BUCKET! : 'placeholder',
      config: {
        credentials: {
          accessKeyId: hasStorageConfig ? process.env.SUPABASE_STORAGE_ACCESS_KEY_ID! : 'placeholder',
          secretAccessKey: hasStorageConfig ? process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY! : 'placeholder',
        },
        region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
        endpoint: hasStorageConfig ? process.env.SUPABASE_STORAGE_ENDPOINT! : 'https://placeholder.supabase.co/storage/v1/s3',
        forcePathStyle: true,
      },
    }),
  ],
  sharp,
});
