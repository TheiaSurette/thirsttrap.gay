# Event-focused website and native applications of interest

Product decisions and the testing boundaries below are confirmed by the user. This specification is ready for implementation planning.

Implementation refinements confirmed on 2026-09-25 supersede the corresponding visual details below: Get involved uses a solid primary navigation button; straight right arrows replace diagonal up-right arrows; decorative taglines and repeated slogans are removed; the separate About page/navigation item and redundant homepage About section are removed, with old `/about` links redirected to the homepage. The animated word wall remains. Applicants no longer select an event series; the legacy sheet column stays blank for native submissions, and existing responses remain unchanged.

## Problem Statement

Thirst Trap's existing website has a distinctive identity, but its fullscreen introduction and scroll-triggered screen transition delay access to event information. Published events can remain visible after they end, the homepage does not guarantee a featured event, and additional featured flags can hide events from the smaller listing. Visitors need a conventional landing page that quickly answers what is happening, when, where, and how to get tickets while keeping the site's queer nightlife identity and animated word wall.

People who want to DJ, perform drag, vend, or volunteer currently use a separate Google Form. The website needs a styled, accessible application flow that supports multiple roles, validates answers, and delivers them to the team's existing Google Sheet without requiring a new review system. Applicants need honest delivery feedback, and organizers need a notification when a native application arrives.

## Solution

Present one large featured event immediately below shared navigation, with any other upcoming events in smaller cards below it. Keep the existing logo, Mega Monster lettering, pink/violet palette, and animated word wall. Use ordinary vertical scrolling, readable information, complete event artwork, clear ticket actions, and responsive layouts. Hide past events from listings while retaining their direct links with an ended state. When there are no upcoming events, show the brand, an honest announcement placeholder, Instagram, and Get involved.

Provide a two-step native Get involved form. Applicants enter shared information once, select one or more roles, and answer only the relevant questions. The server validates the application and saves one row to the existing Google Sheet. Success requires confirmed sheet delivery. Recoverable failures preserve the open form and offer a retry without creating duplicate rows. Send a brief email to contact@thirsttrap.gay after successful storage, linking to the sheet without including applicant details. The original Google Form remains open initially for existing links.

## User Stories

