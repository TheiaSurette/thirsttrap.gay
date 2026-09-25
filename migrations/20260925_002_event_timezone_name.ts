import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from '@payloadcms/db-postgres';

// Payload generates endDate_tz, whose database name is enddate_tz.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" RENAME COLUMN "end_date_tz" TO "enddate_tz";
    ALTER TYPE "public"."enum_events_end_date_tz" RENAME TO "enum_events_enddate_tz";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" RENAME COLUMN "enddate_tz" TO "end_date_tz";
    ALTER TYPE "public"."enum_events_enddate_tz" RENAME TO "enum_events_end_date_tz";
  `);
}
