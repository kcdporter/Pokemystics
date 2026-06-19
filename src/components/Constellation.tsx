/* Render a Pokémon constellation as a set of twinkling dots.

   Points come from sampling the creature's sprite silhouette (see
   constellations/sample.ts). Stars twinkle on a per-point staggered cycle. */
import type { CSSProperties } from "react";
import { useConstellation } from "../constellations/sample";

export function Constellation({
  dex,
  size = 120,
  brightness = 1,
  twinkle = true,
  className,
  style,
  pointSize = 1.2,
}: {
  dex: number;
  size?: number;
  brightness?: number;
  twinkle?: boolean;
  className?: string;
  style?: CSSProperties;
  pointSize?: number;
}) {
  const data = useConstellation(dex, 28);
  if (!data || data.points.length === 0) return null;

  // viewBox is 100 x (100 / aspect) so a wide creature gets a wider box and
  // the SVG can be sized by a single "size" (height in px) without warping.
  const vbW = 100;
  const vbH = 100 / data.aspect;
  const height = size;
  const width = size * data.aspect;
  void brightness;
  return (
    <svg
      className={"constellation" + (className ? " " + className : "")}
      viewBox={`0 0 ${vbW} ${vbH}`}
      width={width}
      height={height}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {data.edges.map(([a, b], i) => {
        const pa = data.points[a];
        const pb = data.points[b];
        return (
          <line
            key={i}
            x1={pa.x * vbW}
            y1={pa.y * vbH}
            x2={pb.x * vbW}
            y2={pb.y * vbH}
            className="constellation-line"
          />
        );
      })}
      {data.points.map((p, i) => {
        // varied delay + duration per star so the constellation breathes
        // rather than flickers in lockstep
        const delay = ((i * 1.13) % 10).toFixed(2) + "s";
        const dur = (10 + ((i * 0.61) % 6)).toFixed(2) + "s";
        return (
          <circle
            key={i}
            cx={p.x * vbW}
            cy={p.y * vbH}
            r={pointSize}
            className={"star" + (twinkle ? "" : " no-twinkle")}
            style={
              { animationDelay: delay, "--dur": dur } as CSSProperties
            }
          />
        );
      })}
    </svg>
  );
}
