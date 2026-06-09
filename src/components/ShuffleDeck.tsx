/* The riffling deck shown during the `shuffling` phase. */
import type { CSSProperties } from "react";
import { CardBack } from "./Sigil";

export function ShuffleDeck() {
  const cards = Array.from({ length: 9 });
  return (
    <div className="shuffle-zone">
      {cards.map((_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const style = {
          "--sx": (40 + i * 6) * dir + "px",
          "--sr": (8 + i * 2) * dir + "deg",
          "--sx2": (22 + i * 4) * -dir + "px",
          "--sr2": (5 + i) * -dir + "deg",
          animation: `shuffleRiffle 1.05s ease-in-out ${i * 0.07}s infinite`,
          zIndex: i,
        } as CSSProperties;
        return (
          <div key={i} className="deck-card" style={style}>
            <CardBack />
          </div>
        );
      })}
      <div className="shuffle-caption">
        <span className="glitch-text" data-t="Consulting the fates">
          Consulting the fates
        </span>
      </div>
    </div>
  );
}
