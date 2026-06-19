/* The constellation-based deal flow (phase === "spread"):
   1. waiting — center deck at viewport center; click to begin.
   2. dealing — deck fans out and exits; constellations translate to spread
      positions (driven from App via the ConstellationField).
   3. ready   — each constellation cross-fades into its card; a "See my reading"
      button appears.
   Clicking "See my reading" hands off to ReadingOut (the row layout). */
import type { CSSProperties } from "react";
import type { Universe } from "../universes";
import type { DrawnCard, Tweaks } from "../types";
import type { DealState } from "../App";
import { PokeCard } from "./PokeCard";
import { ReadingOut } from "./ReadingOut";
import { CardBack } from "./Sigil";

export function SpreadScreen({
  universe,
  draw,
  parallax,
  tweaks,
  question,
  showReading,
  dealState,
  spreadTargets,
  beginDealing,
  onSeeReading,
  onAgain,
  onNew,
}: {
  universe: Universe;
  draw: DrawnCard[];
  parallax: { x: number; y: number };
  tweaks: Tweaks;
  question: string;
  showReading: boolean;
  dealState: DealState;
  spreadTargets: { x: number; y: number }[];
  beginDealing: () => void;
  onSeeReading: () => void;
  onAgain: () => void;
  onNew: () => void;
}) {
  const positions = universe.positions;
  const heading = positions.map((p) => p.label).join(" · ");
  const depthFor = (i: number) => 0.6 + ((i * 37) % 90) / 100;

  return (
    <div className="reading-stage fade-in">
      <div
        className={"spread-stage" + (showReading ? " stage-out" : "")}
        aria-hidden={showReading}
      >
        {dealState !== "ready" ? (
          <div className="spread-head">
            <div className="q">{heading}</div>
            <div className="hint" style={{ opacity: dealState === "waiting" ? 1 : 0 }}>
              {dealState === "waiting" ? "Click the deck to deal" : ""}
            </div>
          </div>
        ) : null}
        {question && dealState !== "ready" ? (
          <div className="spread-question">{"“" + question + "”"}</div>
        ) : null}

        <div className="deck-modal" aria-hidden={dealState !== "waiting"}>
          {dealState === "waiting" ? (
            <button
              type="button"
              className="center-deck"
              onClick={beginDealing}
              aria-label="Deal the cards"
            >
              <div className="center-deck-stack">
                {[0, 1, 2, 3, 4].map((k) => (
                  <div
                    key={k}
                    className="center-deck-card"
                    style={{ "--k": k } as CSSProperties}
                  >
                    <CardBack />
                  </div>
                ))}
              </div>
            </button>
          ) : (
            <div className="center-deck-exit">
              <div className="center-deck-stack">
                {[0, 1, 2, 3, 4].map((k) => (
                  <div
                    key={k}
                    className="center-deck-card"
                    style={{ "--k": k } as CSSProperties}
                  >
                    <CardBack />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {dealState !== "waiting" && spreadTargets.length === draw.length ? (
          <div className="card-positions">
            {draw.map((d, i) => {
              const t = spreadTargets[i];
              return (
                <div
                  key={i}
                  className={"card-position" + (dealState === "ready" ? " is-ready" : "")}
                  style={{ left: t.x + "%", top: t.y + "%" } as CSSProperties}
                >
                  <div
                    className={
                      "card-materialize" + (dealState === "ready" ? " is-ready" : "")
                    }
                  >
                    <PokeCard
                      card={d.card}
                      reversed={d.reversed}
                      revealed
                      parallax={{
                        x: parallax.x * 6 * depthFor(i),
                        y: parallax.y * 5 * depthFor(i),
                      }}
                      levDelay={i * 0.5}
                      intensity={tweaks.tilt}
                      foil={tweaks.foil}
                      reduceMotion={tweaks.reduceMotion}
                    />
                  </div>
                </div>
              );
            })}
            {dealState === "ready" ? (
              <button
                type="button"
                className="see-reading-btn"
                onClick={onSeeReading}
              >
                See my reading
              </button>
            ) : null}
          </div>
        ) : null}

      </div>

      <ReadingOut
        universe={universe}
        draw={draw}
        question={question}
        tweaks={tweaks}
        onAgain={onAgain}
        onNew={onNew}
        show={showReading}
      />
    </div>
  );
}
