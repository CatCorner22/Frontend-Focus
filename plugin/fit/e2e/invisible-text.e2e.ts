// Finding R-S08 (SPEC.md section 2.31): where the Vision does not write Floor A1, a required text drawn in the very
// color of what lies behind it was counted as found, and the receipt status was 0. The repair counts such a text as
// missing, on the narrow proof that the letters' paint and every layer behind the text are plain colors that the
// program can composite and the two come out the same color. A text that stands even one channel away is still
// counted as found: the program claims only what it can prove, and the contrast reading still lists its ratio.
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { applyDirection, createProject, writeVision } from '@refraction/core';
import { built } from './built.ts';
import { fit, type Receipt } from '../src/fit.ts';

const LOCAL_BROWSER = process.env['PW_CHROMIUM'] ? { executablePath: process.env['PW_CHROMIUM'] } : {};
let browser: Browser;
beforeAll(async () => {
  browser = await chromium.launch({ ...LOCAL_BROWSER });
});
afterAll(async () => {
  await browser.close();
});

/** The lenient Vision: Contrast checks is "Warn me", so the Vision writes no Floor A1; contrast is listed, never required. */
const lenient = { ...writeVision({ ...applyDirection(createProject('Invisible text'), 'paper-and-ink'), a11y: 'advise' }) };
const reference = built(lenient['mockup.html'] ?? '');

const content = (receipt: Receipt) => {
  const found = receipt.measured.find((m) => m.id === 'content');
  if (!found) throw new Error('The receipt has no Content measure.');
  return found;
};
const recolorHeadline = (html: string, style: string): string => {
  const next = html.replace('<h1', `<h1 style="${style}"`);
  if (next === html) throw new Error('The planted recoloring could not be added to the reference build.');
  return next;
};

describe('Finding R-S08: a required text in the color of its background', () => {
  it('counts the headline as missing, and the receipt status is 1, where the Vision writes no Floor A1', async () => {
    const html = recolorHeadline(reference, 'background-color:#123456;color:#123456');
    const { receipt, status } = await fit({ files: lenient, html, browser });
    expect(content(receipt).items.some((line) => line.startsWith('the headline is not where a person can read it'))).toBe(true);
    expect(status).toBe(1);
  });

  it('counts the headline as missing where its letters are filled in the background color', async () => {
    const html = recolorHeadline(reference, 'background-color:#123456;-webkit-text-fill-color:#123456');
    const { receipt, status } = await fit({ files: lenient, html, browser });
    expect(content(receipt).items.some((line) => line.startsWith('the headline is not where a person can read it'))).toBe(true);
    expect(status).toBe(1);
  });

  it('still counts a headline that stands one channel from its background: the program claims only what it can prove', async () => {
    const html = recolorHeadline(reference, 'background-color:#123456;color:#123457');
    const { receipt } = await fit({ files: lenient, html, browser });
    expect(content(receipt).items).toEqual([]);
  });

  it('passes the unaltered reference build under the lenient Vision', async () => {
    const { receipt, status } = await fit({ files: lenient, html: reference, browser });
    expect(content(receipt).items).toEqual([]);
    expect(status).toBe(0);
  });

  it('still fails the same page where the Vision writes Floor A1', async () => {
    const strict = { ...writeVision({ ...applyDirection(createProject('Invisible text'), 'paper-and-ink'), a11y: 'enforce' }) };
    const html = recolorHeadline(built(strict['mockup.html'] ?? ''), 'background-color:#123456;color:#123456');
    const { status } = await fit({ files: strict, html, browser });
    expect(status).toBe(1);
  });
});
