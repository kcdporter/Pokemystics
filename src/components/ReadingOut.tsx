/* The woven three-card interpretation, revealed once all cards are turned. */
import { Fragment, useCallback, useMemo, useState, type CSSProperties } from "react";
import { POSITIONS, TYPES } from "../data/cards";
import { buildShareUrl } from "../share";
import type { DrawnCard } from "../types";

// Headline clause pools. Each entry follows plural keywords (so verb agreement is plural).
// Past pool uses past-tense verbs, present uses present-tense, future uses "will + base".
const PAST_CLAUSES = [
  "shaped your past",
  "forged the road behind",
  "wrote the chapter behind",
  "led you here",
  "carved what was",
  "echoed in what was",
  "colored what was",
  "kindled what was",
  "rooted what was",
  "paved the road behind",
  "marked your past",
  "taught what was",
  "tempered what was",
  "anchored your past",
  "sowed your past",
  "sang in your past",
  "shadowed what was",
  "preceded you",
  "built the ground beneath you",
  "burned through what was",
  "wove your past",
  "crowned your past",
  "lit what was",
  "inscribed your past",
  "sealed what was",
  "gathered behind you",
  "watered the roots of you",
  "whispered through your past",
  "cast a shadow behind you",
  "opened the door behind",
];
const PRESENT_CLAUSES = [
  "shape your present",
  "walk the road with you",
  "write the chapter you are in",
  "hold you here",
  "sculpt what is",
  "sound through what is",
  "color what is",
  "burn in what is",
  "anchor what is",
  "line the road you walk",
  "mark your present",
  "test what is",
  "sharpen what is",
  "tend your present",
  "sing in your present",
  "shadow what is",
  "surround you",
  "hold the ground beneath you",
  "smolder in what is",
  "weave your present",
  "crown your present",
  "light what is",
  "inscribe your present",
  "hold the seal of what is",
  "gather around you",
  "water the bloom of you",
  "whisper through your present",
  "cast a shadow upon you",
  "hold the door you stand in",
  "press upon the now",
];
const FUTURE_CLAUSES = [
  "will shape your future",
  "will meet you on the road ahead",
  "will write the chapter yet to come",
  "will lead you onward",
  "will sculpt what comes",
  "will ring through what comes",
  "will color what comes",
  "will light what comes",
  "will branch into what comes",
  "will pave the road ahead",
  "will mark your future",
  "will ask of what comes",
  "will steel what comes",
  "will anchor your future",
  "will harvest your future",
  "will sing in your future",
  "will shadow what comes",
  "will follow you",
  "will lay the ground ahead",
  "will flare in what comes",
  "will weave your future",
  "will crown your future",
  "will light your future",
  "will inscribe your future",
  "will break the seal of what comes",
  "will gather before you",
  "will water the fruit of you",
  "will whisper through your future",
  "will cast a shadow before you",
  "will open the door ahead",
];

const pickOne = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Trend verdict: how favorable does the spread look overall?
// Future orientation is the primary signal; the count of reversed cards modulates intensity.
type Trend = "strong-good" | "good" | "turning-good" | "turning-bad" | "bad" | "strong-bad";

function computeTrend(draw: DrawnCard[]): Trend {
  const futureRev = draw[2].reversed;
  const reversedCount = draw.filter((d) => d.reversed).length;
  if (!futureRev) {
    if (reversedCount === 0) return "strong-good";
    if (reversedCount === 1) return "good";
    return "turning-good";
  }
  if (reversedCount === 3) return "strong-bad";
  if (reversedCount === 2) return "bad";
  return "turning-bad";
}

const VERDICTS: Record<Trend, string[]> = {
  "strong-good": [
    "The signs are clear — pursue.",
    "The path opens; walk it.",
    "All three lights burn for you.",
    "The omens align. Move.",
  ],
  good: [
    "The path opens — tend it well.",
    "The current runs with you.",
    "The omens lean favorable.",
    "More light than shadow. Step forward.",
  ],
  "turning-good": [
    "The road has been hard, but light meets you ahead.",
    "What was is not what will be — the tide turns toward you.",
    "Through dark soil, a bright bloom is promised.",
    "Out of weight, a lifting; out of dusk, a dawn.",
  ],
  "turning-bad": [
    "Fair weather now, but a storm gathers ahead.",
    "Step carefully — what waits ahead does not match what is.",
    "What rises easily may yet fall. Be watchful.",
    "Bright now, dim ahead. Walk slowly.",
  ],
  bad: [
    "The signs darken — reconsider.",
    "The current runs against you.",
    "The omens lean cautioned.",
    "More shadow than light. Hesitate.",
  ],
  "strong-bad": [
    "The deck warns — do not pursue.",
    "All three lights dim. Turn back.",
    "The path is closed to you here. Choose another.",
    "The omens stand against you. Wait, or change course.",
  ],
};

