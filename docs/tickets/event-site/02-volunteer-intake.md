# Native volunteer applications with reliable Sheets delivery

Published as [GitHub issue #3](https://github.com/TheiaSurette/thirsttrap.gay/issues/3) with `ready-for-agent`. GitHub is the work tracker; this is the publication snapshot.

## Parent

[Spec #1: Event-focused website and native applications of interest](https://github.com/TheiaSurette/thirsttrap.gay/issues/1)

## What to build

Deliver the first complete native application path: a volunteer can find Get involved, complete a styled two-step form, submit it, and see confirmation only when their application is saved to the existing Google Sheet. Failed and uncertain deliveries preserve the open form and can be retried without duplicate rows, including after a server restart.

Volunteer is the first fully working role slice. DJ, drag performer, vendor, and combinations are added by [#4: DJ, drag, vendor, and multi-role applications](https://github.com/TheiaSurette/thirsttrap.gay/issues/4); email notifications are added by [#5: Team email notifications with independent recovery](https://github.com/TheiaSurette/thirsttrap.gay/issues/5). Do not advertise unsupported roles as working in this interim slice. The native form uses the approved brand design and existing public shell, with no dependency on the homepage redesign. Add working navigation/homepage/empty-state entry points to whichever public layout exists when this ticket is implemented, and preserve normal public routes and Payload REST behavior.

Follow ADR 0001: direct confirmed delivery to Google Sheets, no accepted-application background queue or Payload application-review UI. Reuse the Node/Vitest setup for the public application-intake boundary; Google transport details stay behind that boundary.

## Acceptance criteria

- [ ] Visitors can reach Get involved through actual public navigation and a homepage entry point. The native page uses the approved dark/pink/violet palette, Geist field typography, visible labels, approximately 680px readable form column, generous control sizes, and responsive styling. It explains that submission expresses ongoing interest rather than confirming a booking or volunteer shift.
- [ ] About you collects name/stage name/business name, usable contact with Instagram preferred, event-series interest (Thirst Trap, spin-offs including Spill the Tea, or Both), optional referral source, and the volunteer role. Do not require an email address or applicant account.
- [ ] Your experience asks for a short description of volunteer interests/experience and assignment preferences: Monitoring, Door, Coat check, Setting up/breaking down, and Other. Require at least one preference and a description when Other is selected; welcome beginners explicitly.
- [ ] Browser and server validation require name, usable contact, event-series interest, the role, volunteer interests/experience, and assignment preferences. Reject whitespace-only required answers, invalid shapes, unknown selections, and excessive input sizes with useful field errors and an accessible error summary. Use proportional submission-abuse protection without exposing application data or secrets.
- [ ] Back preserves entered values. Pending submission prevents repeated clicks. Failed or uncertain submission keeps answers in the open form and offers Retry. Use Send application and Application received consistently; success requires confirmed storage, not merely receipt of a browser request.
- [ ] Write server-side to the configured existing spreadsheet titled “Thirst Trap Sign-Ups (Responses),” tab “Form Responses 1,” table “Form_Responses.” The exact destination is already recorded in the approved project plan. Keep credentials and configuration server-side; signed-in browser access is not a production integration credential.
- [ ] Verify headers before writing and preserve all existing responses, column meanings, formatting, and the linked Google Form. Create a timestamped row with A=timestamp, B=name, C=contact, D=event-series interest, E=referral, F=Volunteer, G–Q blank, R=volunteer interests/experience, and S=assignment preferences including Other text where supplied. Treat applicant input as literal spreadsheet data rather than formulas.
- [ ] Introduce stable submission identity and durable duplicate protection for concurrent requests, double clicks, and retries handled by a fresh server instance. An intentional new application produces a new timestamped row even when name/contact match an earlier application.
- [ ] Verify a concrete Google-compatible reconciliation mechanism for a write that succeeds but loses its response. Reconcile before retrying; if storage cannot be established, report recoverable uncertainty rather than success or another blind append. Do not treat process memory, browser button disabling, or a local ledger alone as proof of remote-write reconciliation.
- [ ] Any supporting delivery identifiers/status remain technical metadata, not a second review system or an application backlog. Preserve the existing response table; a reconciliation approach requiring an incompatible change must be resolved before production integration rather than silently altering the sheet.
- [ ] Keep the original Google Form open and existing links working. Direct Sheet writes are not represented as Google Forms responses. Do not migrate old data or grant new sharing permissions implicitly.
- [ ] At the confirmed public submission boundary, exercise real validation, normalization, mapping, and orchestration with Google faked only at the external edge. Use a real isolated store to substantiate persistence/concurrency behavior. Verify malformed/invalid inputs produce no writes, and valid volunteer applications produce exactly the intended row.
- [ ] Test Google failure, double clicks, concurrent retries, a remote write followed by a lost response, retry in a fresh server instance, and intentional repeat applications. Add browser checks for the complete volunteer flow, back/edit, validation, retained values after error, and keyboard/mobile accessibility.
- [ ] Prove actual Google append and retry-reconciliation behavior against a dedicated test copy with the same structure. Missing credentials or unverified transport behavior must be recorded as a real prerequisite, never counted as a successful integration check. Keep automated submissions out of the live response sheet.
- [ ] Document necessary runtime configuration and secure provisioning without recording secrets. Use the existing Warp-based convention if the user must enter sensitive values. Run appropriate checks and retain evidence that the end-to-end role slice works before marking complete.

## Blocked by

None (can start immediately). Google write credentials and an isolated test destination are external prerequisites to final integration verification, not dependencies on the homepage ticket.
