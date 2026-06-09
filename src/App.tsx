/* App orchestrator: the intro/shuffling/spread phase machine, theme engine,
   parallax, persistence, and the deal/reveal/reading flow. */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  DEFAULT_TWEAKS,
  MAX_QUESTION,
  type DrawnCard,
  type Phase,
  type ThemeKey,
  type Tweaks,
} from "./types";
import { DEFAULT_UNIVERSE, getUniverse, type UniverseId } from "./universes";
import { parseSharedReading } from "./share";
import { Starfield } from "./components/Starfield";
import { ThemePicker } from "./components/ThemePicker";
import { UniversePicker } from "./components/UniversePicker";
import { ShuffleDeck } from "./components/ShuffleDeck";
import { IntroScreen } from "./components/IntroScreen";
import { SpreadScreen } from "./components/SpreadScreen";
import { SettingsPanel } from "./components/SettingsPanel";

const THEME_KEY = "pm-theme";
const UNIVERSE_KEY = "pm-universe";
const STATE_KEY = "pm-state";
const TWEAKS_KEY = "pm-tweaks";

interface SavedState {
  phase: Phase;
  question: string;
  draw: DrawnCard[];
  revealed: boolean[];
  showReading: boolean;
  /** present on URL-restored readings so the app can snap to that universe */
  universe?: UniverseId;
}

function loadState(universeId: UniverseId): SavedState | null {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
    if (!s || (s.phase !== "spread" && s.phase !== "reading") || !Array.isArray(s.draw)) return null;
    // saved reading must belong to the active universe (and we need its deck to resolve cards)
    if (s.universe && s.universe !== universeId) return null;
    const universe = getUniverse(universeId);
    const expected = universe.positions.length;
    if (s.draw.length !== expected) return null;
    const draw: DrawnCard[] = s.draw
      .map((d: { n: number; reversed: boolean }) => ({
        card: universe.deck.find((c) => c.n === d.n)!,
        reversed: !!d.reversed,
      }))
      .filter((d: DrawnCard) => d.card);
    if (draw.length !== expected) return null;
    // normalize values from storage: cap the question, coerce revealed to expected bools
    const question = typeof s.question === "string" ? s.question.slice(0, MAX_QUESTION) : "";
    const revealed =
      Array.isArray(s.revealed) && s.revealed.length === expected
        ? s.revealed.map(Boolean)
        : new Array(expected).fill(false);
    return { phase: "spread", question, draw, revealed, showReading: s.phase === "reading" };
  } catch {
    /* ignore malformed state */
  }
  return null;
}

function loadTweaks(): Tweaks {
  let base: Tweaks = { ...DEFAULT_TWEAKS };
  // default to the OS reduce-motion preference
  if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    base.reduceMotion = true;
  }
  try {
    const t = JSON.parse(localStorage.getItem(TWEAKS_KEY) || "null");
    if (t && typeof t === "object") {
      // clamp each field into range
      const num = (v: unknown, lo: number, hi: number, d: number) =>
        typeof v === "number" && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d;
      const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
      base = {
        tilt: num(t.tilt, 0, 2, base.tilt),
        foil: num(t.foil, 0, 2.5, base.foil),
        reversedChance: num(t.reversedChance, 0, 100, base.reversedChance),
        reduceMotion: bool(t.reduceMotion, base.reduceMotion),
        particles: bool(t.particles, base.particles),
      };
    }
  } catch {
    /* ignore */
  }
  return base;
}

function loadTheme(): ThemeKey {
  const t = localStorage.getItem(THEME_KEY) as ThemeKey | null;
  return t === "midnight" || t === "holo" || t === "dmg" || t === "vapor" ? t : "midnight";
}

function loadUniverse(): UniverseId {
  const u = localStorage.getItem(UNIVERSE_KEY) as UniverseId | null;
  // only return universes whose deck is non-empty; otherwise fall back to default
  if (u === "gen1" || u === "gen2") {
    const candidate = getUniverse(u);
    if (candidate.deck.length > 0) return u;
  }
  return DEFAULT_UNIVERSE;
}

// A shared-reading URL (see share.ts) restores that exact spread, ahead of
// any locally-saved state. The URL also carries the universe so a Gen 2
// reading shared at someone running Gen 1 lands in the right deck.
function loadFromUrl(): SavedState | null {
  const parsed = parseSharedReading(window.location.search);
  if (!parsed) return null;
  return {
    phase: "spread",
    question: parsed.question,
    draw: parsed.draw,
    revealed: new Array(parsed.draw.length).fill(true),
    showReading: true,
    universe: parsed.universe,
  };
}

