/* The card sigil: an alchemy ring and dex numeral wrapping the creature itself.
   When a vendored sprite exists for the dex (see public/mons and the sprites
   manifest) the Pokemon's shape is drawn as a type-tinted silhouette; otherwise
   it falls back to a monoline elemental glyph for the type(s). */
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { TYPES, type Card, type GlyphKey } from "../data/cards";
import { SPRITE_DEXES } from "../data/sprites";

// ---- Monoline elemental glyphs. Each draws centered in a 100x100 box. ----
// Returned as an array of <path>/<g> children; stroke set by parent (currentColor).
const GLYPHS: Record<GlyphKey, (k: string) => ReactNode[]> = {
  fire: (k) => [
    <path
      key={k + "a"}
      d="M50 14 C40 30 30 38 30 56 a20 20 0 0 0 40 0 c0 -13 -7 -20 -12 -30 c-3 8 -8 10 -12 14 c1 -12 4 -22 4 -26 Z"
    />,
  ],
  water: (k) => [
    <path key={k} d="M50 16 C50 16 26 46 26 62 a24 24 0 0 0 48 0 C74 46 50 16 50 16 Z" />,
  ],
  electric: (k) => [<path key={k} d="M56 14 L30 54 H48 L42 86 L72 42 H52 Z" />],
  grass: (k) => [
    <path key={k + "a"} d="M50 84 C50 60 50 34 78 18 C78 50 70 78 50 84 Z" />,
    <path key={k + "b"} d="M50 84 C50 60 50 40 26 26 C26 54 34 78 50 84 Z" />,
    <path key={k + "c"} d="M50 84 V52" fill="none" />,
  ],
  ice: (k) => {
    const arms: ReactNode[] = [];
    for (let i = 0; i < 6; i++) {
      arms.push(
        <line key={k + i} x1={50} y1={50} x2={50} y2={16} transform={`rotate(${i * 60} 50 50)`} />,
      );
      arms.push(
        <line
          key={k + "b" + i}
          x1={50}
          y1={26}
          x2={43}
          y2={19}
          transform={`rotate(${i * 60} 50 50)`}
        />,
      );
      arms.push(
        <line
          key={k + "c" + i}
          x1={50}
          y1={26}
          x2={57}
          y2={19}
          transform={`rotate(${i * 60} 50 50)`}
        />,
      );
    }
    return arms;
  },
  fighting: (k) => [
    <circle key={k + "o"} cx={50} cy={50} r={18} fill="none" />,
    <path
      key={k + "s"}
      d="M50 24 L54 40 L70 36 L58 50 L70 64 L54 60 L50 76 L46 60 L30 64 L42 50 L30 36 L46 40 Z"
      fill="none"
    />,
  ],
  poison: (k) => [
    <path
      key={k + "d"}
      d="M50 18 C50 18 30 44 30 58 a20 20 0 0 0 40 0 C70 44 50 18 50 18 Z"
      fill="none"
    />,
    <circle key={k + "e1"} cx={43} cy={54} r={3.4} />,
    <circle key={k + "e2"} cx={57} cy={54} r={3.4} />,
    <path key={k + "m"} d="M44 66 q6 6 12 0" fill="none" />,
  ],
  ground: (k) => [
    <path key={k + "a"} d="M18 74 L40 38 L54 60 L64 44 L82 74 Z" fill="none" />,
    <path key={k + "b"} d="M34 74 L44 56" fill="none" />,
  ],
  flying: (k) => [
    <path key={k} d="M20 44 C40 36 60 38 82 56 C66 50 58 52 50 58 C46 50 36 46 20 44 Z" />,
    <path key={k + "2"} d="M30 46 C40 52 46 54 52 56" fill="none" />,
  ],
  psychic: (k) => [
    <path
      key={k}
      fill="none"
      d="M50 50 m0 0 C40 50 36 40 44 34 C56 26 70 36 70 50 C70 70 50 80 34 70 C16 58 20 32 40 22 C62 11 86 28 86 52"
    />,
  ],
  bug: (k) => [
    <path key={k + "h"} d="M50 28 L70 39 V61 L50 72 L30 61 V39 Z" fill="none" />,
    <line key={k + "a1"} x1={50} y1={28} x2={43} y2={16} />,
    <line key={k + "a2"} x1={50} y1={28} x2={57} y2={16} />,
    <circle key={k + "c"} cx={50} cy={50} r={6} fill="none" />,
  ],
  rock: (k) => [
    <path key={k + "a"} d="M30 40 L50 26 L72 38 L68 64 L42 72 L26 58 Z" fill="none" />,
    <path key={k + "b"} d="M50 26 L50 48 L68 64 M50 48 L26 58" fill="none" />,
  ],
  ghost: (k) => [
    <path
      key={k + "b"}
      fill="none"
      d="M30 70 V46 a20 20 0 0 1 40 0 V70 l-7 -7 -6 7 -7 -7 -6 7 -8 -7 Z"
    />,
    <circle key={k + "e1"} cx={42} cy={48} r={3.2} />,
    <circle key={k + "e2"} cx={58} cy={48} r={3.2} />,
  ],
  dragon: (k) => [
    <path
      key={k}
      fill="none"
      d="M26 64 C26 44 44 40 50 50 C56 60 70 56 74 40 C75 52 70 64 56 66 C66 70 70 64 74 60 C72 74 58 78 48 70 C40 64 34 64 26 64 Z"
    />,
    <path key={k + "s"} d="M50 50 l-4 -10 l8 2 Z" />,
  ],
  fairy: (k) => [
    <path key={k + "m"} fill="none" d="M62 28 a24 24 0 1 0 0 44 a18 18 0 0 1 0 -44 Z" />,
    <path key={k + "s"} d="M34 30 l2 7 7 2 -7 2 -2 7 -2 -7 -7 -2 7 -2 Z" />,
  ],
  normal: (k) => [
    <path key={k} fill="none" d="M50 22 L57 43 L79 43 L61 56 L68 78 L50 64 L32 78 L39 56 L21 43 L43 43 Z" />,
  ],
  steel: (k) => [
    <path key={k} fill="none" d="M50 22 L72 35 L72 65 L50 78 L28 65 L28 35 Z" />,
    <line key={k + "x1"} x1={32} y1={38} x2={68} y2={62} />,
    <line key={k + "x2"} x1={68} y1={38} x2={32} y2={62} />,
  ],
  dark: (k) => [
    <path key={k + "e"} fill="none" d="M22 50 Q50 24 78 50 Q50 76 22 50 Z" />,
    <circle key={k + "p"} cx={50} cy={50} r={6} />,
  ],
};

