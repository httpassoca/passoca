import { CHART_PALETTE } from "dssoca";
import type { HistoryEntry, Option, Presence, TierlistState } from "./types";

export const ADMIN_NAME = "passoca";

export const NAME_KEY = "passoca:roulette:name";
export const PW_KEY = "passoca:roulette:pw";

/** Stable, readable colour derived from a name so identity is consistent. */
export function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const palette = CHART_PALETTE as readonly string[];
  return palette[Math.abs(hash) % palette.length];
}

export function isAdmin(name: string): boolean {
  return name.trim() === ADMIN_NAME;
}

/**
 * "Users" have no table server-side — the list is the union of every place a
 * name can appear: who's online, tierlist submitters, wheel pick authors and
 * the pickers of past films.
 */
export function knownUsers(sources: {
  presence: Presence[];
  submissions: TierlistState["submissions"];
  options: Option[];
  history: HistoryEntry[];
}): string[] {
  return [
    ...new Set([
      ...sources.presence.map((p) => p.name),
      ...Object.keys(sources.submissions),
      ...sources.options.map((o) => o.author),
      ...sources.history.map((h) => h.author).filter((a): a is string => !!a),
    ]),
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