1. As a visitor, I want the featured event visible when I arrive, so that I can understand the next opportunity to attend without discovering a scroll interaction.
2. As a visitor, I want familiar navigation to events, About, and Get involved, so that I can reach the part of the site I need.
3. As a returning visitor, I want the existing logo, expressive typography, colors, and animated word wall retained, so that the site still feels like Thirst Trap.
4. As a visitor, I want normal page scrolling, so that navigation works predictably with a mouse, keyboard, or touch screen.
5. As a visitor, I want the complete featured flyer visible, so that embedded artwork and information are not cropped away.
6. As a visitor, I want the event title, date, time, venue, and short description presented as readable text, so that I do not have to decipher a flyer to make a decision.
7. As a visitor, I want a prominent ticket action when a ticket link exists, so that I can purchase tickets with minimal navigation.
8. As a visitor, I want an event-details action when no ticket link exists, so that I can still learn how to attend.
9. As a visitor, I want other upcoming events displayed in chronological order below the feature, so that I can compare my options.
10. As an organizer, I want to select a later flagship event as featured, so that promotion is not restricted to the nearest event.
11. As a visitor, I want a manually featured later event labeled accurately, so that I do not mistake it for the next chronological event.
12. As an organizer, I want the earliest upcoming event featured when I have not selected one, so that the homepage always has a useful focus.
13. As a visitor, I want each upcoming event shown once even when multiple events are marked featured, so that no event disappears or appears twice.
14. As a visitor, I want currently running events to remain discoverable until they end, so that I can still find attendance details during the night.
15. As an organizer, I want to specify an event's end time, so that overnight events expire at an appropriate time.
16. As a visitor, I want event dates interpreted in Lowell's local timezone, so that the displayed day and time match the event rather than the server's location.
17. As a visitor, I want ended events removed from public listings automatically, so that old announcements do not look current.
18. As someone following an old link, I want its event page to remain available and clearly marked ended, so that I understand what happened and can find upcoming events.
19. As a visitor, I want an honest empty state when nothing is announced, so that I can follow Instagram or get involved without being shown a past event as upcoming.
20. As a mobile visitor, I want the event title, date, venue, and main action before a tall flyer, so that essential information is available quickly.
21. As a visitor using a narrow screen, I want content and controls to fit without horizontal scrolling, so that the site remains usable on my device.
22. As a keyboard user, I want visible focus and usable navigation, buttons, and form controls, so that I can complete the same tasks without a pointer.
23. As a visitor sensitive to motion, I want the word wall to respect reduced motion and offer pause/resume, so that I can read comfortably.
24. As a screen-reader user, I want decorative words excluded from the reading order, so that event information is not buried under repeated background text.
25. As a prospective applicant, I want Get involved discoverable from navigation and the homepage, so that I can find opportunities to contribute.
26. As an applicant, I want the form to explain that I am expressing ongoing interest, so that I do not mistake submission for a confirmed booking or assigned shift.
27. As an applicant, I want to provide my name, stage name, or business name, so that I can use the identity relevant to my application.
28. As an applicant, I want to provide an Instagram handle or another contact method, so that I am not forced to supply an email address.
29. As an applicant, I want to indicate interest in Thirst Trap, spin-offs such as Spill the Tea, or both, so that organizers understand which event series interest me.
30. As an applicant, I want to select multiple roles, so that I do not have to repeat shared information in separate applications.
31. As an applicant, I want only the questions for my selected roles shown, so that I do not answer unrelated questions.
32. As a DJ, I want to describe my musical interests, experience, examples, and rate, so that organizers can understand my work.
33. As a drag performer, I want to describe my performances, experience, examples, and rate, so that organizers can assess fit for future events.
34. As a vendor, I want to describe my products, vending experience, and work examples, so that organizers can understand what I would bring.
35. As a volunteer, I want to describe my interests or experience and choose assignment preferences, so that organizers can consider suitable ways for me to help.
36. As a volunteer, I want an Other assignment preference with room to explain it, so that I can express interests beyond the listed tasks.
37. As a beginner, I want to apply without a portfolio, prior experience, or fixed rate, so that the form does not exclude me before the team considers my interests.
38. As an applicant, I want required questions and useful validation messages, so that I know what information is missing and how to fix it.
39. As an applicant, I want to go back without losing my answers, so that I can correct shared information or selected roles.
40. As an applicant, I want answers for deselected roles excluded from submission, so that I send only my current choices.
41. As an applicant, I want my answers preserved after a submission failure, so that I can retry without completing the form again.
42. As an applicant, I want confirmation only when the application is saved, so that success means the team can actually review it.
43. As an applicant, I want double clicks and interrupted-response retries to create at most one row for the same application, so that an uncertain network result does not duplicate my submission.
44. As a returning applicant, I want to submit a new application without an account, so that I can provide updated interests or rates later.
45. As an organizer, I want intentional repeat applications preserved as timestamped rows, so that I have the history rather than automatic overwrites based on a name or handle.
46. As an organizer, I want native applications in the existing response tab and corresponding columns, so that I can continue the established review workflow.
47. As an organizer, I want one row per application containing every selected role's answers, so that one person's application stays together.
48. As an organizer, I want existing responses and the original Google Form preserved, so that old links and records remain useful.
49. As an organizer, I want a brief email at contact@thirsttrap.gay when a native application is saved, so that I know there is new work to review.
50. As an applicant, I want email-notification problems handled separately from application storage, so that I am not asked to resubmit an application already saved.
51. As an applicant, I want my contact details and answers kept out of public site content and notification emails, so that they are available only in the intended review workflow.
52. As an organizer, I want invalid or abusive submissions rejected before they reach the sheet, so that the review workflow remains usable.

## Implementation Decisions

### Architecture and scope

- Extend the existing Next.js and Payload application. Payload remains responsible for event content, media, and the existing staff access model; Google Sheets remains the application-review destination.
- Follow ADR 0001, “Native applications with Google Sheets as the review destination.” Add no Payload application-review interface and no background backlog of accepted applications waiting for Google delivery.
- Consolidate the public navigation and footer so home, About, event details, and Get involved use the same navigation and visual system.
- Introduce a native application-intake boundary that owns server validation, selected-role normalization, delivery identity, sheet delivery, and notification orchestration. Keep Google and email transport details behind this boundary rather than coupling them to form components.
- Preserve the existing Payload REST behavior when adding native form submission handling.

### Visual design and behavior

