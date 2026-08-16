# passoca

Personal site of passoca (github: httpassoca) — SvelteKit 2 + Svelte 5 (**runes**), deployed on Vercel. Backend lives in a separate repo at `../passoca-api` (Express + Socket.IO + SQLite, serves `https://api.passoca.dev`); the site reaches it via `VITE_API_URL`.

- Styling: Sass **indented syntax** in component `<style lang="sass">` blocks. No Tailwind in new code.
- i18n: Paraglide JS 2 — `messages/en.json` + `messages/pt-BR.json`. **Always add keys to BOTH locales**, then recompile (see Verification). Use via `import { m } from "$lib/paraglide/messages"`.
- Package manager is yarn 1, but `yarn`/`npm` may not be on PATH in this environment — invoke local binaries directly: `./node_modules/.bin/<tool>`.
- Default branch: `master`. Vercel auto-deploys on push.

## Design system: always use dssoca

- ALWAYS build UI with the `dssoca` design system. Import components from `dssoca` (Button, Input, Modal, Card, Badge, Kbd, Tooltip, Select, DateField, NumberField, EmptyState, Toaster/`toast`, …) instead of hand-rolling buttons, inputs, modals, badges, or cards.
- Full component list and prop types: `node_modules/dssoca/dist/index.d.ts` and `node_modules/dssoca/dist/components/*.svelte.d.ts` — read the `.d.ts` before using a component.
- Style with `--ss-*` design tokens (colors, fonts, sizes, shadows, motion) so all site themes keep working. Never hardcode colors or fonts, and never introduce a parallel token system.
- Chart colors come from `CHART_PALETTE` (exported by `dssoca`).

## Verification

- Done-bar: `svelte-check` + build must pass (`./node_modules/.bin/svelte-check --tsconfig ./tsconfig.json` and `./node_modules/.bin/vite build`). No browser rig unless asked.
- After editing `messages/*.json`, recompile: `./node_modules/.bin/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide` (the `src/lib/paraglide/` output is generated — never edit it).

## Roulette module (`/roulette`)

Hidden realtime page (noindex, not in nav/search) where friends pick a film to watch: everyone brainstorms in a shared pad, adds picks (TMDB-backed) to a wheel, and one synced spin decides. Client-only (`+page.ts`: `ssr = false`) because it needs localStorage + sockets. Layout follows the "Movie Night" wireframe: page head with accent title, then 7/3 columns (ideas panel — personal notes | shared draft, 50/50 | add-a-pick + wheel card) sharing one clamped height, with history as a **full-width poster grid** below them. **The wheel exists only as a fullscreen takeover.**

### Files

- `src/routes/roulette/+page.svelte` — state wiring, layout, join flow, spin button, winner row, modals composition. (The per-person limit is read-only here; the admin changes it in Settings.)
- `src/routes/roulette/tierlist/+page.svelte` — full-bleed tierlist page: head buttons open **General** and **Timeline** as fullscreen modals, the personal tierlist is the page body, `AdminTierlists` below it for the admin.
- `src/lib/roulette/` — `types.ts` (Option/WheelState/HistoryEntry/MediaRef/MediaPick/…), `client.ts` (`createRouletteClient`: Socket.IO `/roulette` namespace + Yjs provider → Svelte stores), `helpers.ts` (`colorForName`, `isAdmin`, localStorage keys), `media.ts` (TMDB proxy fetch helpers, `tmdbImg`, `mediaLang`), `spin.svelte.ts` (`SpinController` — the spin animation state machine), `index.ts` re-exports.
- `src/lib/components/Roulette/` — `Wheel.svelte` (pure SVG film wheel: TMDB-backdrop wedges via per-wedge clipPath, rim scrim, arc textPath titles oriented for the wheel's bottom, winner glow; rotation is applied by the parent, never inside the SVG), `WheelArea.svelte` (fullscreen takeover with two stages: idle = whole wheel centered + SPIN button + drag-to-nudge for fun; expanded = the wheel drops down so its hub sits at the bottom edge with the top half visible, a needle at the hub points up at 12 o'clock, fullscreen winner backdrop + panel with admin Deny, confetti), `OptionsList`, `HistoryCard`, `JoinCard`, `MediaSearchInput` (debounced TMDB autocomplete), `MediaDetails` + `RulesModal` + `SettingsModal` (dssoca Modal; Settings is admin-only: per-person limit stepper + client-side-derived user list with delete/wipe via `user:remove`), `MediaPoster`, `IdeasEditor` (CodeMirror + yCollab CRDT, fills the pane it's given), `PersonalIdeas` (debounced private notes — plain textarea, no preview), `HistoryCard` (full-width poster grid). Tierlist: `GeneralTierlist` + `TierlistTimeline` (dssoca `Modal fullscreen` — use the prop, never hand-rolled `100vw/100vh` overrides; `GeneralTierlist` passes a **snippet** to `Tooltip`'s `text` for the per-person ranks), `PersonalTierlist` (svelte-dnd-action zones + unranked tray), `AdminTierlists`, `TierRow`, `TierTile` (the shared 108px tile — the timeline matches it).

### Invariants — do not break these

1. **The server picks the winner.** Clients only emit `wheel:spin`; `winner_id`/`spin_turns`/`spun_at` come back in the wheel snapshot. Never pick client-side.
2. **Whole-turn landing math** (`spin.svelte.ts`): rotation is cumulative; on spin it normalizes to a whole-turn boundary then adds `360·turns + align` where `align = 360 − (index+0.5)·segment` — this rests the winner's wedge midline at the wheel's **12 o'clock**, where the fixed hub needle points (the wheel sits at the bottom of the screen, top half visible). `turns` must stay an integer. The normalization also absorbs any playful drag offset from the idle stage.
3. **No replay for new visitors**: the wheel store's first emission is a local placeholder (swallowed via `sawServerWheel`); `lastSpunAt === undefined` on the first real snapshot makes the wheel *snap* (duration 0) instead of animating. `overlayDismissed` starts `true` so late joiners never get the takeover.
4. **The wheel node stays mounted.** `WheelArea` is a fixed overlay hidden with `visibility` (never `{#if}`/`display:none`) so the CSS rotation transition can't restart mid-spin. Rotation lives on an HTML wrapper (`.spin-layer`), never on an SVG `<g>` — inner-SVG transforms re-rasterize the art every frame and lag the spin; stage moves (center ↔ hang-from-top) are composited holder transforms only.
5. **Admin is server-confirmed** (password on `identify`; ack drives `admin` state) — never inferred from the name. Password cached in localStorage only after a successful admin ack.
6. **TMDB flow**: search goes through the API proxy (`media.ts`); picking a result sends only `{media_type, tmdb_id, lang}` with `option:add` — the server re-fetches canonical metadata. Free-text options (no media) must always keep working, including when `GET /roulette/media/status` says disabled.
7. **Unknown history dates**: `drawn_at === ""` means unknown (imported past roulettes) — render `m.roulette_date_unknown()`, never `fmtDate("")`.
8. Per-person option limit is UX client-side (`atLimit`) but enforced server-side; admin bypasses it.
9. **Personal tierlist autosaves, the general one is published.** Every drop debounce-saves via `tierlist:set` (which never moves the group's list); only the "update general tierlist" button emits `tierlist:publish`. Flush the pending save before publishing, and keep the `dirty` guard that stops an incoming snapshot from reverting an unsaved drag.
