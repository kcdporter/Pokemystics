/* The woven three-card interpretation, revealed once all cards are turned. */
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { POSITIONS, TYPES } from "../data/cards";
import { buildShareUrl } from "../share";
import type { DrawnCard } from "../types";

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
  const synth = useMemo(() => {
    const k = draw.map((d) => keys(d)[0].toLowerCase());
    return { past: k[0], present: k[1], future: k[2] };
  }, [draw]);

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
        {draw.map((d, i) => (
          <div
            className="ro-row"
            key={i}
            style={{ "--type": TYPES[d.card.types[0]].c } as CSSProperties}
          >
            <div className="ro-pos">{POSITIONS[i].label}</div>
            <div>
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
              <div className="ro-text">{meaning(d)}</div>
              <div className="ro-keys">
                {keys(d).map((kk, j) => (
                  <span className="ro-key" key={j}>
                    {kk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="ro-synth">
        What was lies in <span className="em">{synth.past}</span>; what is turns upon{" "}
        <span className="em">{synth.present}</span>; and what comes will ask of you{" "}
        <span className="em">{synth.future}</span>.
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
