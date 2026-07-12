import { PRESET_THEMES, presetPalette, paletteSlotVar, PALETTE_SLOTS } from "dssoca";
import type { ThemePalette } from "dssoca";

// Per-preset --ss-* override blocks, keyed on html[data-palette] (set by the
// app.html boot script / theme store). [data-palette][data-theme] (0,2,0)
// out-specifies tokens.css's `:root, [data-theme=…]` (0,1,0), so source order
// vs the bundle is irrelevant. Injected into <head> server-side via the
// %presets.css% placeholder in app.html (hooks.server.ts) so SSR HTML paints
// the right palette with zero JS.
const block = (sel: string, t: ThemePalette) =>
  `${sel}{${PALETTE_SLOTS.map((s) => `${paletteSlotVar(s)}:${t[s]}`).join(";")}}`;

const presetCss = PRESET_THEMES.map((p) => {
  const pal = presetPalette(p.name); // single-mode presets mirror into both
  return (
    block(`[data-palette='${p.name}'][data-theme='dark']`, pal.dark) +
    block(`[data-palette='${p.name}'][data-theme='light']`, pal.light)
  );
}).join("\n");

export const presetStyleTag = `<style>${presetCss}</style>`;
