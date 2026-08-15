import { CHART_PALETTE } from "dssoca";

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
