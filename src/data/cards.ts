/* The Major Arcana deck: 22 cards, each mapping a Major Arcana to an iconic
   Gen 1 Pokemon, with upright and reversed meanings written in its voice. */

export type GlyphKey =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "fairy";

export type TypeName =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Fairy";

export interface TypeInfo {
  /** swatch / glyph color */
  c: string;
  /** glyph key (drawn in Sigil.tsx) */
  glyph: GlyphKey;
}

export interface Card {
  /** 0-21 stable id */
  n: number;
  /** display numeral */
  roman: string;
  arcana: string;
  mon: string;
  dex: number;
  /** 1-2 entries, keys into TYPES */
  types: TypeName[];
  /** upright prose, in the creature's voice */
  up: string;
  upKeys: string[];
  /** reversed prose */
  rev: string;
  revKeys: string[];
}

export interface Position {
  key: "past" | "present" | "future";
  label: string;
  sub: string;
  line: string;
}

// Pokemon type -> color + glyph key (glyph drawn in Sigil.tsx)
export const TYPES: Record<TypeName, TypeInfo> = {
  Normal: { c: "#b9b48f", glyph: "normal" },
  Fire: { c: "#f0863f", glyph: "fire" },
  Water: { c: "#5a93f0", glyph: "water" },
  Electric: { c: "#f6cf3b", glyph: "electric" },
  Grass: { c: "#74c95a", glyph: "grass" },
  Ice: { c: "#8fd3d3", glyph: "ice" },
  Fighting: { c: "#d84a3a", glyph: "fighting" },
  Poison: { c: "#b558c4", glyph: "poison" },
  Ground: { c: "#dcb968", glyph: "ground" },
  Flying: { c: "#a99cf2", glyph: "flying" },
  Psychic: { c: "#f85e8f", glyph: "psychic" },
  Bug: { c: "#a6bb2f", glyph: "bug" },
  Rock: { c: "#c4ab48", glyph: "rock" },
  Ghost: { c: "#8a6fc4", glyph: "ghost" },
  Dragon: { c: "#7a52f8", glyph: "dragon" },
  Fairy: { c: "#f29ec0", glyph: "fairy" },
};

