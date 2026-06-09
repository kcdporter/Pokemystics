/* Encode/decode a reading to and from a shareable URL.

   Format: ?c=<n><u|r>-<n><u|r>-...[&u=gen1|gen2][&q=<question>]
   e.g. ?c=0u-16r-21u&u=gen1&q=Will%20my%20project%20find%20its%20audience%3F
   The universe param is optional; absent → gen1 (backward-compatible with the
   pre-universe share format). */
import { MAX_QUESTION, type DrawnCard } from "./types";
import { getUniverse, type UniverseId } from "./universes";

export function buildShareUrl(
  question: string,
  draw: DrawnCard[],
  universe: UniverseId = "gen1",
): string {
  const c = draw.map((d) => d.card.n + (d.reversed ? "r" : "u")).join("-");
  const { origin, pathname } = window.location;
  // gen1 is the default; omit the param to keep URLs short and back-compat
  const u = universe === "gen1" ? "" : `&u=${universe}`;
  const q = question ? `&q=${encodeURIComponent(question)}` : "";
  return `${origin}${pathname}?c=${c}${u}${q}`;
}

export function parseSharedReading(
  search: string,
): { universe: UniverseId; question: string; draw: DrawnCard[] } | null {
  try {
    const params = new URLSearchParams(search);
    const c = params.get("c");
    if (!c) return null;
    const uRaw = params.get("u");
    const universe: UniverseId = uRaw === "gen2" ? "gen2" : "gen1";
    const deck = getUniverse(universe).deck;
    const draw: DrawnCard[] = [];
    for (const tok of c.split("-")) {
      const m = /^(\d+)([ur])$/.exec(tok);
      if (!m) return null;
      const card = deck.find((cc) => cc.n === Number(m[1]));
      if (!card) return null;
      draw.push({ card, reversed: m[2] === "r" });
    }
    const expected = getUniverse(universe).positions.length;
    if (draw.length !== expected) return null;
    const question = (params.get("q") || "").slice(0, MAX_QUESTION);
    return { universe, question, draw };
  } catch {
    return null;
  }
}
