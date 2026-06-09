/* Universe registry types.

   A "Universe" bundles a generation's deck + reading rules: which Pokémon are
   in the deck, the positions of the spread, how many cards are drawn, and
   which synthesis layers fire. Universes scale in complexity across gens. */
import type { Card, Position } from "../data/cards";

export type UniverseId = "gen1" | "gen2";

export interface Universe {
  id: UniverseId;
  /** Display name, e.g. "Gen I". */
  label: string;
  /** Long-form name shown under the label, e.g. "Kanto · Major Arcana". */
  tagline: string;
  /** The deck of cards in this universe. */
  deck: Card[];
  /** Positions of the spread; length determines how many cards are drawn. */
  positions: Position[];
  /** Whether each card carries a "shadow voice" (second prose layer). */
  hasShadowVoice: boolean;
  /** Whether the synthesis includes a type-balance reading. */
  hasTypeBalance: boolean;
}
