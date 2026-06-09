/* Encode/decode a reading to and from a shareable URL.

   Format: ?c=<n><u|r>-<n><u|r>-<n><u|r>[&q=<question>]
   e.g. ?c=0u-16r-21u&q=Will%20my%20project%20find%20its%20audience%3F */
import { CARDS } from "./data/cards";
import { MAX_QUESTION, type DrawnCard } from "./types";

export function buildShareUrl(question: string, draw: DrawnCard[]): string {
  const c = draw.map((d) => d.card.n + (d.reversed ? "r" : "u")).join("-");
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?c=${c}${question ? `&q=${encodeURIComponent(question)}` : ""}`;
}

export function parseSharedReading(
  search: string,
): { question: string; draw: DrawnCard[] } | null {
  try {
    const params = new URLSearchParams(search);
    const c = params.get("c");
    if (!c) return null;
    const draw: DrawnCard[] = [];
    for (const tok of c.split("-")) {
      const m = /^(\d+)([ur])$/.exec(tok);
      if (!m) return null;
      const card = CARDS.find((cc) => cc.n === Number(m[1]));
      if (!card) return null;
      draw.push({ card, reversed: m[2] === "r" });
    }
    if (draw.length !== 3) return null;
    const question = (params.get("q") || "").slice(0, MAX_QUESTION);
    return { question, draw };
  } catch {
    return null;
  }
}
