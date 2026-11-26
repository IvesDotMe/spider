# Spider Solitaire

Single-file React implementation of Spider Solitaire (one, two or four suits), packaged as an
installable, offline-capable web app (PWA).

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole game (React via `React.createElement`, no build step) plus PWA meta tags and service-worker registration |
| `manifest.webmanifest` | Name, icons, standalone display — what makes "Add to Home Screen" install it as an app |
| `sw.js` | Service worker: precaches the app shell on first visit so it opens with no network; caches Google Fonts as they load |
| `vendor/react*.js` | React 18.3.1 UMD builds, vendored so nothing depends on a CDN |
| `icons/` | Home-screen icons (192, 512, maskable 512, Apple touch 180) |

Open `index.html` straight from disk to play in a browser (the service worker is skipped on `file://`,
so offline install needs hosting).

## Install on iPhone

The app has to be served over **HTTPS** — Safari only installs PWAs from a real origin, never from a file.
Easiest free option is GitHub Pages:

1. Push this folder to a GitHub repo (e.g. `spider-solitaire`), files at the repo root.
2. Repo → Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Open `https://<you>.github.io/spider-solitaire/` in **Safari** on the iPhone (Chrome/Firefox on iOS
   can't install PWAs). Play once so the service worker finishes caching.
4. Share button → **Add to Home Screen** → Add.

From then on the icon launches full-screen (no Safari chrome), works in airplane mode, and keeps the
game in progress and your theme choice. All paths are relative, so any static host works
(Netlify, Cloudflare Pages, an intranet server, …).

### Updating

Push new files; the service worker version is derived from the source, so the next launch with
network fetches the new build and swaps it in on the following launch. To force it on a phone:
delete the home-screen icon and add it again.

## Game notes

- Rules: two decks (104 cards), 10 columns, 5 stock deals. Any card sits on the next rank up; only
  same-suit descending runs move together. Complete K→A same-suit runs fly to the eight slots.
  Dealing requires every column to be non-empty.
- Controls: tap a card to send it to its best spot, or drag it. Undo (Ctrl+Z), Hint (H),
  Deal (D / tap the stock).
- Shuffle: each card draws a 64-bit key from `crypto.getRandomValues` and the deck is sorted by key (uniform).
  The New game screen offers five ways to deal (saved in `spider-solitaire-shuffle`): Balanced (default; the
  least clumpy of ten shuffles), Pure (one uniform shuffle), Dealer (a new deck riffled five times, deliberately under-mixed, with the
  Gilbert–Shannon–Reeds model, then cut) Friendly (the most playable of ten shuffles) and Hardcore (the least playable of twenty).
- Themes (`data-skin` on `<html>`): Neon Drive is the default on a first visit. Classic (bright teal cloth, Oswald ranks, red lace backs),
  Felt, Walnut, Walnut Deco, Aurora (animated northern lights), Neon Drive (synthwave sun over a scrolling
  grid, glowing cards), Inferno (obsidian cards over a lava glow, rising embers), Sakura (washi paper, red
  sun, falling petals, indigo wave backs) and Abyss (light shafts and bubbles, pearl cards). Each is a
  `:root[data-skin=…]` token block in the stylesheet; add a theme by adding a block and an entry in `SKINS`.
- Phones: ten columns leave each card ~37px wide on an iPhone, so cards are drawn taller there and the
  face is all index (rank top-left, suit top-right, one big pip); face-up cards fan out by a full rank row.
- Hint: highlights the cards to move (gold, bobbing) and the card or empty column to move them to (green),
  and says the move in a toast. Pressing it again steps through every option: useful moves best-first, then
  dealing, then sideways moves.
- Storage: `localStorage` keys `spider-solitaire-save-v1` (game + undo history), `spider-solitaire-skin` (theme) and `spider-solitaire-stats-v1` (record: played/won per difficulty, best score/time/fewest moves, current and best streak; a game counts when won or abandoned after at least one move).

## Winning

Every win plays one of eight full-screen celebrations, picked at random and never the same twice in a row
(fireworks, confetti cannons, the classic bouncing-card cascade, falling glyph rain, an emoji storm, a warp
jump, disco lights with a bouncing logo, rainbow comets), under a random headline. The win screen also fetches
a prize from the internet (a dog or cat photo, a joke, or a fact) with a built-in list as the offline fallback,
and has buttons for another prize, another show, and a link to a random odd website. Skipped when the device
asks for reduced motion.
