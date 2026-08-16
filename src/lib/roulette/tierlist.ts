import type { TierItem, TierName, TierPlacement, TierlistState } from "./types";

export const TIERS: TierName[] = ["S", "A", "B", "C", "D"];

/** Tier accent per the mockup, mapped onto dssoca tokens. */
export const TIER_COLORS: Record<TierName, string> = {
  S: "var(--ss-accent)",
  A: "var(--ss-cyan)",
  B: "var(--ss-yellow)",
  C: "var(--ss-fg-muted)",
  D: "var(--ss-red)",
};

/** A tier item shaped for svelte-dnd-action, which requires an `id`. */
export type DndTierItem = TierItem & { id: string };

export type TierZones = Record<TierName | "unranked", DndTierItem[]>;

export const EMPTY_ZONES: TierZones = { S: [], A: [], B: [], C: [], D: [], unranked: [] };

/** Splits the snapshot into this user's tier zones + the unranked tray. */
export function buildZones(state: TierlistState, name: string): TierZones {
  const byKey = new Map(state.items.map((i) => [i.key, i]));
  const zones: TierZones = { S: [], A: [], B: [], C: [], D: [], unranked: [] };

  const mine = (state.submissions[name] ?? [])
    .filter((p) => byKey.has(p.key))
    .sort((a, b) => a.position - b.position);
  const placed = new Set<string>();
  for (const p of mine) {
    zones[p.tier].push({ ...byKey.get(p.key)!, id: p.key });
    placed.add(p.key);
  }
  for (const item of state.items) {
    if (!placed.has(item.key)) zones.unranked.push({ ...item, id: item.key });
  }
  return zones;
}

/** Flattens the five tier zones back into the wire format (unranked = absent). */
export function placementsFromZones(zones: TierZones): TierPlacement[] {
  const placements: TierPlacement[] = [];
  for (const tier of TIERS) {
    zones[tier].forEach((item, position) => placements.push({ key: item.key, tier, position }));
  }
  return placements;
}

/** Tooltip line for the general list: "ana S · rafa A" — only users who ranked it. */
export function tooltipFor(key: string, submissions: TierlistState["submissions"]): string {
  return Object.keys(submissions)
    .sort()
    .flatMap((name) => {
      const placement = submissions[name].find((p) => p.key === key);
      return placement ? [`${name} ${placement.tier}`] : [];
    })
    .join(" · ");
}
