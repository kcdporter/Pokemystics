/* Gen I — Kanto. The original 22-card Major Arcana deck and the 3-card
   Past/Present/Future spread. This is the baseline universe; the experience
   here matches the project's behavior before universes existed. */
import { CARDS, POSITIONS } from "../data/cards";
import type { Universe } from "./types";

export const GEN1: Universe = {
  id: "gen1",
  label: "Gen I",
  tagline: "Kanto · Major Arcana",
  deck: CARDS,
  positions: POSITIONS,
  spreadShape: "line",
  hasShadowVoice: false,
  hasTypeBalance: false,
};