- Use the approved “Club flyer, clear information” direction: large complete flyer beside an expressive event title and readable event details, with a narrow hot pink date strip and approximately 55% artwork / 45% text on larger screens.
- Preserve the existing logo and Mega Monster display type. Use Mega Monster Italic for event titles and restrained section headings, and the existing Geist family for body copy, navigation, labels, and controls.
- Use these palette tokens: Midnight #050410, Aubergine #191126, Hot pink #FF00AE, Violet #8B5CF6, Ice #EEEDF5, and Lavender #B7ADC8. Main pink buttons use dark text; important information uses readable solid foreground colors.
- Aim for approximately 1160px maximum content width, 20px mobile gutters, 24–40px desktop gutters, generous section spacing, and controls at least 48px high. Use an approximately 680px form column. Verify contrast in the rendered layout.
- Retain the existing animated word wall with slow alternating rows behind the opening event section. Keep event content readable over a darkened background. The wall is decorative, does not intercept input or control page scrolling, and is static under reduced-motion preferences. Provide an accessible pause/resume control.
- Replace the fullscreen intro and screen-switching interaction with normal vertical flow. Essential event content appears without waiting for an animation or client interaction. Omit the separate moving ticker and pulsing star decorations.
- Preserve full flyer contents and natural proportions rather than cropping text-heavy art. Accommodate portrait, landscape, missing artwork, and long event titles without breaking the layout. Missing artwork uses the existing brand identity rather than invented event imagery.
- On mobile, place title, date, venue, and the primary action before the full flyer. Use compact navigation and stacked smaller event rows; verify the layout down to 320px.
- Follow the event area with a Get involved panel, a short community/About statement, and readable Instagram and community links.

### Event eligibility and selection

- Use raw timestamps for eligibility and ordering. Display and interpret local event scheduling using America/New_York explicitly, including daylight-saving changes.
- Add an optional end timestamp, validated to follow the start timestamp. When it is absent, use the agreed 6 AM local cutoff after the event's scheduled night. For starts before 6 AM, that night's fallback is 6 AM on the same local calendar day; for starts at or after 6 AM, it is 6 AM on the following local calendar day. An explicit end timestamp overrides the fallback.
- A published event is eligible until its effective end, including while it is running. At its effective end it becomes past. Draft events are never publicly listed or retrievable as published event details.
- Choose the earliest eligible event marked featured. If none is marked, choose the earliest eligible event. If timestamps tie, use a stable identity tie-breaker.
- Include every other eligible event in chronological order, excluding only the selected event identity. Additional featured flags never suppress eligible events.
- Label a later manually selected hero “Featured event”; use “Up next” only when it is the next chronological eligible event.
- Carry venue, raw timing, description, image, and meaningful ticket/action information into the homepage presentation. Use Get tickets for a real ticket destination and Event details when there is none; do not guess ticket links from unrelated event URLs.
- Apply eligibility before any result limit so past records cannot crowd upcoming records out of the query. Ensure the supported listing covers all eligible events rather than silently truncating at the old fixed limit.
- Re-evaluate eligibility on requests using bounded cache freshness, with a five-minute freshness target, and invalidate relevant data when content changes. No page may keep expired events indefinitely because it relies only on a content-update hook.
- With one event, show only its feature. With no eligible events, show “The next party is in the works,” the logo, Instagram, and Get involved. Hide the empty smaller-events section.
- Retain old event URLs. Ended pages clearly state the event has ended and replace ticket actions with a route to upcoming events. No public past-event listing or archive navigation is introduced.

### Native form and validation

- Use two steps: About you and Your experience. This is an ongoing application of interest, not an application to a particular scheduled event, a booking, or a volunteer assignment.
- Shared fields: name/stage name/business name; contact with Instagram preferred; event-series interest in Thirst Trap, spin-offs including Spill the Tea, or Both; optional referral source; and one or more selected roles.
- Roles are DJ, drag performer, vendor, and volunteer. Use checkboxes for multiple roles and show question groups in that order. Shared answers are entered once.
- DJ questions cover experience length, musical interests/specialization, work examples, and typical rate. Drag questions cover experience length, performance description, work examples, and typical rate. Vendor questions cover products, prior vending experience, and work examples. Volunteer questions cover experience/interests and assignment preferences.
- Volunteer assignment preferences are Monitoring, Door, Coat check, Setting up/breaking down, and Other. Other reveals a description field.
- Require shared name, usable contact, event-series interest, at least one role, and a short description for every selected role: music interests for DJs, performances for drag, products for vendors, and experience/interests for volunteers. Require at least one volunteer assignment preference and descriptive text for Other when selected.
- Welcome beginners explicitly; previous experience is not a prerequisite. Work examples, rates, referral source, and experience length remain optional. Rates accept ranges or context, and work examples accept social handles as well as URLs. Contact is not restricted to email.
- Validate in the browser for immediate feedback and again on the server as authoritative validation. Reject whitespace-only required answers, unknown selections, invalid request shapes, and excessive input sizes with useful errors. Validation establishes usable contact input, not ownership of a social account or guaranteed deliverability.
- Keep field labels visible, indicate required fields, associate errors with controls, and provide an accessible error summary. Preserve values when navigating back or recovering from a failure. Exclude answers for deselected roles from the normalized submitted application.
- Use Send application as the final action. Prevent repeated clicks while a request is pending, while enforcing duplicate protection on the server as well.

