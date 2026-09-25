# DJ, drag, vendor, and multi-role applications

Published as [GitHub issue #4](https://github.com/TheiaSurette/thirsttrap.gay/issues/4) with `ready-for-agent`. GitHub is the work tracker; this is the publication snapshot.

## Parent

[Spec #1: Event-focused website and native applications of interest](https://github.com/TheiaSurette/thirsttrap.gay/issues/1)

## What to build

Extend the working native volunteer application into the complete multi-role application of interest. People can select DJ, drag performer, vendor, volunteer, or combinations; enter shared information once; answer only relevant questions; and submit one complete row through the already-proven delivery path.

Reuse the public application-intake boundary and durable submission identity from [#3: Native volunteer applications with reliable Sheets delivery](https://github.com/TheiaSurette/thirsttrap.gay/issues/3). Keep Google Sheets as the review destination under ADR 0001, preserve volunteer behavior, and leave team email delivery to [#5: Team email notifications with independent recovery](https://github.com/TheiaSurette/thirsttrap.gay/issues/5). This ticket does not wait for the homepage redesign or team-notification implementation.

## Acceptance criteria

- [ ] The two-step native form supports multiple role checkboxes for DJ, drag performer, vendor, and volunteer. Show selected role groups in that order and identify the required fields clearly; enter shared name/contact/event-series interest/referral only once.
- [ ] DJs can enter experience length, required musical interests/specialization, optional work examples, and optional typical rate. Drag performers can enter experience length, required performance description, optional work examples, and optional typical rate. Vendors can enter required products, optional prior vending experience, and optional work examples.
- [ ] Preserve required volunteer experience/interests, at least one assignment preference, and conditional Other description. Vendor selection does not reveal or require volunteer questions unless Volunteer is also selected.
- [ ] Require at least one role and a short description for every selected role on both client and server. Beginners can apply: prior experience, portfolios, rates, and referral source are not prerequisites. Rates accept ranges/context; work examples accept social handles or URLs; contact is not limited to email.
- [ ] Navigation back preserves answers. Role changes show/hide the relevant groups without making unrelated fields required. The server normalizes current role selections and excludes stale answers for deselected roles from sheet delivery.
- [ ] A successful application creates one row containing every selected role in F and their corresponding answers: G–J DJ experience/music/examples/rate; K–N drag experience/performance/examples/rate; O–Q vendor products/experience/examples; R–S volunteer interests/assignment preferences. Shared information stays in A–E, and unselected-role columns remain blank.
- [ ] Preserve the existing work-example/rate headers and their numeric suffixes, literal-data handling, original Google Form connection, existing rows, and the original volunteer flow. Introduce no extra role-specific application records or account/edit flow.
- [ ] Reuse direct confirmed delivery, durable duplicate protection, recoverable-error behavior, and intentional repeat-application semantics. Editing answers after an uncertain delivery cannot silently reuse an identity for different contents; reconcile the earlier attempt before treating materially changed content as a new application.
- [ ] Update the Get involved explanation, public navigation/homepage callout, and success/error copy to reflect all four supported roles, preserving any existing shared-layout work from [#2: Upcoming-event homepage with animated word wall](https://github.com/TheiaSurette/thirsttrap.gay/issues/2).
- [ ] Test each role alone, representative combinations, and all four together through the public intake boundary. Assert actual complete rows, per-role required validation, deselected-role exclusion, optional field handling, and no writes for invalid requests. Preserve the delivery failure/retry regression coverage from the first slice.
- [ ] Browser verification covers selecting/changing combinations, long multi-role forms, step navigation, error focus, beginners, mobile widths down to 320px, keyboard/screen-reader labels, and successful/failed submission. Use the established external test destinations rather than real applicant records.
- [ ] Run appropriate type/lint/build checks and tests. The complete native form is demoable without the notification ticket; notification failures, if that ticket has already landed, continue to be independent of application storage.

## Blocked by

- [#3: Native volunteer applications with reliable Sheets delivery](https://github.com/TheiaSurette/thirsttrap.gay/issues/3): Native volunteer applications with reliable Sheets delivery. It supplies the working form, public intake boundary, real row delivery, and durable retry semantics this ticket extends.
