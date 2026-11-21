# Drift and truth audit, 2026-11-14, commit 5e546e7

**Verdict.** No blocker. Five major findings, ten minor, three notes. The counts of the Catalog, the test names, and the source lines are sound. The untrue statements sit in three places: what a Skin's text says about its color, what the records say about Skins and about dependency age, and the trial guide.

**How I worked.** I read CLAUDE.md, PLAN.md, PROGRESS.md, and DECISIONS.md first. I ran the unit tests (186 passed), bundled packages/core into my scratch folder to count and compute, and drove the built page (`apps/studio/dist/artifact/local-test.html`, built 10 seconds after the commit) in Chromium through Playwright. I did not run the browser tests, the lint, the type check, or the boundary tool. I did not open the private page or CI.

**One slip of mine.** A vitest run with the JSON reporter wrote `/home/user/Frontend/.vitest/json/output.json`. I removed it; `git status` shows no change.

My scripts and screenshots are in `/tmp/claude-0/-home-user-Frontend/e12f4ccb-b459-55b6-b00a-a80cc4acdd67/scratchpad/rt-2026-11-14/drift-truth-auditor/`.

## Major findings

### DT-01. A Skin's text names a color that the Skin does not give
- **Where.** `packages/core/src/catalog/skins.ts` lines 5-6, 38-47, 64-65; cards on #directions.
- **Observed on screen.**

| Direction, Skin | The card says | The picture's main color |
|---|---|---|
| Graphite Precision, Berry | "A rose red…" | #2d2327, near black |
| Graphite Precision, Gold | "A warm yellow-brown…" | #2a261e, near black |
| Graphite Precision, Forest | "A deep green…" | #212923, near black |
| Graphite Precision, Ember | "A red-orange…" | #2d2422, near black |
| Unbleached and Indigo, Vermilion seal | "The orange-red of a seal stamped on a letter" | #703324, dark red-brown |
| Control Room, Graphite | "a near-black main color" | #bcc5d1, light silver |
| Ink and Seal, Graphite | "a near-black main color" | #5c646f, mid gray |

