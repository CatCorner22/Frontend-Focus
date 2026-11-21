// Research rules: findings from research, turned into numbers that the Studio can measure on a design.
//
// A research rule is not a floor. A floor cannot be overridden; a research rule is advice with its strength stated. The
// Summary shows, for each rule, whether the design holds it, the number that was measured, why the rule exists, and what a
// person must still check. The set is short on purpose: a rule is here only when a number of the design can answer it.
// A rule on the number of strong colors was written and taken out again on 2026-11-14: its measure could give one answer
// only, and a number that cannot change is not a measure (code review, findings "core 5" and "tests 5").
//
// How strong each rule is, said plainly: research helpers (AI assistants given one research task each) wrote the records
// behind these rules on 2026-11-13 and 2026-11-14, mostly from search summaries. Nobody has read the studies themselves.
// No rule is therefore graded "measured" (that grade needs a source that was read in full and that measured the thing).

import type { DesignParams } from '../params.js';
import type { Evidence, SourceRef } from './types.js';

export interface ResearchFinding {
  holds: boolean;
  /** The measured value, as a sentence. */
  found: string;
}

export interface ResearchRule {
  id: string;
  /** The rule, as a sentence that is either true or false of a design. */
  name: string;
  why: string;
  /** What the measure does not cover, so that a person knows what is left to check. */
  notChecked: string;
  /** True when every Direction and every Skin must hold the rule (a unit test checks it). False when a Direction may depart from it on purpose. */
  binding: boolean;
  /**
   * Who sets the measured value. "design": a Step changes it, so the rule can hold or not. "template": the Template fixes it,
   * so the rule holds for every design of that Template; it is kept to catch a later Template or a changed value, and the
   * Summary says so in words (code review of 2026-11-14: a constant must not pass for a measurement of the design).
   */
  setBy: 'design' | 'template';
  evidence: Evidence;
  sources: SourceRef[];
  /** The date of the last review, as YYYY-MM-DD. */
  reviewed: string;
  measure(params: DesignParams, css: Readonly<Record<string, string>>): ResearchFinding;
}

const KB1 = 'docs/knowledge/kb-perception-cognition.json';
const LANGUAGE = 'docs/knowledge/kb-language-reading.json';
const MATHEMATICS = 'docs/knowledge/kb-mathematics.json';
const REVIEWED = '2026-11-14';
/** A research helper wrote the record from search results and abstracts; nobody has reviewed it. */
const fromRecord = (text: string, record: string): SourceRef => ({ text, basis: 'snippet', record });

/** A length token in pixels: "1.0625rem" is 17, "44px" is 44. A value in another unit is not a number here. */
function pixels(value: string | undefined): number {
  const match = /^(-?\d+(?:\.\d+)?)(rem|px)$/.exec(value ?? '');
  if (!match) return Number.NaN;
  return Number(match[1]) * (match[2] === 'rem' ? 16 : 1);
}

