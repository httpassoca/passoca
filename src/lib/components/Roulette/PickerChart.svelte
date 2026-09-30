<script lang="ts">
  import { BoxPlot, Card, EmptyState } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import {
    TIERS,
    colorForName,
    generalTiers,
    keyForHistory,
    type HistoryEntry,
    type TierlistState,
  } from "$lib/roulette";

  let {
    history,
    general,
  }: {
    history: HistoryEntry[];
    /** The published general tierlist — it carries tiers only, no score. */
    general: TierlistState["general"];
  } = $props();

  const HEIGHT = 236;
  /** Rough width of one axis-label character (mono, `--ss-ui-xs`), px. */
  const CHAR_W = 7;

  // The general list has no number, so a tier is its rank: D = 1 … S = 5.
  const TOP = TIERS.length;
  function tierAt(score: number): string {
    return TIERS[TOP - score] ?? "";
  }
  // Quartiles can land between two tiers — name both, better one first.
  function fmtScore(score: number): string {
    if (Number.isInteger(score)) return tierAt(score);
    return `${tierAt(Math.ceil(score))}/${tierAt(Math.floor(score))}`;
  }

  // One box per picker, over the tiers of the films they picked. Films with no
  // picker, or not in the general list yet, have nothing to contribute; a
  // rewatch counts once per picker.
  const pickers = $derived.by(() => {
    const tiers = generalTiers(general);
    const scores = new Map<string, Map<string, number>>();
    for (const entry of history) {
      const key = keyForHistory(entry);
      const tier = tiers.get(key);
      if (!entry.author || !tier) continue;
      const films = scores.get(entry.author) ?? new Map<string, number>();
      films.set(key, TOP - TIERS.indexOf(tier));
      scores.set(entry.author, films);
    }
    return [...scores]
      .map(([name, films]) => {
        const values = [...films.values()];
        return { name, values, mean: values.reduce((a, b) => a + b, 0) / values.length };
      })
      .sort((a, b) => b.mean - a.mean || a.name.localeCompare(b.name));
  });

  let width = $state(0);

  const groups = $derived.by(() => {
    // BoxPlot can't wrap or rotate its band labels: clip long names to the
    // band (unless that would make two pickers share a label).
    const room = Math.max(3, Math.floor((width - 64) / Math.max(1, pickers.length) / CHAR_W) - 1);
    const clipped = pickers.map((p) =>
      p.name.length > room ? `${p.name.slice(0, room - 1)}…` : p.name
    );
    const labels = new Set(clipped).size === pickers.length ? clipped : pickers.map((p) => p.name);
    return pickers.map((p, i) => ({
      label: labels[i],
      values: p.values,
      color: colorForName(p.name),
    }));
  });

  const summary = $derived(
    `${m.roulette_pickers_title()} — ${pickers.map((p) => `${p.name}: ${fmtScore(Math.round(p.mean))}`).join(", ")}`
  );
</script>

<Card title={m.roulette_pickers_title()} meta={m.roulette_pickers_desc()}>
  {#if pickers.length === 0}
    <EmptyState
      title={m.roulette_pickers_empty()}
      message={m.roulette_pickers_empty_msg()}
      compact
    />
  {:else}
    <!-- Measured, not `fluid`: a scaled viewBox would shrink the labels. -->
    <div class="plot" style:min-height="{HEIGHT}px" bind:clientWidth={width}>
      {#if width > 0}
        <BoxPlot
          {groups}
          {width}
          height={HEIGHT}
          yDomain={[0.5, TOP + 0.5]}
          yFormat={fmtScore}
          {summary}
        />
      {/if}
    </div>
  {/if}
</Card>

<style lang="sass">
.plot
  min-width: 0
</style>