// ---------- The Sigil ----------
export function Sigil({ card }: { card: Card }) {
  const types = card.types.map((t) => TYPES[t]);
  const primary = types[0];
  const secondary = types[1] ?? null;
  const hasSprite = SPRITE_DEXES.has(card.dex);
  // deterministic seed from dex for ring decoration
  const seed = card.dex;
  const ticks = useMemo(() => {
    const arr: { a: number; long: boolean }[] = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const long = i % 3 === 0;
      arr.push({ a: (360 / count) * i, long });
    }
    return arr;
  }, []);
  const runeCount = 12;
  const runes = useMemo(() => {
    const r: { a: number; on: boolean }[] = [];
    for (let i = 0; i < runeCount; i++) {
      r.push({ a: (360 / runeCount) * i + (seed % 7), on: ((seed >> i) & 1) === 1 || i % 2 === 0 });
    }
    return r;
  }, [seed]);

  return (
    <div className="sigil-stack">
    <svg viewBox="0 0 200 200" className="sigil-svg" aria-hidden="true">
      {/* outer alchemy ring */}
      <circle cx={100} cy={100} r={94} className="sg-ring sg-ring-out" />
      <circle cx={100} cy={100} r={82} className="sg-ring sg-ring-in" />
      {/* tick marks */}
      <g className="sg-ticks">
        {ticks.map((t, i) => (
          <line
            key={"t" + i}
            x1={100}
            y1={8}
            x2={100}
            y2={t.long ? 18 : 14}
            transform={`rotate(${t.a} 100 100)`}
          />
        ))}
      </g>
      {/* rune dots ring */}
      <g className="sg-runes">
        {runes.map((rn, i) => (
          <circle
            key={"r" + i}
            cx={100}
            cy={26}
            r={rn.on ? 2.4 : 1.2}
            transform={`rotate(${rn.a} 100 100)`}
            className={rn.on ? "sg-rune on" : "sg-rune"}
          />
        ))}
      </g>
      {/* inner star field anchors (triangle for arcana) */}
      <circle cx={100} cy={100} r={58} className="sg-ring sg-ring-core" />
      {/* type glyph(s) — only when we have no vendored sprite for this dex */}
      {!hasSprite ? (
        <>
          <g
            transform="translate(50 46) scale(1)"
            style={{ color: primary.c }}
            className="sg-glyph sg-glyph-primary"
          >
            {(GLYPHS[primary.glyph] || GLYPHS.normal)("p")}
          </g>
          {secondary ? (
            <g
              transform="translate(106 104) scale(0.5)"
              style={{ color: secondary.c }}
              className="sg-glyph sg-glyph-secondary"
            >
              {(GLYPHS[secondary.glyph] || GLYPHS.normal)("s")}
            </g>
          ) : null}
        </>
      ) : null}
      {/* dex numeral plate */}
      <text x={100} y={176} className="sg-dex" textAnchor="middle">
        {"№ " + String(card.dex).padStart(3, "0")}
      </text>
    </svg>
    {/* the creature itself: a type-tinted silhouette (fill) with the sprite's
        own linework multiplied back in faintly (detail) for a shadow of detail */}
    {hasSprite ? (
      <div
        className="sigil-mon"
        style={{ "--mon": `url(/mons/${card.dex}.png)`, color: primary.c } as CSSProperties}
        aria-hidden="true"
      >
        <div className="sigil-mon-fill" />
        <div className="sigil-mon-detail" />
      </div>
    ) : null}
    </div>
  );
}

// ---------- Card back (face-down) emblem ----------
export function CardBack() {
  return (
    <svg viewBox="0 0 200 280" className="back-svg" aria-hidden="true">
      <rect x={10} y={10} width={180} height={260} rx={14} className="bk-frame" />
      <rect x={18} y={18} width={164} height={244} rx={10} className="bk-frame bk-frame2" />
      {/* central orb (pokeball-as-sun-sigil) */}
      <circle cx={100} cy={140} r={46} className="bk-orb" />
      <line x1={54} y1={140} x2={146} y2={140} className="bk-line" />
      <circle cx={100} cy={140} r={15} className="bk-orb-core" />
      <circle cx={100} cy={140} r={8} className="bk-orb-pip" />
      {/* radiating rays */}
      <g className="bk-rays">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={100} y1={80} x2={100} y2={70} transform={`rotate(${i * 22.5} 100 140)`} />
        ))}
      </g>
      {/* wordmark */}
      <text x={100} y={246} className="bk-word" textAnchor="middle">
        POKEMYSTICS
      </text>
    </svg>
  );
}
