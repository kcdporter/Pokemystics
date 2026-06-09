/* The visual-universe radio group in the top bar. */
import { THEMES, type ThemeKey } from "../types";

export function ThemePicker({
  theme,
  setTheme,
}: {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
}) {
  return (
    <div className="theme-picker" role="radiogroup" aria-label="Visual universe">
      <span className="tp-label">Universe</span>
      {THEMES.map((t) => (
        <button
          key={t.k}
          className={"tp-swatch" + (theme === t.k ? " active" : "")}
          data-k={t.k}
          title={t.name}
          aria-label={t.name}
          aria-checked={theme === t.k}
          role="radio"
          style={{ background: t.swatch }}
          onClick={() => setTheme(t.k)}
        />
      ))}
    </div>
  );
}