export const CARDS: Card[] = [
  {
    n: 0,
    roman: "0",
    arcana: "The Fool",
    mon: "Psyduck",
    dex: 54,
    types: ["Water"],
    up: "An aching mind on the brink of the unknown. Psyduck steps off the ledge not from courage but from innocence — and when the headache crests, a latent power answers. Begin before you understand; the leap itself is the lesson.",
    upKeys: ["Beginnings", "Innocence", "Latent power"],
    rev: "The mind clenches against the plunge. Hesitation curdles into a dull, throbbing dread, and the leap is delayed until the moment has passed. Recklessness or paralysis — neither will serve you now.",
    revKeys: ["Hesitation", "Recklessness", "Held breath"],
  },
  {
    n: 1,
    roman: "I",
    arcana: "The Magician",
    mon: "Alakazam",
    dex: 65,
    types: ["Psychic"],
    up: "Will sharpened to a single point. Alakazam bends the spoons of reality with a mind that forgets nothing; every tool you require is already in your hands. Stop wishing — channel, and manifest.",
    upKeys: ["Manifestation", "Mastery", "Focused will"],
    rev: "Power without aim, brilliance turned to sleight of hand. The trick dazzles but rings hollow; talent spent on illusion deceives its caster first. Gather your scattered focus before it scatters you.",
    revKeys: ["Manipulation", "Scattered focus", "Illusion"],
  },
  {
    n: 2,
    roman: "II",
    arcana: "The High Priestess",
    mon: "Clefairy",
    dex: 35,
    types: ["Fairy"],
    up: "Beneath the full moon, secrets dance. Clefairy gathers in starlight to commune with what cannot be spoken aloud; trust the quiet knowing that asks for no proof. The veil is thin tonight — listen.",
    upKeys: ["Intuition", "Mystery", "The unseen"],
    rev: "The inner voice is drowned in noise. Secrets kept too long begin to fester, and intuition is dismissed as foolishness. You search the horizon for an answer that only ever rises from within.",
    revKeys: ["Withheld secrets", "Lost intuition", "Static"],
  },
  {
    n: 3,
    roman: "III",
    arcana: "The Empress",
    mon: "Chansey",
    dex: 113,
    types: ["Normal"],
    up: "Abundance carried in gentle hands. Chansey gives without keeping ledger — an egg for the weary, warmth for the wounded — and in the giving, multiplies. Nurture what you wish to watch grow.",
    upKeys: ["Nurture", "Abundance", "Care"],
    rev: "The well gives until it runs dry. Care curdles into smothering, or the self is starved to keep feeding others. Tend your own garden before it quietly withers.",
    revKeys: ["Depletion", "Smothering", "Neglected self"],
  },
  {
    n: 4,
    roman: "IV",
    arcana: "The Emperor",
    mon: "Nidoking",
    dex: 34,
    types: ["Poison", "Ground"],
    up: "Dominion earned through sheer force of will. Nidoking holds the ground he stands upon and answers to no one; structure, boundary, and command are his throne. Lead — and be accountable for the realm you rule.",
    upKeys: ["Authority", "Structure", "Command"],
    rev: "Power calcified into tyranny. The crown grips too tightly; rigidity is mistaken for strength until it cracks beneath its own weight. Dominion without mercy only breeds the rebellion that ends it.",
    revKeys: ["Tyranny", "Rigidity", "Control"],
  },
  {
    n: 5,
    roman: "V",
    arcana: "The Hierophant",
    mon: "Slowking",
    dex: 199,
    types: ["Water", "Psychic"],
    up: "Wisdom worn like an ancient crown. Slowking speaks slowly because each word has been weighed for ages; tradition and patient counsel light the well-walked path. Seek the teaching that has already endured.",
    upKeys: ["Tradition", "Wisdom", "Guidance"],
    rev: "Dogma mistaken for truth. The old answers no longer fit the new question, yet the crown refuses to be lifted. Question the doctrine; the road that is yours may not be the road that is mapped.",
    revKeys: ["Dogma", "Conformity", "Stale counsel"],
  },
  {
    n: 6,
    roman: "VI",
    arcana: "The Lovers",
    mon: "Nidoran ♂♀",
    dex: 32,
    types: ["Poison"],
    up: "Two paths, one choice, made as one. The Nidoran pair mirror each other across the divide of difference, and in union discover what neither could hold alone. Choose with the whole of the heart.",
    upKeys: ["Union", "Choice", "Harmony"],
    rev: "The mirror cracks down its middle. Values fall out of alignment, or a choice is made for the wrong reasons, and what was whole now pulls in two directions. Reckon with the divide before it widens.",
    revKeys: ["Discord", "Misalignment", "Temptation"],
  },
  {
    n: 7,
    roman: "VII",
    arcana: "The Chariot",
    mon: "Rapidash",
    dex: 78,
    types: ["Fire"],
    up: "Momentum mastered, fury reined. Rapidash runs at sixty miles an hour with its mane ablaze, yet every flame bends to the rider's will. Hold the reins — victory belongs to the disciplined charge.",
    upKeys: ["Drive", "Willpower", "Triumph"],
    rev: "The steed bolts and the rider only clings. Direction is lost to raw speed, ambition outruns control, and the fire scorches the very path it meant to light. Rein in before the crash.",
    revKeys: ["Lost control", "Scattered drive", "Burnout"],
  },
  {
    n: 8,
    roman: "VIII",
    arcana: "Strength",
    mon: "Machamp",
    dex: 68,
    types: ["Fighting"],
    up: "Four arms, and not one raised in anger. Machamp could level a mountain, yet true strength is the power held gently in check. Master the beast within not by caging it, but by befriending it.",
    upKeys: ["Inner strength", "Courage", "Restraint"],
    rev: "Force flexed to mask a fear. Raw power without temperance becomes a fist that bruises what it meant to hold; or self-doubt smothers the strength that was already there. Steady the hand.",
    revKeys: ["Self-doubt", "Brute force", "Insecurity"],
  },
  {
    n: 9,
    roman: "IX",
    arcana: "The Hermit",
    mon: "Cubone",
    dex: 104,
    types: ["Ground"],
    up: "Grief is its own austere teacher. Cubone wears the skull of what it lost and walks alone, and in that solitude hears the truths the crowd would drown. Withdraw a while, and let the silence speak.",
    upKeys: ["Solitude", "Reflection", "Inner search"],
    rev: "Solitude hardened into exile. The mourning that once taught now only isolates; the lantern is hidden and the path forgotten. Loneliness, remember, is not the same thing as wisdom.",
    revKeys: ["Isolation", "Withdrawal", "Lostness"],
  },
  {
    n: 10,
    roman: "X",
    arcana: "Wheel of Fortune",
    mon: "Magikarp",
    dex: 129,
    types: ["Water"],
    up: "The lowliest splash conceals a turning tide. Magikarp endures every mockery, for fortune's wheel is already mid-spin — and what flails today may rise a leviathan tomorrow. Trust the cycle.",
    upKeys: ["Fate", "Cycles", "Reversal"],
    rev: "The wheel jams at the bottom of its arc. Misfortune begins to feel like a verdict, the struggle endless, no evolution in sight. But resisting the turn only lengthens the time spent low.",
    revKeys: ["Bad luck", "Stagnation", "Resistance"],
  },
  {
    n: 11,
    roman: "XI",
    arcana: "Justice",
    mon: "Scyther",
    dex: 123,
    types: ["Bug", "Flying"],
    up: "The blade falls true, and clean. Scyther cuts without cruelty, severing only what must be severed; cause meets consequence along a perfect, impartial edge. Face the truth and accept the verdict it carries.",
    upKeys: ["Truth", "Cause & effect", "Balance"],
    rev: "The scales tilt beneath a hidden thumb. Accountability is dodged, judgment is clouded by bias, and the cut lands crooked. A dishonesty indulged now carves a far deeper wound later.",
    revKeys: ["Injustice", "Dishonesty", "Imbalance"],
  },
  {
    n: 12,
    roman: "XII",
    arcana: "The Hanged Man",
    mon: "Slowpoke",
    dex: 79,
    types: ["Water", "Psychic"],
    up: "Surrender, and the world rights itself. Slowpoke waits with its tail dipped in the water, forcing nothing, demanding nothing — and insight arrives precisely because it stopped giving chase. Pause; let the new view come to you.",
    upKeys: ["Surrender", "New perspective", "Patience"],
    rev: "Stalling dressed up as serenity. The pause has quietly become an excuse, the necessary sacrifice withheld, and stagnation wears the mask of peace. Waiting, after all, is not the same as letting go.",
    revKeys: ["Stalling", "Indecision", "Wasted time"],
  },
  {
    n: 13,
    roman: "XIII",
    arcana: "Death",
    mon: "Gengar",
    dex: 94,
    types: ["Ghost", "Poison"],
    up: "An ending grins from the doorway. Gengar is the shadow that swallows the old shape so a truer one may form; this is not the grave but the threshold. Let the thing die — and consent to be remade.",
    upKeys: ["Transformation", "Endings", "Release"],
    rev: "Clutching the corpse of what was. Change is refused, the shadow lingers at the edge of sight, and decay settles in where renewal was due. The fear of the end is what prolongs the dying.",
    revKeys: ["Resisting change", "Stagnation", "Decay"],
  },
  {
    n: 14,
    roman: "XIV",
    arcana: "Temperance",
    mon: "Lapras",
    dex: 131,
    types: ["Water", "Ice"],
    up: "Grace ferries the lost across the deep. Lapras blends gentleness with strength, carrying the weary on a song that soothes the storm itself; patience and balance are its quiet current. Find the middle flow.",
    upKeys: ["Balance", "Patience", "Harmony"],
    rev: "The waters churn out of all measure. Excess in one direction, depletion in another; the song slips out of tune and the crossing turns perilous. Recover the equilibrium before the wave does it for you.",
    revKeys: ["Imbalance", "Excess", "Discord"],
  },
  {
    n: 15,
    roman: "XV",
    arcana: "The Devil",
    mon: "Gyarados",
    dex: 130,
    types: ["Water", "Flying"],
    up: "Rage given a serpent's body. Gyarados is the wrath that levels cities, the chain of base impulse pulled taut; the Devil tempts you to mistake that fury for freedom. See, first, that you hold your own leash.",
    upKeys: ["Bondage", "Wrath", "Temptation"],
    rev: "The chain loosens, one link at a time. The rage is finally recognized for the prison it always was, and the serpent begins, grudgingly, to release its grip. Freedom starts the moment you name the hunger.",
    revKeys: ["Release", "Reclaiming power", "Breaking free"],
  },
  {
    n: 16,
    roman: "XVI",
    arcana: "The Tower",
    mon: "Zapdos",
    dex: 145,
    types: ["Electric", "Flying"],
    up: "Lightning seeks the proudest spire. Zapdos descends in a storm that shatters whatever was raised on false ground; the structure falls so that the truth beneath it may finally stand. Brace — the strike is clearing your way.",
    upKeys: ["Upheaval", "Sudden change", "Revelation"],
    rev: "The bolt is dodged, the collapse merely deferred. Disaster is averted only to be rescheduled, and the cracked tower is patched instead of rebuilt. Resisting the necessary fall just prolongs the dread of it.",
    revKeys: ["Averted disaster", "Fear of change", "Delay"],
  },
  {
    n: 17,
    roman: "XVII",
    arcana: "The Star",
    mon: "Articuno",
    dex: 144,
    types: ["Ice", "Flying"],
    up: "Hope glides down through the blizzard. Articuno appears to those lost in the white silence — a calm blue beacon promising the storm will end; serenity and faith are gently restored. Look up. You are being guided.",
    upKeys: ["Hope", "Renewal", "Serenity"],
    rev: "The beacon dims behind the snow. Faith falters, inspiration freezes mid-air, and the lost wander on believing no help is coming. The light has not gone — despair has only hidden it from view.",
    revKeys: ["Despair", "Lost faith", "Disconnection"],
  },
  {
    n: 18,
    roman: "XVIII",
    arcana: "The Moon",
    mon: "Hypno",
    dex: 97,
    types: ["Psychic"],
    up: "Between waking and dream, the truth wears a mask. Hypno swings its pendulum and the mind sinks past reason into a country of fear and vision; not all here is illusion, and not all of it is real. Trust the dream — but know it for a dream.",
    upKeys: ["Illusion", "Dreams", "The subconscious"],
    rev: "The fog begins, at last, to lift. Hidden fears are dragged into the daylight, the old deceptions unravel, and the nightmare slowly loosens its grip. Clarity comes — unhurried, and not without its cost.",
    revKeys: ["Released fear", "Clarity", "Unveiling"],
  },
  {
    n: 19,
    roman: "XIX",
    arcana: "The Sun",
    mon: "Moltres",
    dex: 146,
    types: ["Fire", "Flying"],
    up: "Out of the embers, the dawn takes wing. Moltres carries the flame of high summer; wherever it passes, warmth and vitality and the bright certainty of joy follow close behind. Rise, radiant — this is your season.",
    upKeys: ["Joy", "Vitality", "Success"],
    rev: "The flame guttered behind a passing cloud. Joy feels suddenly rationed, optimism dimmed, the warmth present but just beyond reach. Tend the ember — the sun has not set, it has only stepped behind the grey.",
    revKeys: ["Dimmed joy", "Passing gloom", "Delayed success"],
  },
  {
    n: 20,
    roman: "XX",
    arcana: "Judgement",
    mon: "Mewtwo",
    dex: 150,
    types: ["Psychic"],
    up: "An awakening to the question of one's own purpose. Mewtwo, born of will and grief, rises to reckon with what it was made for — and chooses, instead, what it will become. The call has sounded. Answer it, and be reborn.",
    upKeys: ["Reckoning", "Rebirth", "Awakening"],
    rev: "The call goes unanswered in the dark. Self-judgment sours into self-condemnation, the past replays without absolution, and the rebirth is refused at its threshold. You cannot move forward while still on trial within.",
    revKeys: ["Self-doubt", "Refusal", "Unfinished reckoning"],
  },
  {
    n: 21,
    roman: "XXI",
    arcana: "The World",
    mon: "Mew",
    dex: 151,
    types: ["Psychic"],
    up: "In one small body, the whole of life is written. Mew carries the DNA of every creature that is or was or will be — beginning and ending folded into a single dance of completion. The circle closes; you have arrived.",
    upKeys: ["Completion", "Wholeness", "Fulfillment"],
    rev: "The circle stays open by a hair's breadth. So near to wholeness, and yet one final thread still dangles loose; the closure is delayed, the journey not quite finished. Honor the last step before you declare the end.",
    revKeys: ["Incompletion", "Loose ends", "Almost there"],
  },
];

// Position framing for the three-card spread.
export const POSITIONS: Position[] = [
  { key: "past", label: "The Past", sub: "what was woven", line: "In what came before" },
  { key: "present", label: "The Present", sub: "what now turns", line: "In this present moment" },
  { key: "future", label: "The Future", sub: "what may yet be", line: "In what is still becoming" },
];
