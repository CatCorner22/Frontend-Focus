// Skins: pre-built colors for a Direction.
//
// A Direction sets everything at once: layout, letters, shapes, and colors. A skin changes the colors only: the main color,
// the second color where the page has one, the tint of the grays, and whether the headline carries a color fade (designers
// call a fade a gradient). Layout, letters, and shapes stay as the Direction made them. How light and how vivid the main
// color is also stays, because the Direction's readable contrast depends on it.
//
// Every skin is the composition of the assistant that wrote this Studio. No outside source was consulted for the choice of
// colors, and no person has reviewed them. Which skins a Direction offers is a list on the Direction record; a unit test holds
// that each listed pair starts without a clash between its choices and with every measured color pair passing.

import type { DesignParams, DisplayTreatment } from '../params.js';
import type { Direction } from './directions.js';
import type { Evidence, SourceRef } from './types.js';

export interface Skin {
  id: string;
  name: string;
  /** What the skin looks like, in plain words. */
  what: string;
  /** Which color the main color is, as a place on the color wheel (0 to 360). */
  accentHue: number;
  /** The second color: the far end of a fade, and the second color of a two-color page. `null`: the skin has one color. */
  accent2Hue: number | null;
  /** The tint of the grays, as a place on the color wheel. */
  neutralHue: number;
  /** How vivid the main color is, where the skin must set it (a skin without color). Otherwise the Direction's value stays. */
  accentChroma?: number;
  /** How the largest headline is filled: one color, or a fade. */
  displayTreatment: DisplayTreatment;
  sources: SourceRef[];
  evidence: Evidence;
  /** The date on which the record was written or last checked, as YYYY-MM-DD. */
  reviewed: string;
}

/**
 * Where each Skin comes from. A Skin is the builder's own composition: a place on the color wheel for the main color and a
 * tint for the grays. No outside source gives these values (code review of 2026-11-14, finding DT-02).
 */
const COMPOSED: SourceRef = { text: 'Composed by the assistant that wrote this Studio and judged by eye on rendered Mockups. No outside source was consulted for the colors.', basis: 'builder' };
const JAPANESE: SourceRef = { text: 'The record “Traditional Japanese colour names have no single screen value”: a tradition, not an experiment. The values of this Skin are the Studio’s own, inside the color family that the name describes.', basis: 'snippet', record: 'docs/knowledge/kb-japanese-design.json' };
const own = { sources: [COMPOSED], evidence: 'expert-opinion' as const, reviewed: '2026-11-14' };
const fromStudy = { sources: [JAPANESE, COMPOSED], evidence: 'expert-opinion' as const, reviewed: '2026-11-14' };

// A Skin's text says which color, and nothing about how light or how vivid it is: the Direction keeps those, so the same
// Skin is lighter on a dark page and duller on a quiet one (review of 2026-11-14, finding DT-01: the texts said "deep",
// "clear", and "near-black", which was untrue on many Directions).
export const SKINS: readonly Skin[] = [
  { id: 'ocean', name: 'Ocean', what: 'Blue as the main color, with grays that lean slightly blue.', accentHue: 245, accent2Hue: null, neutralHue: 245, displayTreatment: 'solid', ...own },
  { id: 'lagoon', name: 'Lagoon fade', what: 'Blue-green that fades into blue across the headline.', accentHue: 195, accent2Hue: 255, neutralHue: 215, displayTreatment: 'accent-gradient', ...own },
  { id: 'forest', name: 'Forest', what: 'Green as the main color, with grays that lean slightly green.', accentHue: 152, accent2Hue: null, neutralHue: 150, displayTreatment: 'solid', ...own },
  { id: 'meadow', name: 'Meadow fade', what: 'Green that fades into yellow-green across the headline.', accentHue: 140, accent2Hue: 100, neutralHue: 120, displayTreatment: 'accent-gradient', ...own },
  { id: 'sunset', name: 'Sunset fade', what: 'Orange that fades into rose pink across the headline.', accentHue: 42, accent2Hue: 355, neutralHue: 50, displayTreatment: 'accent-gradient', ...own },
  { id: 'ember', name: 'Ember', what: 'Red-orange as the main color, with grays that lean slightly warm.', accentHue: 28, accent2Hue: null, neutralHue: 45, displayTreatment: 'solid', ...own },
  { id: 'berry', name: 'Berry', what: 'Rose red as the main color, with grays that lean slightly pink.', accentHue: 355, accent2Hue: null, neutralHue: 350, displayTreatment: 'solid', ...own },
  { id: 'orchid', name: 'Orchid fade', what: 'Pink-purple that fades into violet across the headline.', accentHue: 320, accent2Hue: 275, neutralHue: 300, displayTreatment: 'accent-gradient', ...own },
  { id: 'violet', name: 'Violet', what: 'Blue-purple as the main color, with grays that lean slightly purple.', accentHue: 288, accent2Hue: null, neutralHue: 285, displayTreatment: 'solid', ...own },
  { id: 'gold', name: 'Gold', what: 'Yellow-brown as the main color, with grays that lean slightly yellow.', accentHue: 82, accent2Hue: null, neutralHue: 78, displayTreatment: 'solid', ...own },
  { id: 'graphite', name: 'Graphite', what: 'Almost no color: the main color turns gray, and the headline fades softly from top to bottom.', accentHue: 255, accent2Hue: null, neutralHue: 255, accentChroma: 0.02, displayTreatment: 'ink-gradient', ...own },
  // One Skin from the study of Japanese design (decision D52). The name says what a person sees. No screen value of a
  // "traditional" color exists (the research record says so), so this is the Studio's own value inside the color family.
  // A second one, "Vermilion seal", was taken out on 2026-11-14: no Direction could show it as the orange-red its text named.
  { id: 'indigo', name: 'Indigo dye', what: 'A quiet, grayed blue, like cloth dyed with indigo, with grays that lean slightly warm.', accentHue: 250, accent2Hue: null, neutralHue: 85, accentChroma: 0.09, displayTreatment: 'solid', ...fromStudy },
];

