import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Events } from './payload/collections/Events';
import { Media as MediaCollection } from './payload/collections/Media';
import { Users } from './payload/collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUri = process.env.DATABASE_URI;
if (!databaseUri) {
  throw new Error('DATABASE_URI environment variable is required');
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
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  sharp,
});