/** The text sizes that a design works out, smallest first. */
const TEXT_SIZES = ['--text-xs', '--text-sm', '--text-base', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl'] as const;

/** A whole number is printed without decimals; any other with at most two. */
const plain = (value: number): string => String(Math.round(value * 100) / 100);

export const READING_SIZE_MIN = 16;
export const LINE_LETTERS_MAX = 80;
export const LINE_HEIGHT_MIN = 1.5;
export const LINE_HEIGHT_MAX = 1.8;
export const SIZE_STEP_MIN = 1.1;
export const TARGET_MIN = 44;

export const RESEARCH_RULES: readonly ResearchRule[] = [
  {
    id: 'reading-size',
    name: `Reading text is at least ${READING_SIZE_MIN} pixels tall`,
    why: 'Reading slows sharply when letters fall below a certain size. At 16 pixels the small letters of most letter styles sit at about that limit, not safely above it; 16 pixels is therefore a lower limit and not a recommendation.',
    notChecked: 'The Studio does not measure how tall the small letters of your letter style are. A letter style with unusually small letters needs a larger size than 16 pixels.',
    binding: false,
    setBy: 'design',
    evidence: 'convention',
    sources: [
      fromRecord('The record “Text size: stay above the critical print size, and measure by x-height”.', KB1),
      fromRecord('The record “A measurable floor for text size: lowercase letters about 8 CSS pixels tall”: the figure of 8 pixels is the own arithmetic, from a laboratory finding, of the AI assistant that gathered this research.', LANGUAGE),
    ],
    reviewed: REVIEWED,
    measure: (_params, css) => {
      const size = pixels(css['--text-base']);
      return { holds: size >= READING_SIZE_MIN, found: `Reading text is ${plain(size)} pixels tall.` };
    },
  },
  {
    id: 'line-length',
    name: `Paragraphs are at most ${LINE_LETTERS_MAX} characters wide`,
    why: 'At the end of a long line the eye must travel far back and can land on the wrong line. The studies of reading on screens are small and partly disagree (in some, longer lines were read faster); understanding and the readers’ own preference favored moderate lines of about 50 to 80 characters, and the published accessibility guideline names 80 as its upper limit.',
    notChecked: 'The Studio reads the limit that the design sets for paragraphs; it does not count the letters of each line on each screen width. The short opening paragraph under a heading follows another limit (a fixed width of 736 pixels) and is not measured. On a narrow phone a line holds far fewer letters; at about 13 letters per line a reader has already lost about a fifth of the fastest reading speed.',
    binding: true,
    setBy: 'template',
    evidence: 'convention',
    sources: [
      fromRecord('The record “Line length: moderate lines, capped near 80 characters”.', KB1),
      fromRecord('The record “Short lines: reading speed holds until about 13 characters per line, and shorter lines help some struggling readers”.', LANGUAGE),
    ],
    reviewed: REVIEWED,
    measure: (_params, css) => {
      const letters = Number(/^(\d+(?:\.\d+)?)ch$/.exec(css['--measure'] ?? '')?.[1] ?? Number.NaN);
      return { holds: letters <= LINE_LETTERS_MAX, found: `Paragraphs in the list of services and in the part about the business are at most ${plain(letters)} characters wide (measured with the digit 0, which is a little wider than an average letter).` };
    },
  },
  {
    id: 'line-height',
    name: 'Lines of reading text stand between 1.5 and 1.8 text heights apart',
    why: 'Lines that stand too close run into each other; lines that stand too far apart stop reading as one paragraph. The value 1.5 comes from the published accessibility guideline. It is a standard, not a measured best value: studies find worse reading only at the extremes. The upper value, 1.8, is a working limit of this Studio.',
    notChecked: 'Headings stand closer together on purpose, and the Studio does not judge them. No formula that ties this distance to the length of a line has support.',
    binding: true,
    setBy: 'template',
    evidence: 'convention',
    sources: [
      fromRecord('The record “Line, letter and word spacing; avoid full justification”.', KB1),
      fromRecord('The record “Letter and line spacing: the defaults are close to best, and \'1.5\' is a standard, not a measured optimum”.', LANGUAGE),
      fromRecord('The record “Line height, line length and font size: ratios are convention, and no formula that links them has support”.', MATHEMATICS),
    ],
    reviewed: REVIEWED,
    measure: (_params, css) => {
      const ratio = Number(css['--leading-body'] ?? Number.NaN);
      return { holds: ratio >= LINE_HEIGHT_MIN && ratio <= LINE_HEIGHT_MAX, found: `Lines of reading text stand ${plain(ratio)} text heights apart.` };
    },
  },
  {
    id: 'size-step',
    name: 'Each text size is at least a tenth larger than the size below it',
    why: 'People tell two sizes apart by their ratio, not by a count of pixels. Two text sizes less than about a tenth apart risk looking like one size.',
    notChecked: 'The tenth is an estimate that an AI assistant drew from laboratory tests of how people judge size. Nobody has tested it on the headings of websites, and no ratio between sizes has evidence that it reads better or looks better than another. On a narrow phone the design caps its largest sizes to fit the screen; the Studio does not measure those capped sizes.',
    binding: true,
    setBy: 'design',
    evidence: 'expert-opinion',
    sources: [
      fromRecord('The record “The smallest useful step between two sizes: Weber\'s law and Stevens\' power law”.', MATHEMATICS),
      fromRecord('The record “A modular type scale gives consistency; no ratio has evidence behind it”.', MATHEMATICS),
    ],
    reviewed: REVIEWED,
    measure: (_params, css) => {
      // Every text size that the design works out, smallest first. The two smallest have a lower limit of their own, so on a
      // design with small reading text two sizes can end up closer than the step that the design asks for.
      const sizes = TEXT_SIZES.map((token) => pixels(css[token]));
      let closest = { ratio: Number.POSITIVE_INFINITY, small: Number.NaN, large: Number.NaN };
      for (let i = 1; i < sizes.length; i++) {
        const ratio = sizes[i]! / sizes[i - 1]!;
        if (!(ratio >= closest.ratio)) closest = { ratio, small: sizes[i - 1]!, large: sizes[i]! };
      }
      const complete = sizes.every((size) => Number.isFinite(size) && size > 0);
      // A hundredth of a percent of slack, so that a step of exactly one tenth is not lost to rounding.
      return {
        holds: complete && closest.ratio >= SIZE_STEP_MIN - 0.0001,
        found: closest.small === closest.large
          ? `Two of the design’s text sizes are the same: ${plain(closest.small)} pixels.`
          : `The two closest text sizes are ${plain(closest.small)} and ${plain(closest.large)} pixels: the larger is ${plain((closest.ratio - 1) * 100)} percent larger.`,
      };
    },
  },
  {
    id: 'target-size',
    name: `Buttons, menu links, and form fields are at least ${TARGET_MIN} pixels tall`,
    why: 'A fingertip covers far more of a screen than a mouse pointer does. The published accessibility guideline asks for at least 24 pixels and, at its strictest level, for 44. The one study that the guideline lists found about 9 millimeters comfortable for a thumb, which on a phone is more than 44 pixels.',
    notChecked: 'Text links inside the page (for example “About repairs”) are 24 pixels tall, which is the guideline’s lower limit, and the business name in the top bar has no set height. The Studio does not measure each control of the built website, nor the gaps between controls.',
    binding: true,
    setBy: 'template',
    evidence: 'convention',
    sources: [
      { text: 'The record “Touch targets: 24 CSS pixels minimum, about 44 for comfort”: an AI assistant read the text of the guideline’s criterion.', basis: 'read', record: KB1 },
      fromRecord('The record “Target size is a physical quantity: convert CSS pixels to millimetres before judging a touch target”.', MATHEMATICS),
    ],
    reviewed: REVIEWED,
    measure: (_params, css) => {
      const size = pixels(css['--target-min']);
      return { holds: size >= TARGET_MIN, found: `They are ${plain(size)} pixels tall.` };
    },
  },
];

export interface ResearchResult extends ResearchFinding {
  rule: ResearchRule;
}

/** Every research rule, measured on one design. `css` is the design's worked-out values (the `css` part of `deriveTokens`). */
export function researchReport(params: DesignParams, css: Readonly<Record<string, string>>): ResearchResult[] {
  return RESEARCH_RULES.map((rule) => ({ rule, ...rule.measure(params, css) }));
}
