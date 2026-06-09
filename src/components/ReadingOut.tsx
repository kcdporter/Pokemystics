/* The woven N-card interpretation, revealed once all cards are turned. */
import { Fragment, useCallback, useMemo, useState, type CSSProperties } from "react";
import { TYPES, type TypeName } from "../data/cards";
import { buildShareUrl } from "../share";
import type { DrawnCard } from "../types";
import type { Universe } from "../universes";

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
  // The last card in the spread is the "future-most" position in every universe
  // (Future in Gen I, Star in Gen II). Its orientation drives the primary signal;
  // the share of reversed cards modulates intensity.
  const last = draw[draw.length - 1];
  const futureRev = last.reversed;
  const reversedCount = draw.filter((d) => d.reversed).length;
  const ratio = reversedCount / draw.length;
  if (!futureRev) {
    if (reversedCount === 0) return "strong-good";
    if (ratio <= 1 / 3) return "good";
    return "turning-good";
  }
  if (reversedCount === draw.length) return "strong-bad";
  if (ratio >= 2 / 3) return "bad";
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

// Gen II per-position verb pools for the 5-card day/night spread.
// One verb is picked per position, stable per draw.
const DAWN_VERBS = ["opened with", "rose under", "broke as", "first lit on"];
const DAY_VERBS = ["holds", "shines on", "carries", "walks through"];
const DUSK_VERBS = ["turns through", "shifts into", "softens to", "settles on"];
const NIGHT_VERBS = ["hides", "reveals", "veils with", "keeps close to"];
const STAR_VERBS = ["points to", "shines toward", "guides through", "steadies upon"];

// Spoken flavor for each dominant type — used only when a type clearly dominates.
const TYPE_FLAVOR: Partial<Record<TypeName, string>> = {
  Psychic: "thought rules the air",
  Dark: "shadow has the wider stride",
  Fire: "passion runs hot through it",
  Water: "the tide is patient",
  Steel: "structure is the order of the day",
  Ground: "the earth is firm beneath",
  Flying: "things move quickly here",
  Grass: "growth is already underway",
  Electric: "the air crackles",
  Normal: "the ordinary asserts itself",
  Fighting: "courage will be asked of you",
  Poison: "what is offered may be tinged",
  Rock: "endurance is the lesson",
  Bug: "small movements add up",
  Ghost: "the past has not finished speaking",
  Dragon: "fate stirs in the deep places",
  Ice: "patience is cold here",
  Fairy: "the unseen is at play",
};

interface TypeBalance {
  type: TypeName;
  count: number;
  flavor: string;
}

// Tally each type across the draw (a card can carry 1–2 types). When any type
// occupies 3+ slots out of however many cards were drawn, surface it as the
// dominant current of the spread. Otherwise return null and we omit the line.
function computeTypeBalance(draw: DrawnCard[]): TypeBalance | null {
  const tally = new Map<TypeName, number>();
  for (const d of draw) {
    for (const t of d.card.types) tally.set(t, (tally.get(t) ?? 0) + 1);
  }
  let best: { type: TypeName; count: number } | null = null;
  for (const [type, count] of tally) {
    if (!best || count > best.count) best = { type, count };
  }
  if (!best || best.count < 3) return null;
  return {
    type: best.type,
    count: best.count,
    flavor: TYPE_FLAVOR[best.type] ?? "the type sings through the spread",
  };
}

function numberWord(n: number): string {
  return ["zero", "one", "two", "three", "four", "five", "six", "seven"][n] ?? String(n);
}

