# Thirst Trap

Next.js 16, Payload CMS, PostgreSQL, and a native multi-role application form.

## Local development

Use Node.js 22+ and pnpm. Run `pnpm install --frozen-lockfile`, configure `DATABASE_URI`, `PAYLOAD_SECRET`, and the existing Vercel Blob settings, then `pnpm dev`.

For a self-contained UI preview with **synthetic events and simulated form delivery**, run:

```sh
E2E_FIXTURES=1 DATABASE_URI=postgresql://fixture:fixture@127.0.0.1:5439/fixture PAYLOAD_SECRET=local-fixture-only-not-production pnpm dev
```

Fixture mode is disabled in production. Optional preview queries `?fixture=empty`, `one`, `portrait`, `landscape`, and `long` exercise layout states. These are test illustrations, not event announcements.

## Verification

```sh
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm exec playwright install chromium --only-shell
pnpm test:browser
pnpm build
```

The browser suite starts an isolated fixture server when none exists. Stop a normal development server on port 3000 before running it. Database-backed build/runtime checks require the normal environment; a build using a dummy URI proves compilation only, not a database connection.

Event policy tests cover New York scheduling, end cutoffs, drafts, feature selection, and complete listings. Intake tests run the actual Apps Script gateway against isolated persistent storage and controlled Google/Mail edges. The provider contract test is skipped by default and must be run against a real **test** spreadsheet before launch.

## Application delivery

Follow [Google gateway setup and recovery](integrations/google-apps-script/README.md). Required server variables are `APPLICATIONS_GATEWAY_URL` and `APPLICATIONS_GATEWAY_SECRET`. The Google deployment, its scopes, approved sending account, and a passing provider contract test are release prerequisites. The website does not claim success without confirmed sheet storage.

## Database migration

The optional event end timestamp and New York timezone columns for both date pickers are added by `20260925_001_event_end`. Existing timestamps are preserved; the editor displays them in New York time using [Payload’s timezone support](https://payloadcms.com/docs/fields/date#timezones). Before releasing against an existing database, back it up and run the repository's Payload migration workflow with production credentials (`pnpm payload migrate`). Check `payload migrate:status` before and after.

The production migration completed September 25, 2026 after a verified PostgreSQL archive backup. Migration status records it in batch 2; all original fields on the four existing events matched their pre-migration digest afterward. The private backup is stored outside the repository under `~/.codex/backups/thirsttrap.gay/` on the deploying Mac.

Specifications and ticket references live in [docs/tickets/event-site](docs/tickets/event-site/README.md); consequential integration choices are recorded in [ADR 0002](docs/adr/0002-signed-google-apps-script-gateway.md).
