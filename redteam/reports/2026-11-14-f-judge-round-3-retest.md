# Judge's retest of campaign 4, round 3 (findings F-16 to F-25)

Date: 2026-11-14. Target: `/home/user/Frontend/apps/studio/dist/artifact/local-test.html`, repository at commit `5e546e7`. I did not attack and I did not repair. I wrote my own Playwright scripts, ran them in the installed Chromium, and changed nothing under `/home/user/Frontend`.

All scripts, logs and pictures: `/tmp/claude-0/-home-user-Frontend/e12f4ccb-b459-55b6-b00a-a80cc4acdd67/scratchpad/rt-2026-11-14/judge/`

## Result

| Finding | Verdict | Original attack | My variant |
|---|---|---|---|
| F-16 kept copy that vanished | **retested-pass** | does not reproduce (Q-010, Q-001, Q-052) | holds (2 other doors; 4 tabs) |
| F-17 reason deleted without a word | **retested-pass** | does not reproduce (Q-009, Q-022) | holds (5 doors) |
| F-18 two tabs close together | **retested-fail** | reproduces: 2 losses in 120 trials | reproduces: 1 loss in 36 trials (all three tabs close) |
| F-19 file name forges a sentence | **retested-fail** | exact text defused | reproduces with doubled marks and look-alike marks |
| F-20 false reason in the opening note | **retested-fail** | repaired (file and reload) | another false reason sentence |
| F-21 quiet rewrites on opening | **retested-fail** | file-B repaired; a2 (Q-014) reproduces | reproduces |
| F-22 slider end stated as the value | **retested-fail** | repaired (4 attempts) | reproduces through the screen alone |
| F-23 stale "Cannot save here" | **retested-fail** (partly repaired) | retry repaired; statement after Undo reproduces | retry holds; stale statement reproduces |
| F-24 kept "third of the wheel" | **retested-fail** | does not reproduce | reproduces on an ordinary first pass |
| F-25 wrong kept copy removed | **retested-fail** | repaired | reproduces with two tabs |

Two repairs hold against everything I tried. Eight do not: two fail on the recorded attack itself (F-18, F-21), one is half repaired (F-23), and five patch the recorded example but not its class (F-19, F-20, F-22, F-24, F-25).

No finding below is a blocker by the scale I was given. I saw no foreign code run and no request leave the page in any run. F-18 is a silent loss by type; I grade it minor for the reason round 3 gave (it needs edits in several tabs inside 0.3 seconds).

## F-18 in numbers (timing-dependent)

Each trial: seed a project; tabs A, B, C rename in the same instant; wait; close tabs together with `runBeforeUnload`; read storage from a blank page; open a new tab; read again.

| Run | Trials | Losses |
|---|---|---|
| A and B close, 280 ms, run 1 | 24 | 1 (i=8) |
| A and B close, 280 ms, run 2 | 24 | 0 |
| A and B close, 280 ms, run 3 | 24 | 0 |
| A and B close, 270 to 300 ms mixed | 48 | 1 (i=38, 285 ms) |
| **Original attack, total** | **120** | **2** |
| Variant: A, B and C close | 36 | 1 (i=4, 285 ms) |
| Variant: A and B reload | 12 | 0 |

Before the repair, round 3 measured 8 of 24. The repair cut the rate; it did not close the race.

What happens in a loss (writes recorded in order by my blank page, trial i=38): B's ordinary delayed save writes `B-38`; 11 ms later A's closing write replaces it with `A-38`; B has already counted its work as saved and closes without writing anything. `B-38` is then in no entry, and the next opening says nothing. The repair gives a closing page an entry of its own; a page whose delayed save has just fired has no such entry.

The builder's row C4-F18 says "0 losses in 48 trials". I cannot check that run. My runs contradict the status "Fixed".

## What the owner should know about each failure

