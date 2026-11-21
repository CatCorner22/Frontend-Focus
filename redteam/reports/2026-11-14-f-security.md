# Red-team review of 2026-11-14: security attacker

**Target.** Refraction Studio at commit `5e546e7`, the built page `/home/user/Frontend/apps/studio/dist/artifact/local-test.html` (built at 18:05, the time of that commit; it contains the three new Directions, the Skins, the Overlays screen, and the research rules).

**Method.** I read `engine.ts`, `smallBusiness.ts`, `preview.tsx`, `store.ts`, `platform.ts`, and the Summary and Overlays parts of `App.tsx`, then attacked the real page in Chromium through Playwright with ten scripts. Every request that did not stay on the local file was recorded and stopped. I placed starting data in the browser's storage from a small page of my own in the same folder origin, as a hostile local file could.

**Evidence.** Scripts, result files, and screenshots are in `/tmp/claude-0/-home-user-Frontend/e12f4ccb-b459-55b6-b00a-a80cc4acdd67/scratchpad/rt-2026-11-14/security-attacker/` (`lib.js`, `t01-static.js` to `t10-directions-held.js`, `t02-results.json` to `t06-results.json`, folder `shots/`).

**Result in one paragraph.** I could not make the page run script, load anything from outside, or put markup into the Studio's page or a preview frame. I could not make it lose or silently replace saved work through Overlays, Skins, Undo, or two tabs. I found seven things: one false sentence about saving on the new Overlays screen, one way for a file's name to make the Studio's own warning unreadable, and five smaller faults in words and records.

## Findings

### S5-01 (blocker by the review's rule): "Each change is saved" stands on the Overlays screen while the Studio is not saving

- **Where.** `/home/user/Frontend/apps/studio/src/App.tsx` line 854: `Tick an Overlay to switch it on. Each change is saved, and Undo in the top bar takes it back.` The sentence is fixed text; it does not follow the save state.
- **Steps.**
  - Storage full: seed a valid project, open `#overlays`, fill storage, tick an Overlay.
  - Not saving: seed the stored project with `{"cut off`, open `#overlays`, tick two Overlays.
  - Two tabs: tick "Tooltip" in tab A, then tick two Overlays in tab B.
- **Observed.**
  - Storage full: the top bar read "Cannot save here: this browser's storage is full or blocked…", the hint read "Each change is saved", and the stored project held no Overlay (`shots/t03-C-full-each-change-is-saved.png`).
  - Not saving and two tabs: the top bar read "Not saving: see the notice at the top of the page", the same hint stood beside the switches, and storage was unchanged.
- **What limited the harm in my runs.** The status line told the truth at the same moment. With storage full, the browser asked before the page left. In the not-saving case, the page kept the work as a copy and said so at the next opening. No work was lost.
- **Same kind, older.** The Directions screen says "the Studio saves your work as you go" (`App.tsx` line 385). I saw it on screen while the status line said "Not saving".
- **Expected.** No sentence says "saved" while the Studio is not saving.
- **On the grade.** The rule of engagement names "a false statement about saving" as a blocker, and this is one. If the judge reads the rule as "a false statement that costs work", the grade is major.

### S5-02 (major): one invisible character in a file name or project name turns the Studio's warning into mirror writing

- **Where.** `plainName` in `/home/user/Frontend/apps/studio/src/store.ts` lines 158-160 replaces double quotation marks and line breaks. It leaves U+202E in place. U+202E is "right-to-left override", an invisible control character that makes a browser draw the following text from right to left.
- **Steps.** With a project open, press "Open a project file" and choose a valid file named `notes` + U+202E + `.json`.
- **Observed.**
  - The whole body of "Replace the open project with this file?" was drawn backwards (`shots/t09-filename-bidi-dialog.png`). "Opening it replaces the project on screen", the Undo limit, and the kept-copy sentence could not be read. The title and the buttons stayed readable.
  - With the character in the project name and a prepared name, the dialog showed, readable, "is the same as the open project, so nothing is changed", which is text from the file (`shots/t02-name-bidi-override-dialog.png`).
  - After opening a file named "Safe" + U+202E with two unknown Overlays, the Studio's note that Overlays were left out was mirrored (`shots/t03-F-bidi-notice-after-open.png`).
  - The kept copy's line on the Summary was mirrored and stays so until the copy is removed (`shots/t03-F-bidi-kept-list.png`).
- **What held.** No script ran. The replaced project was kept as a copy, and Undo was offered.
- **Not tested.** The same character typed or pasted into the name field in the top bar; any browser other than Chromium.
- **Expected.** A name cannot change how the Studio's sentences are drawn. Guarantee 20.06 covers quotation marks only.

### S5-03 (minor): a look-alike of the closing quotation mark still ends the quotation

- **Steps.** Open a valid file named `holiday″. This file changes nothing; your project stays. ″x.json` (″ is U+2033, the double prime).
- **Observed.** The dialog read "The file “holiday″. This file changes nothing; your project stays. ″x.json” holds a project named…" (`shots/t02-filename-double-prime-dialog.png`). In the Studio's letter style the double prime looks like a closing quotation mark. U+275E in a project name passed the same way. The true sentence still followed and was readable.
- **What held.** The real double quotation marks were replaced, as the repair of finding F-19 promised.
- **Expected.** Guarantee 20.06's heading ("cannot end the quotation") holds for look-alikes, or says which characters it covers.

### S5-04 (minor): "Start a new project?" clears the Overlays and does not say so

