# Thirst Trap redesign plan

Design direction: **Club flyer, clear information.**

Thirst Trap is a trans-led queer nightlife series in Lowell. The homepage's main job is to help someone choose the next party and get tickets. Its secondary job is to help DJs, drag performers, vendors, and volunteers get involved. Preserve the existing nightlife identity while making navigation, reading, and signing up straightforward.

This plan is based on the current repository, the live site, and the Google Form inspected in Zen on September 25, 2026. The user approved both interview rounds' recommendations, chose Google Sheets as the destination for the native form, explicitly requested retaining the animated word wall, and supplied `contact@thirsttrap.gay` as the team notification recipient. The design interview is complete. Documentation changes do not change the running site or the original form.

## Visual direction

Keep the existing logo, Mega Monster lettering, dark violet atmosphere, hot pink accents, and animated word wall. Replace the fullscreen introduction and scroll-triggered screen switch with an ordinary vertically scrolling page. Put the featured event immediately below the header. Retain the word wall as a subtle moving backdrop within this opening section, with a dark overlay behind readable event details; it must not delay access to the event or control scrolling.

The signature is a **large event flyer with an oversized Mega Monster event title beside it**, joined visually by a narrow hot pink date strip. The flyer supplies the color and energy; the surrounding layout gives people room to read. Display the entire flyer without cropping its embedded text. Use an upright frame with a restrained violet shadow; do not rotate or distort the artwork.

A full-bleed flyer hero makes varied poster formats harder to accommodate and puts essential information at the mercy of the artwork. The split flyer/details layout is the stronger fit. Keep the user's preferred animated word wall and omit the additional moving ticker and pulsing stars so the page has one consistent source of ambient motion.

### Compact design tokens

| Token | Value | Use |
| --- | --- | --- |
| Midnight | `#050410` | Page background; dark text on pink buttons |
| Aubergine | `#191126` | Quiet surfaces, form inputs, secondary cards |
| Hot pink | `#FF00AE` | Primary actions, date strip, focused controls |
| Violet | `#8B5CF6` | Small atmospheric accents and flyer shadow |
| Ice | `#EEEDF5` | Headings, body copy, input text |
| Lavender | `#B7ADC8` | Supporting text, dates, field descriptions |

Use solid foreground colors for important copy, replacing the current very low-opacity labels. Pink buttons use Midnight text. Check final text/background combinations for accessible contrast during implementation.

| Role | Typeface and scale |
| --- | --- |
| Identity and event headings | Existing Mega Monster Italic, 56–80px desktop / 36–44px mobile, approximately 1.0 line height; allow long titles to wrap |
| Section headings | Mega Monster, 28–36px; use sparingly |
| Body and form content | Existing Geist, 16–18px, 1.5–1.65 line height |
| Navigation, dates, labels | Geist Medium/Semibold, 14–16px; tabular numerals for dates, restrained tracking |

Layout: approximately 1160px maximum width, 24–40px desktop gutters and 20px mobile gutters; 64–88px between major desktop sections and 40–48px on mobile. Use 8px corners on controls and quiet panels, with 48px minimum control heights. Avoid a separate decorative font for metadata.

Motion: retain the existing word wall's slow, alternating rows, using the existing brand vocabulary and typography. Treat it as decorative, exclude it from assistive-technology reading order, and keep it behind the hero without intercepting input or overflowing the page. Provide a keyboard-accessible pause/resume control; show it statically when reduced motion is requested. Use only a short optional entrance fade and small button color changes elsewhere. Essential event content remains visible without animation or JavaScript, and form inputs have a quiet background.

## Homepage

```text
┌──────────────────────────────────────────────────────────┐
│ THIRST TRAP                  Events   About   Get involved │
├──────────────────────────────────────────────────────────┤
│ Queer nightlife in Lowell, MA                            │
│                                                          │
│ ┌────────────────────────┐   Featured event               │
│ │                        │   EVENT TITLE                 │
│ │                        │                               │
│ │   FULL EVENT FLYER      │   Day, date · time             │
│ │                        │   Venue · Lowell, MA           │
│ │                        │   Short event description     │
│ │                        │                               │
│ └────────────────────────┘   [Get tickets]  Event details │
│ ━━━━━━━━━━━ HOT PINK DATE STRIP ━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                          │
│ More upcoming events                                     │
│ [Small flyer · date · title · venue · Event details]       │
│ [Small flyer · date · title · venue · Event details]       │
│                                                          │
│ Get involved                                             │
│ DJ, perform, vend, or volunteer at a future event.         │
│ [Apply to get involved]                                   │
│                                                          │
│ Trans led. Community driven. Judgement free.              │
│ About Thirst Trap                                         │
├──────────────────────────────────────────────────────────┤
│ Instagram · Lowell is Queer · © Thirst Trap                │
└──────────────────────────────────────────────────────────┘
```

