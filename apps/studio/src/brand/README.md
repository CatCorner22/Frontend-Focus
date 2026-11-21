# Reverie's pictures in the Studio

Reverie is the Studio's guide (SPEC.md section 2.32; decision D82). These three files are her pictures here.

## Where they came from

The owner supplied the masters in the Reverie character studio package on 2026-11-19. In that package they are
`code/public/brand/cat-library.png`, `cat-handoff.png`, and `cat-icon.png`, and their SHA-256 sums, read from the
package's `SHA256SUMS.txt` and verified against the files on 2026-11-19, are:

- `cat-library.png`: 8d5df93203354b014fadd6c094be80c09d4c5c24e69c2505465cce27cb7d27df
- `cat-handoff.png`: db41773de934cc10b4b10ea718da81ea45eae5e50e664edeeec8615d93e30f57
- `cat-icon.png`: cf01c41ed9456d005b75bdd1828d056afd3afd3c9170d9859deef0370bf04495

## What was changed, and why

The Studio ships as one file with a size budget, so the two poses here are palette copies of the masters: 256 colors,
made with Pillow's `quantize` (FASTOCTREE palette, Floyd–Steinberg dithering) and saved with `optimize`. The library
pose falls from 92,102 bytes to 15,998 and the handoff pose from 63,505 to 9,936. Each copy was inspected beside its
master at display size on 2026-11-19: the ginger patch on the viewer's right, the inner ears, the cheek patches, the
forest-green eyes and outlines, and the props read the same. The icon is the master itself, unchanged: at 64 by 64
pixels it is already small, and an icon is read at small sizes.

The masters stay in the owner's package. Do not edit these copies into a redesign, do not mirror them, and do not
recolor them: the character guide in the owner's package governs her identity. Her pictures never enter the Vision
or any page a customer builds (SPEC.md section 2.32).
