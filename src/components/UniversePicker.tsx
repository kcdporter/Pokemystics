/* The Pokémon-generation universe picker in the top bar. Each universe carries
   its own deck and reading complexity; see src/universes/. */
import { UNIVERSES, type UniverseId } from "../universes";

export function UniversePicker({
  universe,
  setUniverse,
}: {
  universe: UniverseId;
  setUniverse: (u: UniverseId) => void;
}) {
  return (
    <div className="universe-picker" role="radiogroup" aria-label="Pokémon generation universe">
      <span className="tp-label">Universe</span>
      {UNIVERSES.map((u) => {
        const playable = u.deck.length > 0;
        return (
          <button
            key={u.id}
            className={"up-chip" + (universe === u.id ? " active" : "")}
            data-k={u.id}
            title={playable ? `${u.label} — ${u.tagline}` : `${u.label} — coming soon`}
            aria-label={`${u.label} ${u.tagline}`}
            aria-checked={universe === u.id}
            aria-disabled={!playable}
            role="radio"
            disabled={!playable}
            onClick={() => playable && setUniverse(u.id)}
          >
            {u.label}
          </button>
        );
      })}
    </div>
  );
}
