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
- Shuffle: Fisher–Yates over `crypto.getRandomValues` (rejection sampling, no modulo bias).
- Themes (`data-skin` on `<html>`): Felt (default), Éditorial paper and Éditorial noir
  (tokens from the L'IMPACT magazine site: Playfair Display + Cormorant Garamond, bronze/champagne
  accents, radius 0), iPS (zinc surfaces, Poppins, #0072c6 accent), Classic (bright teal cloth, Oswald ranks, Alfa Slab One labels, red lace backs, yellow accent), Walnut (wood-grain table, beveled cream paper, gold inlay, burgundy accents, Playfair numerals), Walnut Deco (same table, Cinzel numerals + Josefin Sans labels), Aurora (animated northern lights and stars, dark glass cards, Orbitron numerals, gradient accents), Glass (Apple Liquid Glass style: translucent capsules over a moving mesh gradient, SF Pro Rounded, follows system light/dark). Each is a `:root[data-skin=…]`
  token block in the stylesheet; add a theme by adding a block and an entry in `SKINS`.
- Storage: `localStorage` keys `spider-solitaire-save-v1` (game + undo history), `spider-solitaire-skin` (theme) and `spider-solitaire-stats-v1` (record: played/won per difficulty, best score/time/fewest moves, current and best streak; a game counts when won or abandoned after at least one move).
