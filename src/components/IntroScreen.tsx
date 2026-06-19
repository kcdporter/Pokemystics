/* The ritual / question screen (phase === "intro"). */
import { MAX_QUESTION } from "../types";
import type { Universe } from "../universes";
import { CardBack } from "./Sigil";

export function IntroScreen({
  universe,
  question,
  setQuestion,
  onConsult,
}: {
  universe: Universe;
  question: string;
  setQuestion: (q: string) => void;
  onConsult: () => void;
}) {
  const cardCount = universe.positions.length;
  return (
    <div className="intro fade-in">
      <div className="eyebrow">
        {universe.label} · {universe.tagline}
      </div>
      <h1>Pokemystics</h1>
      <p className="lede">
        Many worlds, many fates. Each generation draws on a different roster of creatures and
        shapes the reading in its own way — <span className="lede-em">choose one above</span> to
        enrich what the deck can say. Then still your mind, hold your question, and let the cards
        answer.
      </p>
      <div className="deck-emblem">
        <div
          className="card-face card-back"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <CardBack />
        </div>
      </div>
      <div className="ask">
        <input
          id="q"
          className="ask-field"
          value={question}
          maxLength={MAX_QUESTION}
          placeholder="What should I know about the path ahead?"
          aria-label="Your question for the deck"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConsult();
          }}
        />
      </div>
      <button className="consult" onClick={onConsult}>
        <span className="ch">Consult the deck</span>
      </button>
      <div className="fineprint">
        {cardCount} card {universe.spreadShape} reading
      </div>
    </div>
  );
}