export default function App() {
  // A shared-reading URL pins the universe; otherwise fall back to localStorage.
  const urlReading = useMemo(loadFromUrl, []);
  const [universe, setUniverse] = useState<UniverseId>(
    () => urlReading?.universe ?? loadUniverse(),
  );
  const currentUniverse = useMemo(() => getUniverse(universe), [universe]);
  const savedState = useMemo(() => loadState(universe), [universe]);
  const saved = urlReading ?? savedState;
  const [theme, setTheme] = useState<ThemeKey>(loadTheme);
  const [phase, setPhase] = useState<Phase>(saved ? saved.phase : "intro");
  const [question, setQuestion] = useState(saved ? saved.question : "");
  const [draw, setDraw] = useState<DrawnCard[]>(saved ? saved.draw : []);
  const [revealed, setRevealed] = useState<boolean[]>(
    saved ? saved.revealed : new Array(currentUniverse.positions.length).fill(false),
  );
  const [showReading, setShowReading] = useState(saved ? saved.showReading : false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [tweaks, setTweaks] = useState<Tweaks>(loadTweaks);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // a synchronous lock so click/Enter spamming can't stack overlapping draws
  const drawLockRef = useRef(false);

  // clear the shared-reading params from the URL after loading, so a refresh
  // or "Draw again" isn't pinned to the shared spread
  useEffect(() => {
    if (urlReading) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [urlReading]);

  // persist reading so a reload returns to the same spread
  useEffect(() => {
    if (phase === "spread") {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({
          phase: showReading ? "reading" : "spread",
          universe,
          question,
          draw: draw.map((d) => ({ n: d.card.n, reversed: d.reversed })),
          revealed,
        }),
      );
    } else if (phase === "intro") {
      localStorage.removeItem(STATE_KEY);
    }
  }, [phase, universe, question, draw, revealed, showReading]);

  // persist universe choice
  useEffect(() => {
    localStorage.setItem(UNIVERSE_KEY, universe);
  }, [universe]);

  // theme apply + persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // reduce-motion attribute + persist tweaks
  useEffect(() => {
    document.documentElement.setAttribute("data-reduce-motion", tweaks.reduceMotion ? "1" : "0");
    localStorage.setItem(TWEAKS_KEY, JSON.stringify(tweaks));
  }, [tweaks]);

  // parallax on pointer move (rAF-throttled)
  useEffect(() => {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      tx = (e.clientX / w - 0.5) * 2;
      ty = (e.clientY / h - 0.5) * 2;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          setParallax({ x: tx, y: ty });
        });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const consult = useCallback(() => {
    // ignore re-triggers while a draw is already in flight
    if (drawLockRef.current) return;
    // can't consult a universe with no cards
    if (currentUniverse.deck.length < currentUniverse.positions.length) return;
    drawLockRef.current = true;

    // pick N distinct cards (N = number of positions in the active universe's spread)
    const pool = currentUniverse.deck.slice();
    const picks: DrawnCard[] = [];
    for (let i = 0; i < currentUniverse.positions.length; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const c = pool.splice(idx, 1)[0];
      picks.push({ card: c, reversed: Math.random() < tweaks.reversedChance / 100 });
    }
    setDraw(picks);
    setRevealed(new Array(currentUniverse.positions.length).fill(false));
    setShowReading(false);
    setPhase("shuffling");
    const delay = tweaks.reduceMotion ? 350 : 2200;
    setTimeout(() => setPhase("spread"), delay);
    // release the lock once the shuffle has settled
    setTimeout(() => {
      drawLockRef.current = false;
    }, delay + 400);
  }, [currentUniverse, tweaks.reduceMotion, tweaks.reversedChance]);

  const reveal = useCallback((i: number) => {
    setRevealed((r) => {
      if (r[i]) return r;
      const n = r.slice();
      n[i] = true;
      return n;
    });
  }, []);

  // when all revealed → show reading
  useEffect(() => {
    const n = currentUniverse.positions.length;
    if (phase === "spread" && revealed.every(Boolean) && draw.length === n) {
      const t = setTimeout(() => setShowReading(true), 900);
      return () => clearTimeout(t);
    }
  }, [revealed, phase, draw.length, currentUniverse]);

  const drawAgain = useCallback(() => consult(), [consult]);
  const newQuestion = useCallback(() => {
    setPhase("intro");
    setRevealed(new Array(currentUniverse.positions.length).fill(false));
    setDraw([]);
    setShowReading(false);
    setQuestion("");
  }, [currentUniverse]);
  // Switching universes mid-reading would render the old draw against the new
  // spread shape (e.g. a 3-card Gen I draw in Gen II's 5-column grid). Reset
  // cleanly back to the intro on a deliberate user switch.
  const changeUniverse = useCallback((id: UniverseId) => {
    setUniverse(id);
    setPhase("intro");
    setDraw([]);
    setRevealed(new Array(getUniverse(id).positions.length).fill(false));
    setShowReading(false);
    setQuestion("");
    localStorage.removeItem(STATE_KEY);
  }, []);
  const revealAll = useCallback(
    () => setRevealed(new Array(currentUniverse.positions.length).fill(true)),
    [currentUniverse],
  );

  return (
    <div className="stage">
      <Starfield />
      <div className="topbar">
        <div className="brand">
          <span className="mark">Pokemystics</span>
          <span className="sub">Cartomancy</span>
        </div>
        <div className="topbar-right">
          <UniversePicker universe={universe} setUniverse={changeUniverse} />
          <ThemePicker theme={theme} setTheme={setTheme} />
          <button
            className="gear"
            aria-label="Settings"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1l-.4-2.5H10.9l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.5h3.6l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6Z"
              />
            </svg>
          </button>
          <SettingsPanel
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            tweaks={tweaks}
            setTweaks={setTweaks}
          />
        </div>
      </div>

      {phase === "intro" ? (
        <IntroScreen question={question} setQuestion={setQuestion} onConsult={consult} />
      ) : null}

      {phase === "shuffling" ? (
        <div className="reading-stage">
          <ShuffleDeck />
        </div>
      ) : null}

      {phase === "spread" ? (
        <SpreadScreen
          universe={currentUniverse}
          draw={draw}
          revealed={revealed}
          reveal={reveal}
          parallax={parallax}
          tweaks={tweaks}
          question={question}
          showReading={showReading}
          onAgain={drawAgain}
          onNew={newQuestion}
          revealAll={revealAll}
        />
      ) : null}
    </div>
  );
}