### Sheet delivery contract

- Deliver server-side to the user-selected existing spreadsheet, titled “Thirst Trap Sign-Ups (Responses),” tab “Form Responses 1,” existing table “Form_Responses.” Keep the spreadsheet identifier, write credentials, and transport configuration server-side. The exact destination supplied during planning is retained in the local project plan and deployment configuration.
- Preserve existing rows, column meanings, formatting, and the legacy Google Form connection. The native form is not an embed and must not submit through undocumented Google Forms endpoints. Direct row creation is not a Google Forms response.
- Create one timestamped row per application. Use the following established column mapping, validating the target structure before writes rather than trusting a changed sheet blindly:

| Column | Value |
| --- | --- |
| A | Submission timestamp |
| B | Name/stage name/business name |
| C | Contact |
| D | Event-series interest |
| E | Optional referral source |
| F | All selected roles |
| G | DJ experience length |
| H | DJ musical interests/specialization |
| I | DJ work examples |
| J | DJ typical rate |
| K | Drag experience length |
| L | Drag performance description |
| M | Drag work examples |
| N | Drag typical rate |
| O | Vendor products |
| P | Vending experience |
| Q | Vendor work examples |
| R | Volunteer experience/interests |
| S | Volunteer assignment preferences, including Other description where supplied |

- Leave unselected-role columns blank. Preserve the existing distinct work-example and rate headers, including their numeric suffixes. Store applicant-entered values as literal data rather than executable spreadsheet formulas.
- Keep legacy form submissions working alongside native submissions. Preserve every intentional new application as a new row, including submissions with the same name or contact. There is no applicant account or edit-existing-application flow.
- Distinguish an intentional new application from retries of the same application with a stable submission identity. Duplicate protection must survive concurrent requests and server restarts; disabling a browser button or using process memory alone is insufficient.
- Account for an uncertain delivery result: a write may succeed before its response is lost. Reconcile the stable submission identity before repeating a write; do not blindly append after a timeout. If the result cannot be confirmed, preserve the applicant's answers and explain the recoverable uncertainty rather than claiming success or adding another row.
- Minimal technical delivery identifiers/status are allowed for duplicate protection. They must not create a second application-review destination or an accepted-application background queue. The concrete reconciliation mechanism must be verified against the existing sheet and chosen Google integration before production writes; the spec does not authorize destructive restructuring of the response table.
- Return Application received only after confirmed sheet storage. On failed delivery, keep values in the open form and offer Retry. Do not depend on browser-only validation, log applicant answers unnecessarily, or expose application records through public APIs.

### Team notification contract

- After a native application is confirmed saved, send a brief notification to contact@thirsttrap.gay containing a link to the Google Sheet. Keep names, contact details, descriptions, portfolios, and rates out of the email.
- The notification recipient is not automatically the sending identity. Configure a verified sender through the selected email transport; retain credentials on the server.
- Track notification success/failure independently from sheet delivery. An email failure does not turn a saved application into an applicant-facing submission failure and must not prompt another sheet write. Provide operational visibility and a safe notification retry path without re-submitting the application.
- Avoid duplicate notifications when the same submission is retried. The native notification path does not imply notifications for submissions made directly through the legacy Google Form.
- Applicant confirmation stays on the website; no applicant confirmation email or response-time promise is added.

## Testing Decisions

The following testing boundaries are confirmed. Tests should exercise observable behavior with realistic inputs and assert outputs or external effects, not internal function order, private helpers, implementation-shaped snapshots, or CSS class names.

### Boundary 1: event discovery

- Reuse the existing event-loading boundary and shape it into a cohesive event-discovery interface that supplies homepage and event-detail behavior. Keep eligibility, ordering, feature selection, and local-time rules together rather than exposing every helper as a test target.
- Use controlled event records and an injectable clock at the repository/time edges. Exercise real event policy and formatting behavior inside the boundary.
- Cover no/one/many events, no/manual/multiple featured flags, expired featured flags, draft exclusion, stable ties, missing images/links/venue, and more old records than the current query limit.
- Cover before-start, currently-running, exact-end, optional-end, overnight, before-6-AM starts, and daylight-saving boundaries in America/New_York. Verify ended-page behavior and bounded time-driven refresh separately from content-edit invalidation.

