import type { Card } from "./data/cards";

export type ThemeKey = "midnight" | "holo" | "dmg" | "vapor";

export type Phase = "intro" | "shuffling" | "spread";

export interface DrawnCard {
  card: Card;
  reversed: boolean;
}

export interface Tweaks {
  /** cursor tilt intensity multiplier (0-2) */
  tilt: number;
  /** foil intensity multiplier (0-2.5) */
  foil: number;
  reduceMotion: boolean;
  /** percent chance a drawn card is reversed (0-100) */
  reversedChance: number;
  particles: boolean;
}

export interface ThemeMeta {
  k: ThemeKey;
  name: string;
  swatch: string;
}

export const THEMES: ThemeMeta[] = [
  {
    k: "midnight",
    name: "Midnight Arcana",
    swatch: "radial-gradient(circle at 50% 30%, #3a2a6e, #0a0718)",
  },
  {
    k: "holo",
    name: "Holographic Foil",
    swatch: "conic-gradient(from 0deg, #57e0ff, #ff5ed1, #ffe45e, #57ff9e, #57e0ff)",
  },
  { k: "dmg", name: "Dot-Matrix", swatch: "linear-gradient(135deg, #9bbc0f, #0f380f)" },
  { k: "vapor", name: "Vaporwave Neon", swatch: "linear-gradient(135deg, #00f0ff, #ff4ecd, #ff7a59)" },
];

// max length of the user's question (enforced on the input and on restore)
export const MAX_QUESTION = 90;

export const DEFAULT_TWEAKS: Tweaks = {
  tilt: 1,
  foil: 1,
  reduceMotion: false,
  reversedChance: 42,
  particles: true,
};
