// Floor A9 (target size, WCAG 2.2 success criterion 2.5.8) in the Fit check (SPEC.md section 2.30; research record 13).
// The geometry tests need no browser: the spacing test of the standard is arithmetic on bounding boxes. The browser tests
// plant small, crowded targets in the reference build and read the Floors measure of the receipt.
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { applyDirection, createProject, writeVision } from '@refraction/core';
import { built } from './built.ts';
import { fit, type Receipt } from '../src/fit.ts';
import { belowEnhanced, targetFailures, type TargetBox } from '../src/floors.ts';

const box = (label: string, left: number, top: number, width: number, height: number, inline = false): TargetBox => ({ label, left, top, width, height, inline });

describe('Floor A9: the spacing arithmetic of the standard', () => {
  it('passes a target of exactly 24 by 24 pixels, however crowded', () => {
    const targets = [box('a', 0, 0, 24, 24), box('b', 25, 0, 24, 24), box('c', 50, 0, 24, 24)];
    expect(targetFailures(targets)).toEqual([]);
  });

  it('passes an undersized target that stands alone: the spacing exception', () => {
    expect(targetFailures([box('only', 0, 0, 16, 16)])).toEqual([]);
    expect(targetFailures([box('only', 0, 0, 16, 16), box('far', 200, 0, 48, 48)])).toEqual([]);
  });

  it('fails two undersized targets whose 24 pixel circles intersect', () => {
    // Two 16 pixel buttons with a 4 pixel gap: their centers stand 20 pixels apart, less than the 24 pixel diameter.
    const targets = [box('a', 0, 0, 16, 16), box('b', 20, 0, 16, 16)];
    expect(targetFailures(targets).map((t) => t.label)).toEqual(['a', 'b']);
  });

  it('passes two undersized targets whose circles only just clear each other', () => {
    // A 9 pixel gap: the centers stand 25 pixels apart.
    const targets = [box('a', 0, 0, 16, 16), box('b', 25, 0, 16, 16)];
    expect(targetFailures(targets)).toEqual([]);
  });

  it('fails an undersized target whose circle reaches a full-size neighbour', () => {
    // The small target's center stands 8 pixels from its own edge; the neighbour begins 2 pixels later, 10 from the center:
    // inside the 12 pixel radius.
    const targets = [box('small', 0, 0, 16, 16), box('big', 18, 0, 48, 48)];
    expect(targetFailures(targets).map((t) => t.label)).toEqual(['small']);
  });

  it('passes an undersized target with clear space before a full-size neighbour', () => {
    const targets = [box('small', 0, 0, 16, 16), box('big', 28, 0, 48, 48)];
    expect(targetFailures(targets)).toEqual([]);
  });

  it('never counts an inline link inside a sentence (the inline exception)', () => {
    const targets = [box('sentence link', 0, 0, 30, 12, true), box('a', 32, 0, 16, 16), box('b', 52, 0, 16, 16)];
    // The two buttons crowd each other and fail; the sentence link is not a target for this test at all.
    expect(targetFailures(targets).map((t) => t.label)).toEqual(['a', 'b']);
  });

  it('reads the distance to the higher bar of 44 by 44 pixels as information, apart from failure', () => {
    const targets = [box('floor size', 0, 0, 24, 24), box('human size', 100, 0, 44, 44), box('wide but short', 200, 0, 48, 30), box('sentence link', 300, 0, 60, 12, true)];
    expect(belowEnhanced(targets).map((t) => t.label)).toEqual(['floor size', 'wide but short']);
  });
});

const LOCAL_BROWSER = process.env['PW_CHROMIUM'] ? { executablePath: process.env['PW_CHROMIUM'] } : {};
let browser: Browser;
beforeAll(async () => {
  browser = await chromium.launch({ ...LOCAL_BROWSER });
});
afterAll(async () => {
  await browser.close();
});

/** A project whose Vision writes every Floor: Contrast checks is "Fix for me". */
const files = { ...writeVision({ ...applyDirection(createProject('Target size'), 'paper-and-ink'), a11y: 'enforce' }) };
const reference = built(files['mockup.html'] ?? '');
const floors = (receipt: Receipt) => {
  const found = receipt.measured.find((m) => m.id === 'floors');
  if (!found) throw new Error('The receipt has no Floors measure.');
  return found;
};
const inBody = (extra: string): string => {
  const next = reference.replace('</body>', `${extra}</body>`);
  if (next === reference) throw new Error('The planted target could not be added to the reference build.');
  return next;
};
const a9Lines = (receipt: Receipt): string[] => floors(receipt).items.filter((line) => line.startsWith('A9:'));

describe('Floor A9: the Fit check on a built page', () => {
  it('names A9 among the requirements of which it checks a part', async () => {
    const { receipt } = await fit({ files, html: reference, browser });
    expect(floors(receipt).information.some((line) => line.startsWith('A9:'))).toBe(true);
    expect(receipt.stillNeedsPerson.at(-1) ?? '').not.toContain('A9,');
  });

  it('reports two small, crowded buttons, and the receipt status is 1', async () => {
    const html = inBody('<button type="button" aria-label="Planted one" style="width:16px;height:16px;padding:0"></button><button type="button" aria-label="Planted two" style="width:16px;height:16px;padding:0;margin-left:2px"></button>');
    const { receipt, status } = await fit({ files, html, browser });
    expect(a9Lines(receipt).length).toBeGreaterThan(0);
    expect(status).toBe(1);
  });

  it('reports no A9 line for one small button with clear space around it', async () => {
    const html = inBody('<div style="padding:60px"><button type="button" aria-label="Planted alone" style="width:16px;height:16px;padding:0"></button></div>');
    const { receipt } = await fit({ files, html, browser });
    expect(a9Lines(receipt)).toEqual([]);
  });

  it('reports no A9 line for a small link inside a sentence', async () => {
    const html = inBody('<p style="font-size:12px;line-height:1.2">A sentence with a <a href="#main">small link</a> inside it, and more words after it so that the link stands inside the sentence.</p>');
    const { receipt } = await fit({ files, html, browser });
    expect(a9Lines(receipt)).toEqual([]);
  });

  it('says nothing about A9 when the Vision does not write it', async () => {
    const lenient = { ...writeVision({ ...applyDirection(createProject('Target size'), 'paper-and-ink'), a11y: 'advise' }) };
    const html = built(lenient['mockup.html'] ?? '').replace('</body>', '<button type="button" aria-label="Planted one" style="width:16px;height:16px;padding:0"></button><button type="button" aria-label="Planted two" style="width:16px;height:16px;padding:0;margin-left:2px"></button></body>');
    const { receipt } = await fit({ files: lenient, html, browser });
    expect(a9Lines(receipt)).toEqual([]);
    expect(floors(receipt).information.some((line) => line.startsWith('A9:'))).toBe(false);
  });

  it('reports the distance to 44 by 44 pixels in the Floors note, as information', async () => {
    const { receipt } = await fit({ files, html: reference, browser });
    expect(floors(receipt).note).toMatch(/Beyond the Floor, as information: at \d+ pixels, \d+ of \d+ targets are smaller than 44 by 44 pixels/);
  });
});