const TREND_TONE: Record<Trend, "good" | "warn"> = {
  "strong-good": "good",
  good: "good",
  "turning-good": "good",
  "turning-bad": "warn",
  bad: "warn",
  "strong-bad": "warn",
};

export function ReadingOut({
  draw,
  question,
  onAgain,
  onNew,
  show,
}: {
  draw: DrawnCard[];
  question: string;
  onAgain: () => void;
  onNew: () => void;
  show: boolean;
}) {
  const meaning = (d: DrawnCard) => (d.reversed ? d.card.rev : d.card.up);
  const keys = (d: DrawnCard) => (d.reversed ? d.card.revKeys : d.card.upKeys);
  // split prose at the first sentence break so we can show the opening as a bold lead
  const splitLead = (text: string): { lead: string; rest: string } => {
    const m = text.match(/^([^.!?]+[.!?])\s+(.*)$/s);
    return m ? { lead: m[1], rest: m[2] } : { lead: text, rest: "" };
  };
  const synth = useMemo(() => {
    const k = draw.map((d) => keys(d));
    const trend = computeTrend(draw);
    return {
      past: { keys: k[0], clause: pickOne(PAST_CLAUSES) },
      present: { keys: k[1], clause: pickOne(PRESENT_CLAUSES) },
      future: { keys: k[2], clause: pickOne(FUTURE_CLAUSES) },
      verdict: pickOne(VERDICTS[trend]),
      tone: TREND_TONE[trend],
    };
  }, [draw]);
  // render a list of keywords as highlighted spans joined with commas + "and".
  // First keyword keeps its title-case (it leads the clause); the rest are lowercased
  // so the list reads as natural prose.
  const renderKeys = (list: string[]) =>
    list.map((kw, i) => {
      const text = i === 0 ? kw : kw.charAt(0).toLowerCase() + kw.slice(1);
      return (
        <Fragment key={i}>
          {i > 0 && (i === list.length - 1 ? (list.length > 2 ? ", and " : " and ") : ", ")}
          <span className="em">{text}</span>
        </Fragment>
      );
    });

  const [shareLabel, setShareLabel] = useState("Share");
  const onShare = useCallback(async () => {
    // a link that brings the recipient back to this exact spread
    const url = buildShareUrl(question, draw);
    const lines = draw.map(
      (d, i) =>
        `${POSITIONS[i].label}: ${d.card.mon} — ${d.card.arcana}${d.reversed ? " (Reversed)" : ""}`,
    );
    const text =
      `Pokemystics ✦ ${question ? `“${question}”` : "Past · Present · Future"}\n` + lines.join("\n");
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Pokemystics", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShareLabel("Copied link!");
      setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      // user dismissed the share sheet, or clipboard was blocked; ignore
    }
  }, [draw, question]);

  return (
    <div className={"reading-out" + (show ? " show" : "")}>
      <div className="ro-title">{question ? "The deck answers" : "Your three-card spread"}</div>
      <div className="ro-rule" />
      <div className="ro-rows">
        {draw.map((d, i) => {
          const keyList = keys(d);
          const { lead, rest } = splitLead(meaning(d));
          return (
            <div
              className="ro-row"
              key={i}
              style={{ "--type": TYPES[d.card.types[0]].c } as CSSProperties}
            >
              <div className="ro-pos">{POSITIONS[i].label}</div>
              <div>
                <div className="ro-kicker">{keyList[0]}</div>
                <div className="ro-card-name">
                  {d.card.mon}
                  <span style={{ color: "var(--ink-dim)", fontSize: "16px", fontStyle: "italic" }}>
                    {"  — " + d.card.arcana}
                  </span>
                </div>
                <div className="ro-card-meta">
                  {d.card.roman} · {d.card.types.join(" / ")} ·{" "}
                  {d.reversed ? <span className="or">Reversed</span> : <span>Upright</span>}
                </div>
                <p className="ro-lead">{lead}</p>
                {rest && <p className="ro-text">{rest}</p>}
                <div className="ro-keys">
                  {keyList.map((kk, j) => (
                    <span className="ro-key" key={j}>
                      {kk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="ro-headline">
        <span className={`ro-verdict ${synth.tone}`}>{synth.verdict}</span>
        {renderKeys(synth.past.keys)} {synth.past.clause}; {renderKeys(synth.present.keys)}{" "}
        {synth.present.clause}; and {renderKeys(synth.future.keys)} {synth.future.clause}.
      </p>
      <div className="ro-actions">
        <button className="btn-ghost primary" onClick={onAgain}>
          Draw again
        </button>
        <button className="btn-ghost" onClick={onNew}>
          New question
        </button>
        <button className="btn-ghost ro-share" onClick={onShare} aria-label="Share this reading">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 8a3 3 0 1 0-2.8-4M18 8a3 3 0 0 1-2.8-1.9M18 8v0M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2.6-4.3 6.8-3.8M8.6 13.3l6.8 3.8M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
          </svg>
          {shareLabel}
        </button>
      </div>
    </div>
  );
}
