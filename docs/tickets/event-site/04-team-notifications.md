# Team email notifications with independent recovery

Published as [GitHub issue #5](https://github.com/TheiaSurette/thirsttrap.gay/issues/5) with `ready-for-agent`. GitHub is the work tracker; this is the publication snapshot.

## Parent

[Spec #1: Event-focused website and native applications of interest](https://github.com/TheiaSurette/thirsttrap.gay/issues/1)

## What to build

After a native application is saved to the existing Google Sheet, notify contact@thirsttrap.gay with a brief email linking to that sheet. Applicants receive the same confirmed-storage success whether email succeeds or fails; the team can identify and recover notification failures without creating another application row.

Build on the confirmed storage result and stable submission identity from [#3: Native volunteer applications with reliable Sheets delivery](https://github.com/TheiaSurette/thirsttrap.gay/issues/3). This applies to any role the intake boundary currently supports and is independent of the multi-role expansion and homepage redesign. Follow ADR 0001 and retain the public application-intake boundary as the main test seam.

## Acceptance criteria

- [ ] A confirmed new native application triggers one brief team notification to contact@thirsttrap.gay with a link to the configured Google Sheet. Keep applicant names, contact details, experience, portfolios, and rates out of the message.
- [ ] The browser shows Application received after confirmed sheet storage. Notification failure does not convert that result to an applicant-facing submission failure, ask the applicant to resubmit, or append another row.
- [ ] Use the stable submission identity to track notification delivery separately from application storage and avoid repeat notifications when the same application is retried. Intentional new applications receive their own notifications.
- [ ] Provide authenticated operational visibility and an independently callable notification retry path that reuses the stored delivery identity and sheet link. Record failures without logging applicant answers or exposing credentials. Retrying notification delivery never invokes the application-creation path.
- [ ] Handle transport uncertainty using the selected provider's documented behavior and stable message identity where supported; a retry must not blindly repeat a known successful send. Explain any unresolved provider delivery state operationally while preserving the application's successful result.
- [ ] Configure a verified sending identity and server-side credentials. The destination contact@thirsttrap.gay is not automatically assumed to be a configured sender or permission to access the mailbox.
- [ ] Send no applicant confirmation emails and promise no response time or booking. Leave the original Google Form and its existing notification behavior untouched; adding native notifications does not claim to cover legacy submissions.
- [ ] At the public application-intake boundary, verify validation failure and sheet failure send no email; sheet success sends the correct minimal notification; email failure leaves application success intact; retrying the application does not duplicate its row or known-successful notification; and retrying a failed notification does not rewrite application data.
- [ ] Exercise persistent notification state and recovery across a fresh server instance, rather than relying only on in-memory mocks. Keep real validation/orchestration inside the tests and fake the email transport at its external edge.
- [ ] Verify real provider delivery to a controlled test recipient with isolated application data. Automated checks must not repeatedly email the live team inbox or submit to the live applicant sheet. Record missing credentials or sender verification as explicit integration prerequisites.
- [ ] Browser verification confirms the applicant sees storage success even when email fails. Run appropriate type/lint/build checks and regression tests for both working role subsets and all roles if [#4: DJ, drag, vendor, and multi-role applications](https://github.com/TheiaSurette/thirsttrap.gay/issues/4) has already landed.

## Blocked by

- [#3: Native volunteer applications with reliable Sheets delivery](https://github.com/TheiaSurette/thirsttrap.gay/issues/3): Native volunteer applications with reliable Sheets delivery. It supplies confirmed storage, stable submission identity, and the public intake boundary.
