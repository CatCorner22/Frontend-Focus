import library from './brand/cat-library.png?inline';
import handoff from './brand/cat-handoff.png?inline';

/**
 * Reverie, the Studio's guide, as a picture. Her pictures are decoration: they carry no instruction, no status,
 * and no claim, so each has an empty alt text, and its place is reserved at its drawn size so that the page does
 * not move when the picture arrives. The Studio ships as one file, so each picture travels inside that file as a
 * data address and asks the network for nothing. Provenance and the size copies: `src/brand/README.md`.
 */
export function ReverieArt({ pose }: { pose: 'library' | 'handoff' }): React.JSX.Element {
  return pose === 'library' ? (
    <img src={library} alt="" width={384} height={351} className="reverie-art reverie-art--library" loading="lazy" decoding="async" />
  ) : (
    <img src={handoff} alt="" width={320} height={292} className="reverie-art reverie-art--handoff" loading="lazy" decoding="async" />
  );
}
