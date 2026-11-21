# Confused first-time user: review of 2026-11-14 (commit 5e546e7)

No blocker. Four major findings, eleven minor, four notes. The new parts read well in a desktop window; they fail a new person in three places: a Skin press that shows nothing, a Skin that the Studio forgets, and the phone.

## How I worked

I used the built page `apps/studio/dist/artifact/local-test.html` in the installed Chromium through Playwright.

- **Desktop, 1440 by 900:** first screen to Summary, following `docs/trial-guide.md` once as written.
- **Phone, 390 by 800, touch on:** Direction, two Steps, Overlays, Summary.
- **Keyboard alone:** one full pass, first screen to an opened research rule.
- **Measurements:** I captured all 216 card pictures (38 Directions in every Skin) and every Step card, and compared them pixel by pixel, to back what my eye said.

I changed nothing in the repository (`git status` is clean). Scripts, 149 screenshots, and measurements are in `/tmp/claude-0/-home-user-Frontend/e12f4ccb-b459-55b6-b00a-a80cc4acdd67/scratchpad/rt-2026-11-14/first-time-user/` (screenshots in its `shots/` folder).

Not done: no real phone, no screen reader, no "Tablet" walk, no opening of a project file, no unit tests. My test browser closed itself on some later downloads; the first download worked and the file was whole, so I count that against my setup.

## Where the trial guide does not match the screen

| Guide | What the screen does |
|---|---|
| Part 1, step 3: "Watch the picture change." | On several cards the picture does not change to the eye (U5-03). |
| Part 2, step 3: "On one of them, open "Adjust with sliders"" | Steps 1 to 5 have no sliders. The first is Step 6, "Spacing" (U5-01). |
| Part 2, step 4: "On one Step, type a reason into "Why this choice?"" | The field exists only on a Step I have already picked on, and a pick moves me on. I had to press "Previous Step" (U5-01). |
| Part 3, step 1, right after typing the reason: "Press "Undo"… once." | Undo erases the reason. Step 2's "removed your reason" notice can then not appear (U5-02). |
| Question 2: "which Skin did you pick" | After a reload no screen names the Skin (U5-04). |
| Part 6: "make the browser window very narrow. Start from a Direction" | In the same browser this opens "Start again from …? This replaces your current design and clears your N Decisions" (U5-19). |

Parts 3, 4 and 5 match the screen word for word, including "3. Overlays", "4. Summary", "Every Step and its value", "Research rules", "Download the project file", and the full "Dress the Studio itself…" sentence.

## Major findings

### U5-01. Trial guide Part 2 cannot be followed as written
See the table. Sliders exist on 8 of 23 Steps only (6, 8, 9, 11, 12, 15, 17, 19). "Why this choice? (optional)" sits below the cards and the main button, on decided Steps only. I did not know where to look for either.

### U5-03. A Skin press that shows nothing
I knew what a Skin is before pressing: the legend says "Skin (the same look in other colors)". I could tell which chip is chosen. But on some cards the press changes nothing I can see.

- **Quiet Luxury:** "Gold", "Ember", "Indigo dye" look the same as "As designed". Mean difference per pixel 0.02, 1.01, 0.03 on a scale of 255.
- **Blue Hour Chapel "Gold"** (0.02), **Ink and Seal "Indigo dye"** (0.07), **Plain Label "Indigo dye"** (1.04): the same.
- **Graphite Precision:** "Berry", "Gold", "Forest", "Ember" look identical to each other, and all five chip dots are near-black.

The only change is a line of text about 4 pixels tall. The picture ends above the button, where the Skin's color mostly goes. The "Start from …" button does not name the Skin that is on. Evidence: `shots/m-ql.png`, `m-bhc.png`, `m-ink.png`, `m-plain.png`, `m-graphite.png`.

### U5-04. The Studio forgets the Skin and credits its colors to the Direction
I started "Unbleached and Indigo" in "Vermilion seal". One notice said so. After a reload the word "Vermilion" is on no screen.

- List of Steps: "Started from Unbleached and Indigo".
- Summary: "This project started from Unbleached and Indigo".
- Step 12, about a brown-red button: "These values come from Unbleached and Indigo." They come from the Skin; the Direction's own card says "the blue marks what a visitor can press".
- Back on the first screen, my Direction's card shows "As designed" as chosen.
- The project file has no word about a Skin.

`PROGRESS.md` lists this as a known gap. The screen does not tell the person.

### U5-07. Phone: identical card pictures, and a tap that shows nothing
- **Step 1:** cards 1 "Name left, links right" and 4 "Links in a left column" are pixel-identical.
- **Step 2:** cards 1 "Headline left" and 3 "Text and photo side by side" are pixel-identical.
- Neither Step says so. The hint is only "Tap a card to see it large. Then tap the main button to pick it."
- When I tapped card 4, the large preview was wholly above the screen; only the button label changed.

The same happens in a desktop window once "Phone" is pressed over a preview. The guide's Part 6 sends the owner to exactly these two Steps. `redteam/FINDINGS.md` row U2-08 says each look-alike Step "says so in words"; at phone width these two do not. I did not compare the large previews themselves at phone width. Evidence: `shots/p05-nav-card4-tapped.png`, `shots/m-phonetiles-hero.png`.

