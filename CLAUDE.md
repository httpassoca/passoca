# passoca

Personal site — SvelteKit 2 + Svelte 5 (runes), Sass indented syntax in component `<style lang="sass">` blocks, Paraglide i18n (`messages/en.json` + `messages/pt-BR.json` — always add keys to BOTH locales).

## Design system: always use dssoca

- ALWAYS build UI with the `dssoca` design system. Import components from `dssoca` (Button, Input, Modal, Card, Badge, Kbd, Tooltip, Select, DateField, NumberField, EmptyState, Toaster/`toast`, …) instead of hand-rolling buttons, inputs, modals, badges, or cards.
- Full component list and prop types: `node_modules/dssoca/dist/index.d.ts` and `node_modules/dssoca/dist/components/*.svelte.d.ts` — read the `.d.ts` before using a component.
- Style with `--ss-*` design tokens (colors, fonts, sizes, shadows, motion) so all site themes keep working. Never hardcode colors or fonts, and never introduce a parallel token system.
- Chart colors come from `CHART_PALETTE` (exported by `dssoca`).

## Verification

- Done-bar: `svelte-check` + build must pass (`./node_modules/.bin/svelte-check --tsconfig ./tsconfig.json` and `./node_modules/.bin/vite build`). No browser rig unless asked.
- After editing `messages/*.json`, recompile: `./node_modules/.bin/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide`.
