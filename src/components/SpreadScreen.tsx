/* The N-card spread + inline reading (phase === "spread"). The active universe
   determines positions, deck, and reading complexity. */
import type { CSSProperties } from "react";
import type { Universe } from "../universes";
import type { DrawnCard, Tweaks } from "../types";
import { PokeCard } from "./PokeCard";
import { ReadingOut } from "./ReadingOut";

export function SpreadScreen({
  universe,
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
  universe: Universe;
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
  const positions = universe.positions;
  const allRevealed = revealed.every(Boolean) && draw.length === positions.length;
  // a small parallax-depth value per slot so cards don't all drift identically
  const depthFor = (i: number) => 0.6 + ((i * 37) % 90) / 100;
  const heading = positions.map((p) => p.label).join(" · ");
  return (
    <div className="reading-stage fade-in">
      <div className="spread-head">
        <div className="q">{heading}</div>
        <div className="hint" style={{ opacity: allRevealed ? 0 : 1 }}>
          {allRevealed ? "" : "Touch each card to turn it"}
        </div>
      </div>
      {/* the user's question frames the reading: shown above the cards */}
      {question ? <div className="spread-question">{"“" + question + "”"}</div> : null}
      <div className="spread" style={{ "--cols": positions.length } as CSSProperties}>
        {draw.map((d, i) => (
          <div className="slot in" key={i}>
            <div className="slot-label">{positions[i].label}</div>
            <div className="slot-sub">{positions[i].sub}</div>
            <div className="deal-anim" style={{ animationDelay: i * 0.18 + "s" }}>
              <PokeCard
                card={d.card}
                reversed={d.reversed}
                revealed={revealed[i]}
                onReveal={() => reveal(i)}
                parallax={{
                  x: parallax.x * 10 * depthFor(i),
                  y: parallax.y * 8 * depthFor(i),
                }}
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
      {!allRevealed ? (
        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <button className="btn-ghost" onClick={revealAll}>
            Reveal all
          </button>
        </div>
      ) : null}
      <ReadingOut
        universe={universe}
        draw={draw}
        question={question}
        onAgain={onAgain}
        onNew={onNew}
        show={showReading}
      />
    </div>
  );
}
