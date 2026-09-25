import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "end_date" timestamp(3) with time zone;`,
  );
  await db.execute(sql`
    CREATE TYPE "public"."enum_events_date_tz" AS ENUM ('America/New_York');
    CREATE TYPE "public"."enum_events_end_date_tz" AS ENUM ('America/New_York');
    ALTER TABLE "events"
      ADD COLUMN "date_tz" "public"."enum_events_date_tz" DEFAULT 'America/New_York' NOT NULL,
      ADD COLUMN "end_date_tz" "public"."enum_events_end_date_tz" DEFAULT 'America/New_York' NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "events" DROP COLUMN IF EXISTS "end_date";`);
  await db.execute(sql`
    ALTER TABLE "events" DROP COLUMN "date_tz", DROP COLUMN "end_date_tz";
    DROP TYPE "public"."enum_events_date_tz";
    DROP TYPE "public"."enum_events_end_date_tz";
  `);
}