export function ReadingOut({
  universe,
  draw,
  question,
  onAgain,
  onNew,
  show,
}: {
  universe: Universe;
  draw: DrawnCard[];
  question: string;
  onAgain: () => void;
  onNew: () => void;
  show: boolean;
}) {
  const positions = universe.positions;
  const meaning = (d: DrawnCard) => (d.reversed ? d.card.rev : d.card.up);
  const shadow = (d: DrawnCard) => (d.reversed ? d.card.revShadow : d.card.upShadow);
  const keys = (d: DrawnCard) => (d.reversed ? d.card.revKeys : d.card.upKeys);
  // split prose at the first sentence break so we can show the opening as a bold lead
  const splitLead = (text: string): { lead: string; rest: string } => {
    const m = text.match(/^([^.!?]+[.!?])\s+(.*)$/s);
    return m ? { lead: m[1], rest: m[2] } : { lead: text, rest: "" };
  };
  const synth = useMemo(() => {
    const trend = computeTrend(draw);
    // Keyword-sentence headline is built for the classic past/present/future shape.
    const hasThreeClauseHeadline = draw.length === 3;
    // The 5-card day/night spread gets its own sentence shape — one verb per
    // position, picked from a pool, stable per draw.
    const hasGen2Headline = draw.length === 5;
    const gen2Clauses = hasGen2Headline
      ? [
          { verb: pickOne(DAWN_VERBS), keyword: keys(draw[0])[0] },
          { verb: pickOne(DAY_VERBS), keyword: keys(draw[1])[0] },
          { verb: pickOne(DUSK_VERBS), keyword: keys(draw[2])[0] },
          { verb: pickOne(NIGHT_VERBS), keyword: keys(draw[3])[0] },
          { verb: pickOne(STAR_VERBS), keyword: keys(draw[4])[0] },
        ]
      : null;
    const typeBalance = universe.hasTypeBalance ? computeTypeBalance(draw) : null;
    return {
      hasThreeClauseHeadline,
      past: hasThreeClauseHeadline
        ? { keys: keys(draw[0]), clause: pickOne(PAST_CLAUSES) }
        : null,
      present: hasThreeClauseHeadline
        ? { keys: keys(draw[1]), clause: pickOne(PRESENT_CLAUSES) }
        : null,
      future: hasThreeClauseHeadline
        ? { keys: keys(draw[2]), clause: pickOne(FUTURE_CLAUSES) }
        : null,
      gen2Clauses,
      typeBalance,
      verdict: pickOne(VERDICTS[trend]),
      tone: TREND_TONE[trend],
    };
  }, [draw, universe]);
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
    const url = buildShareUrl(question, draw, universe.id);
    const lines = draw.map(
      (d, i) =>
        `${positions[i].label}: ${d.card.mon} — ${d.card.arcana}${d.reversed ? " (Reversed)" : ""}`,
    );
    const heading = positions.map((p) => p.label).join(" · ");
    const text =
      `Pokemystics ✦ ${question ? `“${question}”` : heading}\n` + lines.join("\n");
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
      <div className="ro-title">
        {question ? "The deck answers" : `Your ${positions.length}-card spread`}
      </div>
      <div className="ro-rule" />
      <div className="ro-rows">
        {draw.map((d, i) => {
          const keyList = keys(d);
          const { lead, rest } = splitLead(meaning(d));
          const shadowText = universe.hasShadowVoice ? shadow(d) : undefined;
          return (
            <div
              className="ro-row"
              key={i}
              style={{ "--type": TYPES[d.card.types[0]].c } as CSSProperties}
            >
              <div className="ro-pos">{positions[i].label}</div>
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
                {shadowText ? <p className="ro-shadow">{shadowText}</p> : null}
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
      <div className="ro-headline">
        <div className={`ro-verdict ${synth.tone}`}>{synth.verdict}</div>
        {synth.hasThreeClauseHeadline && synth.past && synth.present && synth.future ? (
          <p className="ro-headline-prose">
            {renderKeys(synth.past.keys)} {synth.past.clause};{" "}
            {renderKeys(synth.present.keys)} {synth.present.clause}; and{" "}
            {renderKeys(synth.future.keys)} {synth.future.clause}.
          </p>
        ) : null}
        {synth.gen2Clauses ? (
          <p className="ro-headline-prose">
            {synth.gen2Clauses.map((c, i) => {
              const isLast = i === synth.gen2Clauses!.length - 1;
              const separator = i === 0 ? "" : isLast ? "; and " : "; ";
              // Each clause leads with its position label. "Star" takes "the"
              // mid-sentence; the others stand alone (Dawn, Day, Dusk, Night).
              const rawLabel = positions[i].label;
              const label = rawLabel === "Star" ? "the Star" : rawLabel;
              return (
                <Fragment key={i}>
                  {separator}
                  {label} {c.verb} <span className="em">{c.keyword}</span>
                </Fragment>
              );
            })}
            .
          </p>
        ) : null}
        {synth.typeBalance ? (
          <p className="ro-balance">
            <span className="em">
              {numberWord(synth.typeBalance.count)} {synth.typeBalance.type}
            </span>{" "}
            types thread the spread — {synth.typeBalance.flavor}.
          </p>
        ) : null}
      </div>
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