- **Header:** one shared, always-present navigation bar across home, About, event details, and signup. Use the actual logo at a modest size. Events links to the homepage event area; Get involved links to `/get-involved`.
- **Featured event:** roughly 55% artwork and 45% details. The event title is the page's main heading. Show date, time, venue, short description, and a ticket action when a ticket URL exists. Otherwise make Event details the primary action. Use “Featured event” when a manually chosen event is later than the next chronological event; reserve “Up next” for the actual next event.
- **Other upcoming events:** compact horizontal cards with small artwork, ordered soonest first. They should be visibly subordinate to the feature. Hide this entire section when empty.
- **Get involved:** one broad, quiet panel linking to the signup page, with all four roles named. Keep the full form off the homepage.
- **About:** a short statement using the site's existing community language and a link to the About page.
- **Footer:** readable social and community links, without a moving ticker.

### Mobile

Use a compact logo and menu. Place the featured title, date, venue, and primary action before the full flyer so visitors can act without scrolling through a tall poster. Follow with the description. Smaller events become stacked thumbnail-and-text rows. Forms and actions stay in one column; navigation and content must work at 320px without horizontal scrolling.

### Event selection and empty states

1. Query published, eligible events using their raw timestamps; keep date formatting separate. Display dates explicitly in `America/New_York`.
2. Feature the earliest eligible event marked featured. If none is marked, feature the soonest eligible event.
3. List every other eligible event below it, including any additional events marked featured. Exclude only the selected event by ID, preventing duplicates or accidentally hidden events.
4. Add an optional end time. Keep a running event visible until its end; when no end time is supplied, use a documented 6 AM local cutoff after its scheduled event date to accommodate overnight nightlife. Validate the rule against actual event schedules during implementation.
5. Re-evaluate eligibility on a bounded schedule, such as every five minutes, as well as on content updates. A cached page must not leave an expired event featured indefinitely.
6. With no eligible events, show the logo, “The next party is in the works,” and links to Instagram and Get involved. Never substitute a past event or invented date.

Past events disappear from all event listings and navigation. Existing event URLs remain available for old links, clearly show that the event has ended, and replace the ticket action with a link to upcoming events. There is no past-event listing. The live site currently shows May and June 2026 events, which should not be treated as upcoming in this redesign.

## Get involved form

