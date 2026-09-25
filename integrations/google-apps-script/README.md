# Google application gateway

**Not deployed or verified against Google yet.** The site needs this deployment and two server-side environment variables before real applications can be delivered. Run the provider check against a dedicated test spreadsheet and controlled inbox before connecting production. The legacy event-series column (D) stays in place but is blank for native submissions; the current form no longer asks that question.

## Deploy a test instance

1. Create an empty **test spreadsheet** with the same 19 headers as the response tab. Do not copy applicant rows. Confirm the headers against `Code.gs`; Google Form duplicate question labels have numbered suffixes in this sheet. Record its spreadsheet ID and response tab's numeric `gid`.
2. Open [Apps Script](https://script.google.com/) using a team-controlled account. Create a project. Copy `Code.gs` into its script file. In Project Settings, enable the manifest editor and replace `appsscript.json` with the supplied manifest. It enables the Sheets v4 advanced service and requests spreadsheet and send-mail scopes. It does not read the owner's email.
3. In Project Settings → Script properties, set:

   | Property | Test value |
   | --- | --- |
   | `SPREADSHEET_ID` | The isolated test spreadsheet ID |
   | `SHEET_ID` | The test response tab's numeric `gid` |
   | `NOTIFICATION_TO` | An inbox you control for test delivery |
   | `SHARED_SECRET` | At least 32 cryptographically random characters |

   Keep the shared secret in your password manager. Do not paste it into chat, GitHub, or logs. The same secret must be configured on the website server.
4. Deploy → New deployment → Web app. Execute as the deploying user. The owner must review and grant Google's requested spreadsheet and send-mail scopes. Choose access that permits unauthenticated HTTP requests, because the gateway authenticates each request with its HMAC signature. The public deployment URL does not permit unsigned reads or writes. Copy the URL ending in `/exec` (not `/dev`). Use exactly **one script project per spreadsheet**, since locks are scoped to the project.
5. The sending identity is the account that owns/executes the deployment. Confirm it is a team-approved sender. Test mail goes only to the controlled test inbox. Apps Script account policies and quotas can prevent this deployment; do not bypass an organization security policy or a browser security warning.

The UI labels above follow Google's web-app deployment documentation. If the account does not offer the necessary access option, use a supported team account or revise the transport explicitly; making the spreadsheet public is unnecessary.

## Verify the provider contract

Set these values in a secure, interactive terminal session:

- `RUN_GOOGLE_CONTRACT=1`
- `GOOGLE_TEST_GATEWAY_URL`
- `GOOGLE_TEST_GATEWAY_SECRET` (secret; hidden entry)
- `GOOGLE_TEST_SPREADSHEET_ID`
- `GOOGLE_TEST_NOTIFICATION_TO`

Run `pnpm exec vitest run tests/integration/google-contract.test.ts`. The test refuses the production sheet and team inbox. It writes **one synthetic test row** and sends **one notification to the configured test inbox**. It simulates a lost website response after a real append, retries through a fresh gateway client, issues concurrent retries, and checks one stored identity with a sent notification. Inspect the test row for literal text, all 19 columns, and the attached note. Confirm exactly one actual mail arrived with only the sheet link. The test leaves its synthetic row as evidence; it does not delete anything.

For this Mac, interactive secret entry belongs in Warp, using a narrowly scoped Launch Configuration pointing to a prepared script. Do not put secrets in shell history, command-line arguments, or chat. The scoped script should keep prompted secrets in memory, export only to the test subprocess, and exit afterward.

## Production configuration

After the test check passes, deploy the reviewed code in the single production gateway project, with these properties:

- `SPREADSHEET_ID=1VJp3nZzBRH260rGipYrwhPEYt46F4FQaWDhiAql79fM`
- `SHEET_ID=1808715276`
- `NOTIFICATION_TO=contact@thirsttrap.gay`
- `SHARED_SECRET`: a different production secret, shared only with the website server.

Set `APPLICATIONS_GATEWAY_URL` and `APPLICATIONS_GATEWAY_SECRET` as **server-only** hosting environment variables. Neither may use a `NEXT_PUBLIC_` prefix. Keep test and production projects/secrets separate. Deploy code updates as a new version of the existing production deployment; do not make parallel projects pointing to the same sheet.

The form's server action relies on Next.js same-origin protection and server validation. The gateway applies a honeypot upstream and limits new applications to 20 per client/hour and 300 globally/hour. Duplicate retries are checked before rate limiting. On Vercel the client key is an HMAC of the platform-controlled `x-vercel-forwarded-for`; other hosts share one conservative bucket unless an equivalent trusted proxy header is explicitly integrated. Never trust arbitrary client-supplied forwarding headers.

## Operations and recovery

Sign into the existing Payload admin as an administrator. While authenticated:

- `GET /api/applications/notifications` lists application references and outstanding notification states; it includes no applicant answers.
- `POST /api/applications/notifications` with JSON `{ "id": "APPLICATION_REFERENCE" }` and a same-origin `Origin` header retries notification delivery. A same-origin admin browser request can use the existing session cookie. It does not write another row. Never expose an admin token in a URL.

`pending` and `failed` notifications can be safely retried. `sent` is idempotent. `sending` or `uncertain` means delivery may already have happened: the gateway refuses automatic resend. Inspect the sending account/provider evidence first. If delivery is definitively known not to have happened, a trusted operator may change only that row's note `notification` field to `failed`, preserving its version, identity and fingerprint, then retry. If no definitive evidence exists, leave it uncertain.

If an applicant reports an unresolved application reference, inspect timestamp-cell notes for that ID. An existing matching note confirms storage. If it is absent, inspect the script's `pending:ID` property and execution/provider evidence. **Do not clear that marker merely because a timeout elapsed**; a delayed append must not race another write. Resolve a permanently failed mutation only after confirming no write remains in flight. Preserve identity notes in backups; avoid sorting/deleting response rows while intake writes are running. Use filter views to review applications.

Quota or schema failures remain applicant-facing retry states. Fix configuration/headers deliberately rather than changing existing response columns to fit this integration. New deployments must retain ScriptProperties and the sheet notes. Legacy Google Form submissions keep working but do not get native notification emails.