## Minor findings

- **U5-02. Undo and the reason.** "Undone: the Step “List of services” is back to how it was." The reason is gone; the notice does not say so and offers no way back.
- **U5-05. Color words against the eye.** Step 12, list of Steps, and Summary: "close to “Dark purple”: color moved toward red (35° on the color wheel); vividness a little duller (0.09)" for a brown button (rgb 112,51,36), with "Deep red" and "Red-orange" on offer beside it. "Vermilion seal" promises "The orange-red of a seal stamped on a letter" and gives that brown.
- **U5-06. One color named, two set.** "Miami Beach Deco" in "Forest": "A deep green, with grays that lean slightly green." The page's largest block of color is a purple band. The chip dot is split green and purple; nothing says what a split dot means. 60 chips not called "fade" have a split dot. Evidence: `shots/d70-miami-forest-summary.png`.
- **U5-08. Overlays preview at "Phone" width.** "6 Overlays are switched on. The preview shows each one open." I see one and a half. The rest are inside a picture 2,101 pixels tall in a 512-pixel box, with no scroll bar and no hint; the line below says nothing in it moves. On the phone one swipe over the preview scrolled the picture, not the page, and the checkboxes sit below the preview, so later ticks change a picture that is out of view. So: readable on the phone at "Phone" width, but only for the first Overlay; at "Desktop" width the text is about 4 pixels tall.
- **U5-09. "Sample website" on a preview with no website.** With nothing ticked: an empty cream box, the sentence "No Overlay is switched on." in very small type, and the tag. The heading says an Overlay "appears over the page"; the pictures are boxes on an empty page. On the phone the tag covers part of "Cancel your visit", and on the Summary part of the "Book a visit" bar.
- **U5-10. Research rules wording.**
  - Printed twice: "Buttons, menu links, and form fields are at least 44 pixels tall. Buttons, menu links, and form fields are at least 44 pixels tall."
  - "The two closest text sizes are 13 and 13 pixels: the larger is 0 percent larger."
  - Three of five rules: "It is listed so that a later change of the sample website cannot break it unseen." That is a builder's note and reads as noise.
  - Rule in "80 letters", finding in "65 character widths … of the digit 0". "text heights" is not explained.
  - Nothing says what "Holds" means. "Does not hold: Reading text is at least 16 pixels tall." reads as a contradiction until the next sentence. Once I read on, the two labels made sense.
- **U5-11. Trade words in the source lines.** "x-height", "critical print size", "CSS pixels", "modular type scale", "Weber's law and Stevens' power law", "Fitts’s law and the steering law", "Touch targets", "full justification", "search snippet". "The record “…”" is never explained on the Summary or the Overlays screen. Not English: "the figure of 8 pixels is the own arithmetic, from a laboratory finding, of the AI assistant".
- **U5-12. Direction pictures that look alike.** "Ink and Seal" and "Plain Label" are the closest pair of all 703, stand side by side, and offer the same four chip names. Also close: "Sunlit Studio" and "Unbleached and Indigo"; "Soft Daylight" and "Quiet Orbit"; "Field Manual" with each of the three new Directions.
- **U5-13. A group heading folds with no sign.** One click on "LIGHT AND CALM 12 Directions" hides 12 cards; no arrow, no word.
- **U5-14. Small links on the phone.** Group links 23 pixels tall; "Change the Overlays" 19; each "Change" 16; the licences link 16. The Studio's own rule on that screen names 24 as the lower limit.
- **U5-15. The Skin is chosen once.** Changing it means "Start again", which "clears your 1 Decision". The card does not warn and the dialog does not name the Skin.

## Notes

- **U5-16.** "Control Room" starts with "Does not hold: … Reading text is 15 pixels tall." and nothing says that is on purpose. The Step "Text size" is silent at 13 pixels.
- **U5-17.** Card pictures look out of focus at double pixel density. Seen in the installed older Chromium only; worth one look on a real phone.
- **U5-18.** Phone: top bar 313 pixels, start notice 136 pixels stuck to the top, main button 65 pixels stuck to the bottom. A Step opens with no preview and no card on the first screenful.
- **U5-19.** "skin" in the notice, "Skin" on the card. The first Step after choosing a Skin is gray. Guide Part 6 in a narrow window meets "Start again".

## What held

- The first screen explains itself; the four groups and their links work.
- The Skin legend, the chosen chip, and the line under the chips are clear.
- Every notice in guide Part 3 says what happened and offers the way back.
- The six Overlays are easy to understand, each with "Switch it on when" and "What can go wrong". At "Desktop" width the preview shows all six, readable, in the project's colors. Undo says "Undone: the Overlays are back to how they were."
- "Holds" flips to "Does not hold" with the number, and the link to the Step works.
- The download confirms in words and the file was whole.
- The keyboard pass worked end to end, with a visible ring at every stop I logged.
- At 390 pixels nothing scrolls sideways; chips and Overlay rows are 44 pixels tall.
- At "Desktop" width every Step with look-alike cards says so in words.
- No page error, no console error, no request from the page in any run.