Use a native, branded form on `/get-involved`, based on [Thirst Trap Sign-Ups](https://docs.google.com/forms/d/1z6RH6-joDq0GqK-yqKChj8qff0LvEzgNudF12bWrCaA/edit). Title it **Get involved** with the description: “Apply to DJ, perform, vend, or volunteer at Thirst Trap or one of our spin-off events.”

An application expresses ongoing interest in future opportunities. It does not apply to one scheduled event, confirm a booking, or assign a volunteer shift.

Keep a narrow, approximately 680px form column. Use visible labels, solid readable text, comfortably sized inputs, and grouped radio buttons and checkboxes. No decorative effects behind input text.

### Two short steps

**Step 1 — About you**

- Name / stage name / business name.
- How can we contact you? Helper text: “Instagram preferred.” Accept a handle or another contact method; do not force an email address.
- Event interest: Thirst Trap; Spill the Tea or other spin-offs; Both.
- How did you hear about Thirst Trap?
- Roles: DJ; Drag performer; Vendor; Volunteer. Allow multiple selections using checkboxes.

**Step 2 — Your experience**

Show a clearly labeled question group for every selected role, in the order listed below. Shared information from step 1 is entered once.

| Selected role | Questions from the source form |
| --- | --- |
| DJ | How long have you been DJing? What music do you specialize in? Where can we find examples of your work? What is your typical rate? |
| Drag performer | How long have you been doing drag/performing? What sort of performances do you typically do? Where can we find examples of your work? What is your typical rate? |
| Vendor | What products do you make/sell? What experience have you had vending at events/markets? Where can we find examples of your work? |
| Volunteer | What experience do you have working at events? Which roles interest you: Monitoring, Door, Coat check, Setting up/breaking down, Other? |

Use textareas for descriptions and experience, flexible text for rates, and a conditional text input for Other. Rates may include ranges or context rather than requiring a number. Allow work examples to include social handles as well as URLs.

The source editor currently shows the Vendor section continuing into Volunteer; the native form only asks volunteer questions when Volunteer is selected. This is an intentional change to the native experience, not an edit to Google Forms.

Back preserves answers in the current form session. Submit answers for all selected roles, excluding answers for deselected roles. Show inline errors with an accessible error summary and keep entered values after a failure. Validate on both the client and server.

Required: name, usable contact, event-series interest, at least one role, and a short description of interests/work for each selected role. Use music interests for DJs, performance description for drag performers, products for vendors, and experience/interests for volunteers. Phrase these prompts to welcome beginners; prior experience itself is not a requirement. Volunteers must select at least one assignment preference, with a description required when Other is selected. Work examples, rates, referral source, and length of experience are optional. These are the approved native-form requirements, independent of the source form's required-field flags.

Final action: **Send application**. Show “Application received” only after its row is confirmed saved in Google Sheets. If delivery fails, keep the answers in the open form, explain the failure, and offer Retry. Protect retries and double clicks against duplicate rows, including when a write succeeds but the response is interrupted. Explain that the team will use the supplied contact details if there is a fit. Do not promise a response time or booking. Give a clear route back to upcoming events.

### Submission destination

Approved destination: the existing [Google spreadsheet and response tab](https://docs.google.com/spreadsheets/d/1VJp3nZzBRH260rGipYrwhPEYt46F4FQaWDhiAql79fM/edit?gid=1808715276#gid=1808715276). Applications are entered through a styled native website form and delivered by the website server after validation. Keep Google credentials out of the browser. Preserve existing response data and inspect actual headers before designing the row mapping.

Google Sheets is the team's application-review destination; a Payload application-review UI is outside the agreed scope. Use confirmed direct delivery with applicant-controlled retry, rather than accepting applications into a background delivery queue. Implementation may keep minimal delivery identifiers/status needed to prevent duplicate writes; this does not introduce a second application-review destination. Do not rely on undocumented Google Forms submission endpoints. Writing directly to Sheets must not be described as creating a Google Forms response. Existing responses need no migration. See [ADR 0001](adr/0001-native-applications-with-google-sheets.md).

#### Verified destination structure

The connected Google Drive account returned a permission error. The spreadsheet was accessible in the user's existing Zen session, where the title, target tab, table name, and headers were verified. This browser access does not establish production credentials for the website.

- Spreadsheet title: **Thirst Trap Sign-Ups (Responses)**.
- Target tab: **Form Responses 1**, sheet ID **1808715276**.
- Existing table: **Form_Responses**.

| Columns | Existing contents |
| --- | --- |
| A | Timestamp |
| B–F | Name, contact, event-series interest, referral source, role interest |
| G–J | DJ experience length, music specialization, work examples, rate |
| K–N | Drag experience length, performance description, work examples, rate |
| O–Q | Vendor products, vending experience, work examples |
| R–S | Volunteer experience, assignment preferences |

The work-example headers in I, M, and Q have distinct existing names ending in no suffix, `2`, and `3`; the rate headers in J and N likewise differ by a `2` suffix. Preserve those existing columns. Approved mapping: one row per application, all selected roles listed in F, corresponding role-answer columns populated, unselected-role columns blank. Do not change live sheet data while planning.

### Repeat applications, notifications, and existing links

- Returning applicants can submit again without an account. Each intentional new application creates a new timestamped row; never overwrite earlier rows based on matching names or contact handles. An intentional new application is distinct from retrying the same submission.
- After a native application is saved, send a brief notification email to `contact@thirsttrap.gay` linking to the Google Sheet. Keep applicant details in the sheet. The applicant receives on-page confirmation; no applicant email address is required. The recipient address does not establish the sending address or authorize mailbox access.
- Email notification failure must not cause an applicant to resubmit an application already saved in Sheets. Handle and report notification delivery failures independently of application storage.
- Keep the original Google Form accepting applications initially so old links continue to work. Both entry points feed the same sheet; the website links to the native form. Do not assume the native form's email notification path also runs for legacy Google Form submissions.

### Implementation prerequisites

Production Google write access and the email transport, including a verified sending identity, will be checked during implementation; the browser's signed-in session is not an application credential. No user-facing design decisions remain open.

## Implementation sequence and review criteria

1. Replace the homepage transition with normal page flow; consolidate shared navigation/footer and apply the palette/type tokens.
2. Correct date eligibility, timezone handling, caching, and featured-event fallback; carry ticket links and venue information into the homepage data.
3. Build the featured event, smaller events, empty state, and Get involved panel. Bring event detail and About pages into the same spacing and navigation system.
4. Build the two-step, multi-role native form with client and server validation, then connect the Google Sheet using the agreed row mapping and delivery policy.
5. Review desktop and mobile layouts using portrait, landscape, missing, and text-heavy artwork. Confirm readable contrast over the animated word wall, its pause control and static reduced-motion state, keyboard operation, long titles, and no horizontal overflow.
6. Verify zero/one/many events, multiple featured flags, expired featured events, local-time boundaries and overnight events. Verify every role and combinations of roles, required-field rules, back/edit behavior, deselected-role exclusion, failed submission recovery, duplicate protection after interrupted responses, intentional repeat applications, independent notification failures, and restricted access to application data and Google credentials.

The successful result feels unmistakably like Thirst Trap, with the next event and its ticket action visible on arrival and a signup flow that asks only relevant questions.