### Boundary 2: application intake

- Exercise the server's public submission entry point as the main application test seam. Keep real validation, role selection, normalization, column mapping, delivery orchestration, and result handling inside the test boundary.
- Replace Google and email transports with controlled fakes at the external edges. Use a real isolated store where persistence/concurrency behavior is necessary to substantiate duplicate protection; a mock that simply returns a desired deduplication result is insufficient.
- Cover each role and all meaningful combinations, required and optional fields, beginners, flexible contacts/rates/work examples, Other descriptions, malformed selections, whitespace, input limits, deselected-role exclusion, and literal spreadsheet text handling.
- Assert the observable row contents and notification destination/body. Invalid input must produce useful errors and no remote writes or emails. Valid input must target the configured existing sheet without changing unrelated cells.
- Simulate write failures, concurrent identical requests, a successful write followed by a lost response, and a retry handled by a fresh server instance. The same application creates one row; an intentional later application creates a new row.
- Simulate email failure after sheet success. The application remains successful, notification delivery is recoverable independently, and retries do not create new rows or duplicate successful notifications.

### Browser verification and external integration checks

- Keep a small browser suite above those boundaries for the complete visitor/application experience: featured content on arrival, ordinary scrolling, smaller event cards and empty states, old links, navigation, all form role groups, back/edit behavior, validation, success, and retained answers after a retryable error.
- Verify representative desktop and mobile sizes, including 320px, with portrait/landscape/missing flyers and long titles. Inspect contrast, unclipped artwork, wrapping, focus order, keyboard operation, screen-reader labels/errors, word-wall pause/resume, and reduced-motion behavior. Verify essential event content is available without client interaction.
- Use isolated fixtures and controlled external transports for automated tests. Verify actual Google append/reconciliation behavior against a dedicated test copy with the same structure, and use a controlled email recipient for provider delivery checks. Keep automated tests out of the live applicant sheet and team inbox.
- A provider contract test is necessary to establish that the chosen deduplication strategy survives real Google behavior; tests using fakes alone cannot establish this. Missing credentials or an unverified transport remain an explicit delivery prerequisite, not a passing integration result.

### Prior art and checks

- The repository already has Vitest configured for Node-based tests with a project import alias and scripts for focused/full test runs. No tracked application test cases or configured browser test suite were found during inspection; there is no established component-test pattern to preserve.
- Reuse Vitest for the two behavior boundaries and add only the browser harness needed for the critical rendered flows. Keep type checking, linting, the production build, focused tests during implementation, and the full suite at completion as checks appropriate to the changes.
- Introduce tests incrementally with implementation. Do not add tests that merely mirror reversible visual styling or assert the same mapping through duplicated implementation logic.

## Out of Scope

- Rebranding, replacing the logo or display type, removing the animated word wall, or restoring scroll-controlled screen transitions.
- A public past-event archive, deleting existing event records, or breaking old event URLs.
- Ticket checkout, payments, attendance registration, event booking, or volunteer shift assignment.
- Applying to specific scheduled events, applicant accounts, editing old submissions, or automatic record merging based on names/handles.
- A Payload application-review UI, migrating old responses, replacing Google Sheets, or closing the original Google Form at launch.
- A background queue that accepts applications before sheet delivery, applicant confirmation emails, or promises of booking or response time.
- Automatic changes to Google sharing permissions, mailbox access, collecting additional sensitive applicant data, or publicly exposing responses.
- Publicly releasing the implementation or writing test applications to the live response sheet as part of specification authoring.

## Further Notes

- Product and design decisions were agreed through the design interview, including retaining the animated word wall and notifying contact@thirsttrap.gay. The domain glossary and ADR 0001 are the terminology and decision references for subsequent tickets and implementation.
- Current code findings motivating this work: homepage loading includes all published events without an expiry filter; dates use implicit runtime timezone formatting; the feature is absent when none is flagged; excluding all featured flags from smaller events can hide additional events; event data is cached without a time-based freshness interval; and no native application intake or Google/email integration is present in the inspected implementation.
- The source Google Form and destination sheet headers were inspected during planning. Connected Google Drive access returned a permission error, while the user's signed-in Zen session could read the destination. Browser access does not prove that a deployed application can write to Sheets.
- Google production write credentials, verified email transport/sender, and any technical persistence needed for retry reconciliation are implementation prerequisites. Use the existing secure interactive setup convention when a human must enter credentials; secrets never belong in issue bodies or chat.
- This specification is ready for division into independently verifiable vertical slices. Its GitHub issue receives the ready-for-agent label directly, without another triage pass.