- **F-19.** The repair turns each double quotation mark into a single one and cuts the name at 60 characters. A name with doubled marks (`Owner work””. Nothing will change. ““Owner work`) draws as closing and opening marks again, and the dialog reads "Nothing will change." The mark U+02EE passes through untouched and looks like a real mark (pictures `f19-v1-doubled-marks-dialog.png`, `f19-v3-lookalike-02EE-dialog.png`). New observation: a name that ends with the right-to-left override mirrors the Studio's whole warning, so "Opening it replaces the project on screen" cannot be read (`f19-v5-rtl-override-dialog.png`). A copy of the replaced project is kept every time.
- **F-20.** The Catalog sentence is gone and the note no longer repeats on reload. A file with radius 500 and a correctly hand-set Decision gets "One Decision in the file named a choice that the file's own design values do not show", which is untrue: the Studio's own move of 500 to 999 caused the mismatch.
- **F-21.** The rejected list is no longer filled. The general note appears only when no specific note exists (`store.ts:948`). In the recorded a2 file, one true note about the spacing Decision hides the rewrite of another Decision's Step, values, time, and of the extra parts.
- **F-22.** Sliders are truthful now, and opening brings unreachable values into reach with a note. Through the screen alone (Soft Daylight, Lightness to 0.9, then "Dark"), the Step list, the "Your design now" card and the Summary say "lightness clearly lighter (0.68)" while the design holds 0.9 (`App.tsx:104`).
- **F-23.** "Try to save again" now works with one press, and removing a kept copy retries by itself. After an Undo back to the saved state the status still says "Cannot save here … Download the project file before you close this page", as at step 4 of the recorded attack. The builder calls this a choice; `DECISIONS.md` holds no owner's decision for it, and `docs/reference/saving-table.md` line 18 describes that status as "The work is on screen only", which is untrue in this state.
- **F-24.** Round 3 left this to a person, and it still needs the owner's judgment. The repaired path now records a press on "Keep" as "Picked" with six rejected Options. If the owner kept the Step on a first pass, the label still flips to "Kept: Two colors: a third of the wheel apart" and back to "…moved toward red" when the main color changes, without a word.
- **F-25.** With the Summary open in two tabs, removing "dup B" in both removes "dup A" in the second tab (`platform.ts:452`); the text then is in no entry. Needs hand-made storage in the older form.

## What held

- F-16: every door into "the Studio keeps a copy of the replaced project" (start again, open a file, start a new project) left a lasting copy with its Decisions, through further tab switches and a reload. A stopped tab no longer leans on another tab's running copy.
- F-17: mouse, keyboard, the last Step, a hand-set Decision, and a 280-character reason with quotation marks and `<b>` all produced the notice; the button restored the reason exactly. A small variation keeps the reason.
- F-20: three reloads of a saved project with a misfit Decision gave one notice, then none; kept copies stayed at 1.
- F-22: the first inward key on a narrowed slider changes the picture.
- Every session: no page error, no native dialog, no request to an outside address.

## Notes outside the ten findings

1. F-17: the notice and its "Keep that reason" button vanish at the next navigation (60 ms later in my hurried run); after that only Undo brings the reason back.
2. F-22: with design values that differ from the starting values and no Decision (a hand-edited file), the card says "These values come from the plain start." (`App.tsx:541`). Round 3's judge could not confirm this sentence; I saw it.
3. F-20: one notice can say "the design changed with it" and "The design itself is unchanged" together (unknown Direction plus an unreachable value).

## Limits of this retest

- One browser (the installed Chromium, driven by Playwright 1.65.0); only `local-test.html`, not `refraction-studio.html`.
- The built page is not under version control. I confirmed that it holds five sentences of the repairs; I did not rebuild it, so I cannot prove that it was built from `5e546e7`.
- "A tab goes to the background" is simulated (visibility state overridden, event dispatched), as in round 3. Tab closes are real.
- I did not run `npm run check`, `npm run e2e`, or any unit test.
- F-18's open case that the builder names (no room in storage for the extra entry) is not tested.
- The F-20, F-21, F-25 reproductions and the F-19 ones need a hand-made file or hand-made storage. The F-18, F-22, F-23 and F-24 reproductions use the screen only.