- Graphite Precision is the first card on the screen; with any of its four Skins the picture stays black and white.
- "Vermilion seal" is offered by one Direction only, and there it is brown. After the start, the Summary describes that color as "close to “Dark purple”".
- "Graphite" is not near-black on any of its 15 Directions: light silver on six dark pages and on Sunlit Studio, mid gray (#414853 to #6a727d) on the eight other light pages.
- **Cause.** A Skin sets the hue and keeps the Direction's vividness and lightness. The unit test checks that only color values change; no test compares the text with the color.
- **Expected.** The sentence is true on every Direction that offers the Skin. The code review of the same day graded the same kind of defect (CR5-02) as major.

### DT-02. Records say Skins cite research and are complete Catalog records; they are neither
- PROGRESS.md line 77: "…two Skins (“Indigo dye”, “Vermilion seal”), each citing the research records it draws on."
- PLAN.md line 143: "a Step, Option, Direction, Skin, Overlay, … is a record with plain text, a source, an evidence grade, and a review date."
- **True.** A Skin record (`skins.ts` lines 15-30) holds a name, a sentence, and color values. It has no source, no grade, and no review date. A code comment is the only link to research, and no screen shows it.
- `docs/knowledge/03-research-of-2026-11-14.md` line 7 also says the Studio uses this research for "the source lines of the six Overlays". Every Overlay source line names one of the two older files (`overlays.ts` lines 28-29).

### DT-03. Guarantee 70.03 is untrue at HEAD
- `docs/reference/guarantees.md` line 575: "Every dependency is pinned to an exact version that is at least 7 days old." CLAUDE.md line 64, PLAN.md line 123, and `.github/dependabot.yml` line 1 repeat it.
- **True.** `package.json` pins typescript-eslint 8.72.2 and @vitejs/plugin-react 6.3.0. DECISIONS.md dates both releases 2026-11-09; the merges are dated 2026-11-14. DECISIONS.md line 106 says vite 8.3.7 was "inside the waiting period" on 2026-11-13; it was merged the next day.
- D53 point 6 says only that the wait "was not checked". The guarantee still states it flat, "Last verified: 2026-11-13".
- Also untrue at HEAD: DECISIONS.md line 106, "@types/node follows Node 22" (26.6.6 is pinned). The records say "six" merged updates; the log shows seven Dependabot pull requests (five npm packages, two GitHub Actions).

### DT-04. The trial guide's part 2 cannot be followed as written
- `docs/trial-guide.md` lines 24-27 lead the owner through the Step that opens and the next two, and say: "On one of them, open "Adjust with sliders"" and "type a reason into "Why this choice?"".
- **Observed.** Those Steps are "Menu (navigation)", "First screen", and "List of services". None has sliders; the first that does is Step 6, "Spacing". Nine of the 23 Steps have sliders.
- "Why this choice? (optional)" is absent before a pick, and the main button moves to the next Step at once. The field is seen only after going back to a decided Step.
- PLAN.md line 67 overstates the same way: "On each: … fine-tune with sliders, ask for small variations".
- M4 closes on this trial.

### DT-05. "Plain Label" does what its own cited record lists as an anti-pattern
- `directions.ts` line 5: "No Direction copies a brand, and none names one."
- The Direction cites the record "Emptiness as a container, and the plain-goods approach in retail". That record's first anti-pattern: "Imitating a known retailer's label (its red-brown, its typeface, its kraft paper) and calling the result a principle." Its caveat: such a look is protected by trade-dress law, and "the tool must stay with the general principle".
- **Observed.** A near-white page (#fcf9f7), plain letters, a black button, and "one dark red" (#7f1f29, a dark red-brown). The name is "Plain Label". "Best for" reads "food, household goods, stationery, clothing basics", the range the record describes for that retailer.
- Neither the "Watch for" text nor D53 tells the owner.
- **Limit of this finding.** That #7f1f29 is close to the retailer's real color rests on my memory, not on a source in the repository. The rest is the repository's own text. The owner should judge the likeness.

## Minor findings

| ID | Where | The statement | What is true |
|---|---|---|---|
| DT-06 | PROGRESS.md lines 38, 46; PLAN.md line 156; PROGRESS.md line 128 | "184 unit tests"; "163 unit tests"; sliders "on 10 Steps" | 186 unit tests pass; sliders are on 9 Steps |
| DT-07 | PROGRESS.md line 112 | The two new Skins "are offered by the three new Directions only" | "Indigo dye" is also on Paper and Ink and on Quiet Luxury; "Vermilion seal" is on Unbleached and Indigo alone |
| DT-08 | `App.tsx` line 541; Direction cards | After a start in "Vermilion seal": "These values come from Unbleached and Indigo" | The hue 35° comes from the Skin; the card also keeps "the blue marks what a visitor can press" over a brown button |
| DT-09 | `overlays.ts` lines 49-109 | "long-standing convention" for the loading placeholder and for the button that stays in view | The record grades the placeholder claim C; neither record for the button speaks of a button that stays in view; details below |
| DT-10 | `researchRules.ts` lines 75, 93-94, 110, 130 | Four reasons stated firmly | The records are weaker; details below |
| DT-11 | `App.tsx` lines 866, 1069 | "Reviewed on 2026-11-14" on every Overlay and research rule | The date is the day of writing; PROGRESS.md says nobody reviewed them |
| DT-12 | `directions.ts` line 655; `smallBusiness.ts` line 252 | "Words and picture share the first screen unevenly" | The split is 52.5 to 47.5; the cited record asks for 5 to 7 or 1 to 2, "not half and half" |
| DT-13 | PLAN.md lines 123, 213 | "four more parts in progress"; D27 and D28 "must be brought in line" | The four files are written; D28 is replaced; D27 is not in line (DT-03) |
| DT-14 | WAYPOINTS.md; PROGRESS.md lines 9, 46 | The private page's version "is in WAYPOINTS.md" | The last version there is 11, at a commit before Skins and Overlays; no CI run is on record for this unit. I did not check the page or CI |
| DT-15 | `store.ts` line 869; PLAN.md line 66; `directions.ts` lines 188, 425 | One term per concept | "skin" and "Skin"; "sample website" for the Mockup; the Direction name "Steady Steps"; "looking like a template"; a record title on screen that calls a research estimate "a floor" |

**DT-09 in detail.**
- **Loading placeholder.** Its record says the evidence that such placeholders beat a spinner "is thin… grade C"; the second record says "do not count on them to make the wait feel shorter". "About a second" and "about ten seconds" come from a record the Overlay does not cite.
- **Button that stays in view.** "A large target that is always near is reached fastest" is the builder's inference from a pointing law. The record's caveat says that on phones reach and the covering hand matter as much.
- **“Are you sure?” question.** "Undo is the stronger protection" is, in the record's words, "expert opinion, not part of a standard".
- **Notice after an action.** The cited record does not hold the sentence about a notice that vanishes. It advises confirming "where the user is looking (inline, or next to the control)"; the Overlay puts the notice "at the edge of the window".
- PLAN.md line 57 promises that a rule graded C is shown as opinion.

**DT-10 in detail.**
- **Line length.** "Studies… favor moderate lines"; the record says the studies "are small and partly conflict" and that longer lines were read faster.
- **Short lines.** "Reading stays fast down to about 13 letters"; the record says a reader at 13 "has already lost about a fifth of maximum speed".
- **Text size.** "16 pixels keeps the small letters above that size"; the record says such text "sits at this limit, not safely above it". I measured the Studio's own letter styles at 16 pixels: small letters 7.9 to 8.8 pixels tall, against the record's floor of about 8.
- **Step between sizes.** "Look like one size that was set carelessly"; the record says "risk" and calls the step its own inference. The rule's second text does say so.
- **Line height.** The upper limit 1.8 is the record's "working convention"; the screen gives no origin for it.

## Notes

- **DT-16. Figures with no means to check.** "39 pairs… 12 remain" (PROGRESS.md line 71) has no method or file. The token counts (1.2 million; 666,551) are in no report. My own stricter comparison on Soft Daylight found one identical pair of card pictures, on a Step that carries a note in words.
- **DT-17. Shown nowhere.** A Direction's sources and grade appear on no screen. `kb-eye-and-beauty.json` (20 records) feeds nothing in the Studio.
- **DT-18. Names.** No Direction or Skin carries the name of a person, a show, a book, or a brand. "Woody Creek Winter" names a real small place, and "Mountain Rhinestone" lists "reading programs… family attractions"; a reader who knows the honored person will recognize them. Step source lines name companies and two authors as citations; these are older than this unit.

## What I tried that held

- **Counts.** 23 Steps (6 and 17); 38 Directions in four groups (12, 10, 11, 5); 13 Skins, 2 to 5 per Direction; 6 Overlays; 5 research rules; 12 conflict and 11 harmony rules; 29 contrast pairs; format version 2; 76 new and 138 older research records; 49 guarantees; 19 code-review findings in 17 rows.
- **Browser tests, counted and not run.** 263: 104 in `studio.e2e.ts`; 159 in `visual.e2e.ts` (10 single, 23 per Step, 9 per paint-only Step, 117 per Direction and page part). 117 stored pictures exist.
- **Guarantees 10.14, 20.07, 30.06, 50.07, 50.08, 60.03, 60.04.** All 25 test names exist word for word in the cited files, and each test checks what its rule says.
- **Saving table.** All 35 test names (31 distinct) exist word for word; the status-line words are in the code.
- **Findings rows.** CR5-01 to CR5-17, U2-06, U2-08, U3-05 are true at HEAD as written. I measured CR5-11 (44 pixels in a touch setting) and U2-06 (one button, opaque bar) in the browser.
- **Source lines.** All 33 in `researchRules.ts`, `overlays.ts`, and the three new Directions name a record that exists word for word. The overview's counts of how sources were seen match the data files.
- **Research rules against the drawn page.** On Ink and Seal, Plain Label, and Control Room at four widths, every "Holds" and "Does not hold" matches what the browser draws. Text links are 24 to 26 pixels tall, as the rule says.
- **D52 and D53.** The top bar reads "3. Overlays", "4. Summary". A project without Overlays stores no Overlay field. An unknown Overlay that I planted was left out with a notice, and the original was kept as a copy. None of the 20 newest Directions starts with a contrast warning or a clash. No Skin adds a failing color pair (178 pairs computed).
- **Hard rules.** No `innerHTML` or `dangerouslySetInnerHTML`; no React or browser API in `packages/core` (by search); the Mockup holds no script and no event handler, in a frame with an empty sandbox; no outside request and no page error on any screen; no text calls output "accessible" or "compliant".
- **Trial guide.** Every other label matches the screens: "Start from …", "Undo", "3. Overlays", "4. Summary", "Switch it on when", "What can go wrong", "Every Step and its value", "Research rules", "Download the project file", "The Studio’s own look", the checkbox label, and "Put this Step back to how the project started".
- **Repository.** The branch name matches, and HEAD equals the local record of the pushed branch.

## Not checked

- The browser tests, the lint, the type check, and the boundary tool.
- CI and the private page.
- The token counts.
- Whether each research record is right about its studies. I compared the Studio's texts with the records, not the records with their sources.
