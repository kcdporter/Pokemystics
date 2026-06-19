/* Full-viewport constellation field. Ambient mode scatters all candidate
   constellations across the page; "selected" mode brings a chosen set to
   specific target positions (the spread layout) and dims the rest. */
import { useMemo, type CSSProperties } from "react";
import { Constellation } from "./Constellation";

export interface SelectedConstellation {
  dex: number;
  /** Target x in % of viewport (0-100). */
  x: number;
  /** Target y in % of viewport (0-100). */
  y: number;
  size?: number;
}

export function ConstellationField({
  dexes,
  selected,
  ambientBrightness = 0.22,
  selectedBrightness = 1,
}: {
  dexes: number[];
  selected?: SelectedConstellation[];
  ambientBrightness?: number;
  selectedBrightness?: number;
}) {
  // stable scattered position per dex so the field doesn't reshuffle on re-render
  const positions = useMemo(() => {
    const m = new Map<number, { x: number; y: number; size: number }>();
    for (const d of dexes) {
      const r1 = pseudo(d, 1);
      const r2 = pseudo(d, 2);
      const r3 = pseudo(d, 3);
      m.set(d, {
        x: 8 + r1 * 84,
        y: 10 + r2 * 80,
        size: 122 + r3 * 122,
      });
    }
    return m;
  }, [dexes]);

  const selectedMap = useMemo(() => {
    const m = new Map<number, SelectedConstellation>();
    if (selected) for (const s of selected) m.set(s.dex, s);
    return m;
  }, [selected]);
  const inSelectMode = !!(selected && selected.length > 0);

  return (
    <div className="constellation-field" aria-hidden="true">
      {dexes.map((d) => {
        const pos = positions.get(d)!;
        const sel = selectedMap.get(d);
        // In select mode the unselected constellations are pushed outward
        // from center (toward the edges) so they don't crowd the cards.
        const pushed = inSelectMode && !sel ? pushOut(pos) : pos;
        const x = sel ? sel.x : pushed.x;
        const y = sel ? sel.y : pushed.y;
        const size = sel?.size ?? pos.size;
        const brightness = sel
          ? selectedBrightness
          : inSelectMode
            ? ambientBrightness * 0.55
            : ambientBrightness;
        return (
          <div
            key={d}
            className={"constellation-slot" + (sel ? " selected" : "")}
            style={
              {
                left: x + "%",
                top: y + "%",
                "--brightness": brightness,
              } as CSSProperties
            }
          >
            <Constellation dex={d} size={size} />
          </div>
        );
      })}
    </div>
  );
}

function pushOut(pos: { x: number; y: number }): { x: number; y: number } {
  const dx = pos.x - 50;
  const dy = pos.y - 50;
  const factor = 1.35;
  const x = Math.max(4, Math.min(96, 50 + dx * factor));
  const y = Math.max(4, Math.min(96, 50 + dy * factor));
  return { x, y };
}

// Deterministic [0, 1) per (dex, channel).
function pseudo(dex: number, channel: number): number {
  const x = Math.sin(dex * 9301 + channel * 49297) * 233280;
  return x - Math.floor(x);
}
