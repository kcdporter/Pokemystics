/* The three-card spread + inline reading (phase === "spread"). */
import { POSITIONS } from "../data/cards";
import type { DrawnCard, Tweaks } from "../types";
import { PokeCard } from "./PokeCard";
import { ReadingOut } from "./ReadingOut";

export function SpreadScreen({
  draw,
  revealed,
  reveal,
  parallax,
  tweaks,
  question,
  showReading,
  onAgain,
  onNew,
  revealAll,
}: {
  draw: DrawnCard[];
  revealed: boolean[];
  reveal: (i: number) => void;
  parallax: { x: number; y: number };
  tweaks: Tweaks;
  question: string;
  showReading: boolean;
  onAgain: () => void;
  onNew: () => void;
  revealAll: () => void;
}) {
  const allRevealed = revealed.every(Boolean) && draw.length === 3;
  const depths = [1.0, 0.6, 1.3]; // parallax depth per slot
  return (
    <div className="reading-stage fade-in">
      <div className="spread-head">
        <div className="q">Past · Present · Future</div>
        <div className="hint" style={{ opacity: allRevealed ? 0 : 1 }}>
          {allRevealed ? "" : "Touch each card to turn it"}
        </div>
      </div>
      <div className="spread">
        {draw.map((d, i) => (
          <div className="slot in" key={i}>
            <div className="slot-label">{POSITIONS[i].label}</div>
            <div className="slot-sub">{POSITIONS[i].sub}</div>
            <div className="deal-anim" style={{ animationDelay: i * 0.18 + "s" }}>
              <PokeCard
                card={d.card}
                reversed={d.reversed}
                revealed={revealed[i]}
                onReveal={() => reveal(i)}
                parallax={{ x: parallax.x * 10 * depths[i], y: parallax.y * 8 * depths[i] }}
                levDelay={i * 0.5}
                intensity={tweaks.tilt}
                foil={tweaks.foil}
                particles={tweaks.particles}
                reduceMotion={tweaks.reduceMotion}
              />
            </div>
          </div>
        ))}
      </div>
      {/* the user's question sits under the cards, above the finalized answer */}
      {question ? <div className="spread-question">{"“" + question + "”"}</div> : null}
      {!allRevealed ? (
        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <button className="btn-ghost" onClick={revealAll}>
            Reveal all
          </button>
        </div>
      ) : null}
      <ReadingOut
        draw={draw}
        question={question}
        onAgain={onAgain}
        onNew={onNew}
        show={showReading}
      />
    </div>
  );
}
