/* The card: holographic foil that tilts to the cursor, a 3D flip-and-spin
   reveal, levitation, parallax, and a particle burst. */
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { TYPES, type Card } from "../data/cards";
import { Sigil, CardBack } from "./Sigil";

function Spark({ i }: { i: number }) {
  const ang = (Math.PI * 2 * i) / 18 + Math.random() * 0.4;
  const dist = 60 + Math.random() * 120;
  const dx = Math.cos(ang) * dist;
  const dy = Math.sin(ang) * dist;
  const dur = 0.7 + Math.random() * 0.7;
  const size = 4 + Math.random() * 6;
  return (
    <span
      className="spark"
      style={
        {
          "--dx": dx + "px",
          "--dy": dy + "px",
          "--dur": dur + "s",
          width: size,
          height: size,
          animationDelay: Math.random() * 0.06 + "s",
        } as CSSProperties
      }
    />
  );
}

export interface PokeCardProps {
  card: Card;
  reversed: boolean;
  revealed: boolean;
  onReveal?: () => void;
  parallax?: { x: number; y: number };
  levDelay?: number;
  intensity?: number;
  foil?: number;
  particles?: boolean;
  reduceMotion?: boolean;
  dealt?: boolean;
}

export function PokeCard({
  card,
  reversed,
  revealed,
  onReveal,
  parallax = { x: 0, y: 0 },
  levDelay = 0,
  intensity = 1,
  foil = 1,
  particles = true,
  reduceMotion = false,
  dealt = true,
}: PokeCardProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [bursting, setBursting] = useState(false);
  const [justRevealed, setJustRevealed] = useState(false);
  // seed with the current value so a card that's already revealed on load
  // (a restored reading) doesn't replay the reveal animation
  const prevRevealed = useRef(revealed);

  // fire the burst + reveal animation the moment we turn the card over
  useEffect(() => {
    if (revealed && !prevRevealed.current) {
      setBursting(true);
      setJustRevealed(true);
      const t1 = setTimeout(() => setBursting(false), 1300);
      const t2 = setTimeout(() => setJustRevealed(false), 1300);
      prevRevealed.current = revealed;
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    prevRevealed.current = revealed;
  }, [revealed]);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const el = outerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const max = 16 * intensity;
      setTilt({
        rx: (0.5 - y) * max,
        ry: (x - 0.5) * max,
        mx: Math.max(0, Math.min(100, x * 100)),
        my: Math.max(0, Math.min(100, y * 100)),
      });
    },
    [reduceMotion, intensity],
  );

  const onLeave = useCallback(() => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 }), []);

  const flipBase = revealed ? 180 : 0;
  const cardStyle = {
    transform: `rotateX(${tilt.rx}deg) rotateY(${flipBase + tilt.ry}deg)`,
    "--mx": tilt.mx + "%",
    "--my": tilt.my + "%",
  } as CSSProperties;

  const handleClick = () => {
    if (!revealed && dealt) onReveal?.();
  };
  const handleKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !revealed) {
      e.preventDefault();
      onReveal?.();
    }
  };

  const levStyle: CSSProperties = reduceMotion
    ? {}
    : ({ "--lev": 5 + (card.dex % 5) * 0.3 + "s", animationDelay: levDelay + "s" } as CSSProperties);

  // per-type color cast: primary type sets the card's hue, secondary tints it.
  // The CSS blends these with the active theme tokens so it stays cohesive.
  const primaryColor = TYPES[card.types[0]].c;
  const secondaryColor = card.types[1] ? TYPES[card.types[1]].c : primaryColor;

  return (
    <div
      className={
        "card-outer" + (revealed ? " lit" : "") + (dealt ? " card-dealt" : " card-undealt")
      }
      ref={outerRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={
        {
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          transition: "transform .5s cubic-bezier(.2,.7,.2,1)",
          opacity: dealt ? 1 : 0,
          "--type": primaryColor,
          "--type-2": secondaryColor,
        } as CSSProperties
      }
    >
      <div className="halo" />
      {/* particle burst */}
      {bursting && particles ? (
        <div className="burst">
          {Array.from({ length: 22 }).map((_, i) => (
            <Spark key={i} i={i} />
          ))}
        </div>
      ) : null}
      <div
        className={"lev-wrap" + (reduceMotion ? "" : " levitate")}
        style={levStyle}
      >
        <div
          className={
            "card" + (revealed ? " revealed" : "") + (justRevealed ? " just-revealed" : "")
          }
          style={cardStyle}
          role="button"
          tabIndex={0}
          aria-label={
            revealed ? card.arcana + " — " + card.mon : "Face-down card. Activate to reveal."
          }
          onClick={handleClick}
          onKeyDown={handleKey}
        >
          {/* BACK */}
          <div className="card-face card-back">
            <CardBack />
          </div>
          {/* FRONT */}
          <div className={"card-face card-front" + (reversed ? " reversed" : "")}>
            <div className="cf-top">
              <span className="cf-roman">{card.roman}</span>
              <span className="cf-type">{card.types.join(" · ")}</span>
            </div>
            <div className="cf-sigil">
              <Sigil card={card} />
            </div>
            <div className="cf-name">{card.mon}</div>
            <div className="cf-arcana">{card.arcana}</div>
            {reversed ? (
              <div className="cf-rev-tag">⟲ Reversed</div>
            ) : (
              <div className="cf-rev-tag" style={{ color: "var(--ink-dim)", opacity: 0.55 }}>
                Upright
              </div>
            )}
            {/* foil overlays */}
            <div className="foil" style={{ "--foil-strength": foil } as CSSProperties} />
            <div className="foil-glint" />
          </div>
        </div>
      </div>
    </div>
  );
}
