// Reverie in the Studio (SPEC.md section 2.32; decision D82): her words are the approved ones, her pictures carry no
// meaning and stay small enough for the one file, and nothing of her enters the Vision a customer builds from.
import { statSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { applyDirection, createProject, writeVision } from '@refraction/core';
import { REVERIE } from '../src/reverie';
import { ReverieArt } from '../src/BrandArt';

describe('Reverie, the Studio’s guide', () => {
  it('introduces herself in the approved words, shared by every surface', () => {
    expect(REVERIE.name).toBe('Reverie');
    expect(REVERIE.pronunciation).toBe('REV-uh-ree');
    expect(REVERIE.meaning).toBe('a pleasant daydream');
    expect(REVERIE.introduction).toBe("Hello, I'm Reverie. My name means a pleasant daydream. I'll help you turn what you imagine into a thoughtful design, one small step at a time.");
  });

  it('shows her pictures as decoration, with the place reserved and no words of their own', () => {
    for (const pose of ['library', 'handoff'] as const) {
      const html = renderToStaticMarkup(createElement(ReverieArt, { pose }));
      expect(html).toContain('alt=""');
      expect(html).toMatch(/width="\d+" height="\d+"/);
      expect(html).toContain(`reverie-art--${pose}`);
    }
  });

  it('keeps each picture small enough for the one file the Studio ships as', () => {
    const caps: [string, number][] = [['cat-library.png', 20_000], ['cat-handoff.png', 14_000], ['cat-icon.png', 8_000]];
    for (const [file, cap] of caps) {
      expect(statSync(new URL(`../src/brand/${file}`, import.meta.url)).size, file).toBeLessThanOrEqual(cap);
    }
  });

  it('keeps her out of the Vision: no name and no PNG picture in any of the seven files', () => {
    // The Mockup carries its own inline SVG pictures; her pictures are PNG, and neither they nor her name may travel.
    const files = writeVision(applyDirection(createProject('Brand test'), 'paper-and-ink'));
    for (const text of Object.values(files)) {
      expect(text).not.toContain('Reverie');
      expect(text).not.toContain('data:image/png');
    }
  });
});
