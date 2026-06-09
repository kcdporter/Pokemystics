/* Settings popover: controls spectacle (foil, tilt, particles), motion, and
   the reversed-card chance. Toggled from the gear button in the top bar. */
import { useEffect, useRef } from "react";
import type { Tweaks } from "../types";

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="set-row">
      <div className="set-lbl">
        <span>{label}</span>
        {value != null ? <span className="set-val">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="set-row set-row-h">
      <span>{label}</span>
      <button
        type="button"
        className="set-toggle"
        data-on={value ? "1" : "0"}
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  );
}

export function SettingsPanel({
  open,
  onClose,
  tweaks,
  setTweaks,
}: {
  open: boolean;
  onClose: () => void;
  tweaks: Tweaks;
  setTweaks: (fn: (prev: Tweaks) => Tweaks) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // close on Escape or outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    // defer so the opening click doesn't immediately close it
    const t = setTimeout(() => window.addEventListener("mousedown", onDown), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="set-panel" ref={panelRef} role="dialog" aria-label="Settings">
      <div className="set-hd">
        <b>Settings</b>
        <button className="set-x" aria-label="Close settings" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="set-body">
        <div className="set-sect">Spectacle</div>
        <Row label="Foil intensity" value={tweaks.foil.toFixed(1)}>
          <input
            type="range"
            className="set-slider"
            min={0}
            max={2.5}
            step={0.1}
            value={tweaks.foil}
            aria-label="Foil intensity"
            onChange={(e) => setTweaks((p) => ({ ...p, foil: Number(e.target.value) }))}
          />
        </Row>
        <Row label="Card tilt" value={tweaks.tilt.toFixed(1)}>
          <input
            type="range"
            className="set-slider"
            min={0}
            max={2}
            step={0.1}
            value={tweaks.tilt}
            aria-label="Card tilt"
            onChange={(e) => setTweaks((p) => ({ ...p, tilt: Number(e.target.value) }))}
          />
        </Row>
        <Toggle
          label="Particle bursts"
          value={tweaks.particles}
          onChange={(v) => setTweaks((p) => ({ ...p, particles: v }))}
        />
        <Toggle
          label="Reduce motion"
          value={tweaks.reduceMotion}
          onChange={(v) => setTweaks((p) => ({ ...p, reduceMotion: v }))}
        />

        <div className="set-sect">The draw</div>
        <Row label="Reversed chance" value={tweaks.reversedChance + "%"}>
          <input
            type="range"
            className="set-slider"
            min={0}
            max={100}
            step={1}
            value={tweaks.reversedChance}
            aria-label="Reversed chance"
            onChange={(e) =>
              setTweaks((p) => ({ ...p, reversedChance: Number(e.target.value) }))
            }
          />
        </Row>
      </div>
    </div>
  );
}
