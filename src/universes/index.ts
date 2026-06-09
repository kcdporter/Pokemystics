/* Universe registry. The active universe drives deck, spread shape, and which
   complexity layers fire in the reading. */
import { GEN1 } from "./gen1";
import { GEN2 } from "./gen2";
import type { Universe, UniverseId } from "./types";

export type { Universe, UniverseId } from "./types";

export const UNIVERSES: Universe[] = [GEN1, GEN2];

const BY_ID = new Map<UniverseId, Universe>(UNIVERSES.map((u) => [u.id, u]));

export function getUniverse(id: UniverseId): Universe {
  return BY_ID.get(id) ?? GEN1;
}

export const DEFAULT_UNIVERSE: UniverseId = "gen1";
