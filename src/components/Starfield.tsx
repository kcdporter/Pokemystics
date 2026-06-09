/* Drifting starfield backdrop (hidden in the Dot-Matrix universe via CSS). */
import { useMemo, type CSSProperties } from "react";

export function Starfield() {
  const stars = useMemo(() => {
    const a: {
      left: number;
      top: number;
      size: number;
      tw: string;
      max: string;
      delay: string;
    }[] = [];
    for (let i = 0; i < 90; i++) {
      a.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.2 + 0.6,
        tw: (Math.random() * 5 + 3).toFixed(2) + "s",
        max: (Math.random() * 0.5 + 0.2).toFixed(2),
        delay: (Math.random() * 5).toFixed(2) + "s",
      });
    }
    return a;
  }, []);

  return (
    <div className="starfield">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: s.left + "%",
              top: s.top + "%",
              width: s.size,
              height: s.size,
              "--tw": s.tw,
              "--tw-max": s.max,
              animationDelay: s.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
