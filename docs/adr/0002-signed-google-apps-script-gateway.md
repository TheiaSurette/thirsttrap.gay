# Signed Apps Script gateway for confirmed application delivery

Status: implemented; real-provider contract verification is still a release prerequisite.

The Next.js server sends validated applications to one Google Apps Script deployment owned by a team-controlled Google account. That deployment can write the designated response sheet and send mail through MailApp. It has no applicant-facing UI. HMAC signatures and a five-minute request window authenticate every operation; no Google credentials or gateway secret reach the browser.

A ScriptLock serializes native intake across all website instances. A Sheets `appendCells` batch writes the complete row and its identity/fingerprint in the timestamp cell's note together. Values use `stringValue`, so applicant text cannot become a spreadsheet formula. Existing columns, records, and the original Google Form remain unchanged. Deployment checks all 19 headers before operating.

A ScriptProperties marker is persisted before an append. Retries reconcile against the note. If an append times out and the note is absent, the marker prevents another append: an absent row at one instant does not prove that an in-flight mutation cannot commit later. The applicant sees an unresolved delivery with a reference, not false success. An operator must investigate a permanently unresolved operation. This favors duplicate protection over automatically recovering a definitely failed append without evidence.

Notification state lives in the same note and is independent of sheet delivery. MailApp uses the deploying Google account as sender; `contact@thirsttrap.gay` is the recipient, not an assumed sender. Quota/configuration failures before sending are retryable. An ambiguous send is recorded as uncertain and is not automatically resent. Administrators can list outstanding notifications and retry definite failures without appending an application.

Only one gateway project may serve a response sheet: locks do not cross Apps Script projects. Do not strip timestamp notes or reorder/delete response rows during active writes; use filter views for review. These technical notes are part of delivery identity and must be retained with backups. A permanent unknown append requires investigation rather than deleting its pending marker on a timer. Google Forms writes use their own path and do not receive native notification notes.

This avoids an additional application database and service-account key while preserving ADR 0001's direct-delivery boundary. It adds a separately deployed Google component and operational limits (Apps Script execution quotas, mail quota, response-sheet scan). The website fails honestly if any dependency is unavailable. Isolated emulation tests exercise the actual gateway script; they do not establish Google's real locking/append behavior. The opt-in provider contract test and controlled inbox check must pass before launch.

References: [Apps Script locks](https://developers.google.com/apps-script/reference/lock/lock-service), [atomic Sheets batch updates](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate), [web app deployment](https://developers.google.com/apps-script/guides/web).