- **Where.** `/home/user/Frontend/apps/studio/src/store.ts` line 966.
- **Observed.** With three Overlays on, the dialog read "This clears the Direction, 0 Decisions, the project name, and the Contrast checks setting." After the answer the stored project had no Overlay. A copy was kept and Undo was offered.
- **Expected.** The dialog names the Overlays among the things it clears.

### S5-05 (minor): two records say the original file is kept as a copy; for an opened file the Studio keeps none

- **Where.** `/home/user/Frontend/DECISIONS.md` line 65 (D53, point 2) and `/home/user/Frontend/docs/reference/guarantees.md` lines 327-331 (guarantee 20.07).
- **Observed.** I opened a file with an unknown Overlay. With an empty project there was no kept copy at all. With work on screen there was one kept copy, the replaced project; none held the unknown Overlay.
- **What is true.** The statement holds for a project stored in the browser; there I saw "The Studio kept the copy as it was". The owner's file on disk is untouched, so nothing is lost.
- **Expected.** The records state each path as it is.

### S5-06 (note): Undo after a start in a Skin names two Steps, not the Skin

- **Observed.** After "Started again from “Ink and Seal”, in the skin “Forest”", Undo read "Undone: the Steps “Tint of the grays” and “Main color” are back to how they were." and offered "Go to “Tint of the grays”".
- **After a reload.** The Summary says "started from Unbleached and Indigo" and the card shows "As designed", while the project carries the Berry colors. `PROGRESS.md` already lists this as a known gap.

### S5-07 (note): small untrue or missing words on opening

- A project stored in the browser with an unknown Overlay gets the note "One Overlay in the file…"; no file was opened.
- A file with Decisions under `__proto__`, `constructor`, and `toString` gets "2 Decisions… were left out"; three were left out. No built-in object changed.
- When one specific note exists, other silent corrections go unsaid: a time that became 1970-01-01, an extra part that was dropped.
- A hand-made kept copy whose reason is an object shows "[object Object]".

## What I tried that held

**Script and outside loading.**
- 0 requests left the local file in all ten scripts, also with `http://example.invalid` addresses planted in every text of a project.
- The built page has one script, its own, and no link element.
- `innerHTML` appears only inside React's own code.

**Preview frames.**
- Every frame I saw had `sandbox=""`, a `srcdoc`, no `src`, 0 scripts, 0 event attributes, 0 outside addresses, and the policy line `default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; form-action 'none'; base-uri 'none'`. That covers the 38 on the Directions screen, the Step cards, the Overlays preview, and the Summary.
- From inside a frame, an image's onload, an added script, a `javascript:` link, and a timer did not run.
- The parent page, the top address, storage, and cookies were refused. A new window, a move of the top page, and a form submission were blocked.
- Limit: I ran these probes with the debugger's own right to run code in the frame, because the Studio gave me no way to put code there.

**Markup from a file, a name, storage, or an Overlay list.**
- All of it appeared as text, in the Studio's page and in the frames (`shots/t02-markup-everywhere-overlays.png`, `shots/t05-L1-hostile-storage.png`).
- Only the six fixed identifiers reached the frame's `data-overlays` and the picture names.

**Hostile "overlays" lists.** 16 forms.
- Left out or put in order with a notice: unknown identifiers, repeats, wrong order, an empty list.
- Refused with "The problem is in the part that holds the Overlays." and the open project unchanged: too many entries, a too-long entry, a string, null, numbers, an object, a nested list.

**Refusals.** A newer version, a value beyond its range, 1e999, broken text, an array, an HTML file, and a too-long name were each refused with words that fit.

**Undo after an Overlay switch.** Each switch was one Undo step. Storage followed. The project without Overlays had no "overlays" field and the same content as before.

**Two tabs with different Overlays.**
- The second tab stopped saving and said so. Both choices kept the other copy first.
- A switch in both tabs in the same instant, 8 trials: one tab saved, the other stopped with its work on screen.
- Both tabs leaving within 0.3 seconds of a switch, 10 trials: both works were in storage or in a kept copy every time.
- A stopped tab that was closed left its Overlays as a kept copy, with a notice at the next opening.

**A Skin over existing work.**
- The Studio asked first. The kept copy equalled the old project character for character. Undo brought it back.
- With storage full, a second question said that no copy could be kept, and "Keep my project" changed nothing.

**Extreme designs.**
- 40 files with the lowest, highest, and random allowed values, all six Overlays on: no fault screen, no page error.
- With the Studio dressed in the design, its text and buttons stayed readable. One low reading was my measuring fault; `shots/t08-look-r4.png` shows a readable button.

**Checks I ran in the repository.** `npx vitest run packages/core/test/mockup.test.ts packages/core/test/project-file.test.ts`: 43 tests passed. The six tests that guarantees 20.06, 20.07, and 30.06 quote exist under those names. `git status` was empty at `5e546e7` when I finished; I changed nothing in the repository.

## What I did not do

- I did not open the private claude.ai page; its database and its file hand-over were not tested.
- I used Chromium only, the installed build 1243, which is older than the pinned Playwright 1.65. How Firefox or Safari draw the right-to-left character was not tested.
- I did not run `npm run e2e` or build the page (rules of engagement).
- In the 200,000-level case I stopped at the question and did not press "Open the file".
- I did not review the research files `docs/knowledge/kb-*.json` for truth; that is the drift and truth auditor's part. I read them only as data.
