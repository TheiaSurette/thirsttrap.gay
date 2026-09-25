# Upcoming-event homepage with animated word wall

Published as [GitHub issue #2](https://github.com/TheiaSurette/thirsttrap.gay/issues/2) with `ready-for-agent`. GitHub is the work tracker; this is the publication snapshot.

## Parent

[Spec #1: Event-focused website and native applications of interest](https://github.com/TheiaSurette/thirsttrap.gay/issues/1)

## What to build

Visitors arrive directly at a large featured event, see any other upcoming events below it, and can follow clear ticket or detail actions. Preserve Thirst Trap's identity and animated word wall while replacing the fullscreen intro and scroll-triggered screen switch with conventional navigation and normal page scrolling. Organizers can control the featured event and optional end time; expired events disappear automatically while old links remain useful.

This slice includes the event content changes, actual homepage and event-detail behavior, shared public presentation, and verification. Reuse the existing Next.js/Payload application and the event-loading boundary. Incorporate small refactors needed for the event-discovery interface within this slice rather than creating a separate infrastructure ticket. Application intake and its entry points are owned by [#3: Native volunteer applications with reliable Sheets delivery](https://github.com/TheiaSurette/thirsttrap.gay/issues/3); preserve those entry points if that ticket has already landed.

## Acceptance criteria

- [ ] The homepage presents a complete, uncropped event flyer and a large event title immediately below shared navigation, with readable date, time, venue, short description, and Get tickets when a real ticket destination exists; otherwise Event details is the main action. Long titles and missing image/venue/link data have coherent fallbacks.
- [ ] Retain the existing logo, Mega Monster display typography, Geist body typography, and approved Midnight #050410 / Aubergine #191126 / Hot pink #FF00AE / Violet #8B5CF6 / Ice #EEEDF5 / Lavender #B7ADC8 palette. Use the split flyer/details composition, narrow pink date strip, quieter supporting content, short community/About statement, and readable footer links described by the parent spec.
- [ ] Keep the animated word wall behind the opening event area with slow alternating rows, readable content above it, an accessible pause/resume control, static reduced-motion behavior, and decorative text excluded from the accessibility reading order. It never intercepts input, delays the event, or controls scrolling. Remove the extra moving ticker and pulsing star effects.
- [ ] Home, About, and event details share consistent navigation, spacing, and footer styling. Preserve any already-working native application entry points; this ticket does not create a dead link to an application route that is not yet available.
- [ ] Add an optional event end timestamp in the existing editor and persist it with appropriate schema/migration changes. Validate that an explicit end follows the start, while retaining compatibility with events lacking an end time.
- [ ] Interpret scheduling and display in America/New_York, including daylight-saving changes. Without an explicit end, a start before 6 AM expires at 6 AM the same local day; a start at or after 6 AM expires at 6 AM the next local day. Explicit end times override this fallback.
- [ ] Published events remain eligible until their effective end, including while running. Drafts and past events are absent from all public listings; drafts remain inaccessible through published event detail lookup.
- [ ] Select the earliest eligible featured event, or the earliest eligible event if none is flagged. Use a stable identity tie-breaker for equal starts. Show every remaining eligible event exactly once in chronological order, including other flagged events. Use Featured event when the hero is later than the next eligible event.
- [ ] Apply eligibility before limiting results so a backlog of past records cannot crowd out upcoming events. Cover all supported upcoming events rather than silently inheriting the old fixed limit.
- [ ] Refresh time-dependent eligibility with the approved five-minute freshness target and on content updates; homepage and detail pages do not stay stale indefinitely when time passes without an editor action.
- [ ] With one event, show its feature and no empty smaller-events heading. With none, show the brand, “The next party is in the works,” and Instagram; show the working Get involved entry point once [#3: Native volunteer applications with reliable Sheets delivery](https://github.com/TheiaSurette/thirsttrap.gay/issues/3) provides it. Never promote past or fabricated events to fill space.
- [ ] Existing past-event URLs still work, clearly show that the event ended, and replace ticket actions with a route to upcoming events. No public archive is added and no existing event records are deleted.
- [ ] At mobile widths, title/date/venue/action precede the full flyer; smaller cards stack appropriately. Verify 320px and representative desktop widths, portrait/landscape/missing artwork, long titles, keyboard operation, focus visibility, and contrast. Essential event content is visible without client interaction.
- [ ] Use the confirmed event-discovery test boundary with real policy and controlled records/clock. Cover zero/one/many events, manual/fallback/multiple feature flags, stable ties, expired features, draft exclusion, large past-record backlogs, exact-end and overnight boundaries, daylight-saving changes, and time-driven freshness independently of content edits.
- [ ] Add the small browser harness needed to verify the rendered event flows and motion controls. Run relevant type/lint/build checks and tests; review behavior and visuals against the parent spec rather than asserting CSS class names.

## Blocked by

None (can start immediately).