const SKIN_TABLE = new Map<string, Skin>(SKINS.map((skin) => [skin.id, skin]));
export const findSkin = (id: string): Skin | undefined => SKIN_TABLE.get(id);

const turn = (hue: number, by: number): number => (((hue + by) % 360) + 360) % 360;

/**
 * The design values of a Direction in one of the skins. Only color values change.
 * A two-color skin shows its second color where the Direction's page has room for one: on a page with one main color or with
 * two colors. A page that is tinted as a whole, or that uses color in small details only, keeps its way of using color.
 * A one-color skin on a two-color Direction keeps the Direction's distance between the two colors.
 */
export function skinParams(direction: Direction, skin: Skin): DesignParams {
  const p = direction.params;
  const twoColors = p.colorStrategy === 'duo' || p.colorStrategy === 'single-accent';
  const out: DesignParams = { ...p, accentHue: skin.accentHue, neutralHue: skin.neutralHue, displayTreatment: skin.displayTreatment };
  if (skin.accentChroma !== undefined) out.accentChroma = skin.accentChroma;
  if (skin.accent2Hue !== null && twoColors) {
    out.colorStrategy = 'duo';
    out.accent2Hue = skin.accent2Hue;
  } else if (p.colorStrategy === 'duo') {
    out.accent2Hue = turn(skin.accentHue, p.accent2Hue - p.accentHue);
  }
  return out;
}

/** The skins that a Direction offers, in the order of its record. A Direction without a list (a generated one) offers none. */
export function skinsOf(direction: Direction): Skin[] {
  return (direction.skins ?? []).map((id) => findSkin(id)).filter((skin): skin is Skin => skin !== undefined);
}

/**
 * True when a Direction may offer a Skin: the Skin's color must show, and the Skin's text must be true of what is drawn
 * (review of 2026-11-14, findings DT-01 and U5-03). A unit test holds every listed pair to this rule.
 * - The Direction paints its main color on something large (a button, a band). A "quiet" Direction uses it for small marks
 *   only, so another color would change almost nothing a person can see.
 * - The main color is vivid enough to be told from gray, unless the Skin sets how vivid it is.
 * - Red-orange turns brown when dark, so "Ember" needs a main color that is neither dark nor dull.
 * - "Indigo dye" is a quiet blue only on a light page with a main color that is not light.
 * - A fade needs a page that can carry the Skin's second color.
 */
export function skinFits(direction: Direction, skin: Skin): boolean {
  const p = direction.params;
  if (p.colorStrategy === 'quiet') return false;
  if (skin.accentChroma === undefined && p.accentChroma < 0.1) return false;
  if (skin.id === 'ember' && (p.accentLightness < 0.45 || p.accentChroma < 0.13)) return false;
  if (skin.id === 'indigo' && (p.theme !== 'light' || p.accentLightness > 0.55)) return false;
  if (skin.accent2Hue !== null && p.colorStrategy !== 'duo' && p.colorStrategy !== 'single-accent') return false;
  return true;
}

