/* The ritual / question screen (phase === "intro"). */
import { MAX_QUESTION } from "../types";
import { CardBack } from "./Sigil";

export function IntroScreen({
  question,
  setQuestion,
  onConsult,
}: {
  question: string;
  setQuestion: (q: string) => void;
  onConsult: () => void;
}) {
  return (
    <div className="intro fade-in">
      <div className="eyebrow">Gen I · The Major Arcana</div>
      <h1>Pokemystics</h1>
      <p className="lede">
        Twenty-two creatures, tens of thousands of fates. Still your mind, hold your question, and
        let the deck reveal what was, what is, and what is yet becoming.
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
        <label className="ask-label" htmlFor="q">
          Whisper your question to the deck
        </label>
        <input
          id="q"
          className="ask-field"
          value={question}
          maxLength={MAX_QUESTION}
          placeholder="What should I know about the path ahead?"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConsult();
          }}
        />
      </div>
      <button className="consult" onClick={onConsult}>
        <span className="ch">Consult the deck</span>
      </button>
      <div className="fineprint">Three cards will be drawn — some may arrive reversed.</div>
    </div>
  );
}
