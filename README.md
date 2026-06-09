<div align="center">

# ✦ Pokemystics ✦

### *Gen I · The Major Arcana*

**Still your mind. Hold your question. Let the deck reveal what was, what is, and what is yet becoming.**

A little Pokémon **cartomancy** — pose a question, shuffle the deck, and draw a three-card
**Past · Present · Future** spread. Each card maps a Gen I Pokémon onto a Major Arcana,
with its own upright *and* reversed meanings, written in the creature's voice. 🔮

*Twenty-two creatures. Tens of thousands of fates.*

</div>

---

## ✨ What makes it sparkle

- 🃏 **22-card Major Arcana deck** — Psyduck is The Fool, Mewtwo is Judgement, Mew is The World… each with hand-written upright + reversed prose.
- 🌈 **Holographic foil** that tilts and shimmers under your cursor, with 3D flip-and-spin reveals and little particle bursts.
- 🪐 **Four swappable universes** — pick the mood that fits your fate:
  - 🌙 **Midnight Arcana** — gold & violet, the default candlelit vibe
  - 💎 **Holographic Foil** — cyan/magenta, maximum shimmer
  - 🎮 **Dot-Matrix** — monochrome green Game Boy, CRT scanlines and all
  - 🌆 **Vaporwave Neon** — sunset gradients and electric pinks
- 🔗 **Shareable readings** — every reading makes a link that drops a friend straight into *your* exact spread.
- 📱 **Responsive** and **reduce-motion friendly**, keyboard-operable cards, and your last reading is remembered on refresh.

## 🎨 About the art

There's no literal Pokémon artwork drawn by hand here — each card's "art" is an **arcane sigil**:
an alchemy ring + dex numeral wrapping the creature itself. The Pokémon's real shape is rendered
as a **type-tinted silhouette** (its sprite, CSS-masked and filled with the card's type color, with
a faint shadow of inner detail) so Water reads cool-blue, Psychic reads magenta, Fire reads ember —
all cohesive with the engraved, foil-kissed look. ✨

## 🛠 Built with

**React 18 + TypeScript + Vite** — purely client-side, no backend, no tracking, no accounts.
State lives in `localStorage`; the only "API" is your imagination. Fonts: Cinzel, Cinzel Decorative,
Cormorant Garamond, and VT323 (for the Game Boy theme).

## 🚀 Run it locally

```bash
npm install
npm run dev        # start the Vite dev server → http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build

node scripts/fetch-sprites.mjs   # (re)vendor the Pokémon sprites into public/mons/
```

## 🗂 Project layout

```
src/
  data/cards.ts          The 22-card deck, types, and spread positions
  share.ts               Encode/decode a reading into a shareable URL
  components/
    Sigil.tsx            Sigil + CardBack SVGs, type glyphs, and the silhouette layer
    PokeCard.tsx         Flip/spin reveal, cursor tilt, foil, levitation, parallax, sparks
    Starfield.tsx        Drifting star backdrop
    ThemePicker.tsx      Visual-universe picker
    ShuffleDeck.tsx      The riffling deck + glitch caption
    IntroScreen.tsx      The ritual / question screen
    SpreadScreen.tsx     The three-card spread
    ReadingOut.tsx       The woven interpretation + share button
    SettingsPanel.tsx    Foil / tilt / particles / motion / reversed-chance controls
  App.tsx                Phase state machine, theme engine, persistence, parallax
  styles.css             All theming, layout, foil, and animations
  types.ts               Shared types + theme/tweak defaults
```

## 🔮 How a reading works

`intro → shuffling → spread`. Three distinct cards are drawn into the Past, Present, and Future
positions; each independently lands upright or **reversed** (≈42% by default, tweakable), which
inverts its sigil and flips it to the reversed prose. Once all three are turned, the deck weaves
them into a short answer — and a synthesis line that threads the first keyword of each card together.

## 🌱 Someday: the Minor Arcana

Starters, Pikachu, and Charizard are *intentionally* left out of the deck — they're being saved for
a future **Minor Arcana** (type-suits) expansion. The data-driven design already covers all 16 types,
so they can join with no structural change. 🌟

## 💌 Credits & a tiny note

Pokémon and all related names are trademarks of Nintendo / Game Freak / The Pokémon Company. This is
a non-commercial fan project made for fun and for a portfolio. The vendored sprites in `public/mons/`
come from [PokeAPI/sprites](https://github.com/PokeAPI/sprites). 💛
