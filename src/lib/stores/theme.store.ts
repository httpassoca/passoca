import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import { PRESET_THEMES, type PresetName } from "dssoca";

export type ThemeMode = "dark" | "light";
export type ThemeId = ThemeMode | PresetName;

export interface ThemeEntry {
  id: ThemeId;
  label: string;
  /** -> html[data-theme] */
  mode: ThemeMode;
  /** -> html[data-palette]; null = dssoca default green */
  palette: PresetName | null;
  /** Menu swatch (preset accent) */
  swatch: string;
  /** <meta name="theme-color"> (page background) */
  themeColor: string;
  favicon: string;
}

// Only dark/light/coffee logo files exist in static/favicons — presets reuse
// the logo matching their mode.
const favicon = (name: string) => `/favicons/${name}-logo.svg`;

// The boot script in src/app.html mirrors these ids/modes (inline scripts
// can't import) — keep the two in sync.
export const THEMES: ThemeEntry[] = [
  { id: "dark", label: "Dark", mode: "dark", palette: null, swatch: "#66ef73", themeColor: "#100f10", favicon: favicon("dark") },
  { id: "light", label: "Light", mode: "light", palette: null, swatch: "#2b7c34", themeColor: "#ebf2eb", favicon: favicon("light") },
  ...PRESET_THEMES.map((p): ThemeEntry => {
    const mode: ThemeMode = p.dark ? "dark" : "light";
    return {
      id: p.name,
      label: p.label,
      mode,
      palette: p.name,
      swatch: p.accent,
      themeColor: (p.dark ?? p.light)!.bg,
      favicon: favicon(p.name === "coffee" ? "coffee" : mode),
    };
  }),
];

const isThemeId = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);
// Legacy localStorage values (dark|light|coffee|dracula|tokyo-night) are all
// valid ids in the new model — validation is the migration.
const stored = browser ? localStorage.getItem("theme") : null;

export const theme = writable<ThemeId>(isThemeId(stored) ? stored : "dark");

export const themeEntry = derived(theme, ($t) => THEMES.find((e) => e.id === $t) ?? THEMES[0]);
export const isDarkTheme = derived(themeEntry, ($e) => $e.mode === "dark");

theme.subscribe((id) => {
  if (!browser) return;
  const e = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const el = document.documentElement;
  el.dataset.theme = e.mode;
  if (e.palette) el.dataset.palette = e.palette;
  else delete el.dataset.palette;
  localStorage.setItem("theme", e.id);
  // The favicon link lives in app.html — managed imperatively (svelte:head
  // attribute hydration is unreliable for it).
  document.querySelector<HTMLLinkElement>("link[rel=icon]")?.setAttribute("href", e.favicon);
});
