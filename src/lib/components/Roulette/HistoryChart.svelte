<script lang="ts">
  import { Card, EmptyState, Tooltip } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import {
    TIERS,
    TIER_COLORS,
    generalTiers,
    keyForHistory,
    tmdbImg,
    type HistoryEntry,
    type MediaKey,
    type TierName,
    type TierlistState,
  } from "$lib/roulette";

  let {
    history,
    general,
    ondetails,
  }: {
    history: HistoryEntry[];
    /** The published general tierlist — it carries tiers only, no score. */
    general: TierlistState["general"];
    ondetails: (media: MediaKey) => void;
  } = $props();

  const DAY = 86_400_000;
  /** Height of one tier band, px. */
  const BAND = 36;
  /** Vertical step between films sharing a tier and a day, px. */
  const LANE = 11;

  type Tick = { x: number; label: string };

  function startOfDay(time: number): number {
    const d = new Date(time);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }
  // Calendar arithmetic (not `+ n * DAY`) so DST days don't drift the ticks.
  function addDays(time: number, days: number): number {
    const d = new Date(time);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days).getTime();
  }
  function fmtDate(time: number): string {
    return new Date(time).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // A film needs both axes: a known date (`drawn_at === ""` is an imported
  // roulette with no date) and a tier in the general list.
  const plotted = $derived.by(() => {
    const tiers = generalTiers(general);
    return history
      .flatMap((entry) => {
        const tier = tiers.get(keyForHistory(entry));
        const time = entry.drawn_at ? new Date(entry.drawn_at).getTime() : NaN;
        return tier && Number.isFinite(time) ? [{ entry, tier, time }] : [];
      })
      .sort((a, b) => a.time - b.time);
  });
  const skipped = $derived(history.length - plotted.length);

  // Whole days, so ticks (midnights) land inside the domain; a short history
  // is widened to a week so a lone film doesn't sit on the axis edge.
  const domain = $derived.by((): [number, number] => {
    if (plotted.length === 0) return [0, 1];
    let start = startOfDay(plotted[0].time);
    let end = addDays(plotted[plotted.length - 1].time, 1);
    if (end - start < 7 * DAY) {
      start = addDays(start, -3);
      end = addDays(end, 3);
    }
    return [start, end];
  });

  function xOf(time: number): number {
    return ((time - domain[0]) / (domain[1] - domain[0])) * 100;
  }

  const points = $derived.by(() => {
    // Films watched the same day in the same tier would overlap exactly —
    // fan them out vertically inside the band.
    const groups = new Map<string, number[]>();
    plotted.forEach((p, i) => {
      const id = `${p.tier}|${startOfDay(p.time)}`;
      groups.set(id, [...(groups.get(id) ?? []), i]);
    });
    const offsets = new Array<number>(plotted.length).fill(0);
    for (const members of groups.values()) {
      const step = Math.min(LANE, (BAND - 10) / Math.max(1, members.length - 1));
      members.forEach((i, lane) => (offsets[i] = (lane - (members.length - 1) / 2) * step));
    }
    return plotted.map((p, i) => ({
      ...p,
      x: xOf(p.time),
      y: (TIERS.indexOf(p.tier) + 0.5) * BAND + offsets[i],
    }));
  });

  let plotW = $state(0);
  const maxTicks = $derived(Math.max(2, Math.floor(plotW / 84)));

  // Month boundaries for a long history, days for a short one; the step grows
  // until the labels fit the measured width.
  const ticks = $derived.by((): Tick[] => {
    if (plotted.length === 0) return [];
    const [start, end] = domain;
    const days = Math.round((end - start) / DAY);

    if (days <= 45) {
      const step = [1, 2, 7, 14].find((s) => days / s + 1 <= maxTicks) ?? 28;
      const out: Tick[] = [];
      for (let i = 0; i <= days; i += step) {
        const time = addDays(start, i);
        out.push({
          x: xOf(time),
          label: new Date(time).toLocaleDateString(undefined, { day: "numeric", month: "short" }),
        });
      }
      return out;
    }

    const s = new Date(start);
    const e = new Date(end);
    const first = s.getFullYear() * 12 + s.getMonth();
    const last = e.getFullYear() * 12 + e.getMonth();
    const step = [1, 2, 3, 6, 12, 24, 60].find((st) => (last - first) / st + 1 <= maxTicks) ?? 120;
    const out: Tick[] = [];
    for (let month = Math.ceil(first / step) * step; month <= last; month += step) {
      const date = new Date(Math.floor(month / 12), month % 12, 1);
      if (date.getTime() < start || date.getTime() > end) continue;
      // The year rides on the first tick and on every January.
      const withYear = out.length === 0 || date.getMonth() === 0;
      out.push({
        x: xOf(date.getTime()),
        label:
          step >= 12
            ? String(date.getFullYear())
            : date.toLocaleDateString(undefined, {
                month: "short",
                year: withYear ? "numeric" : undefined,
              }),
      });
    }
    return out;
  });
</script>

{#if history.length > 0}
  <Card title={m.roulette_chart_title()} meta={m.roulette_chart_desc()}>
    {#if points.length === 0}
      <EmptyState title={m.roulette_chart_empty()} message={m.roulette_chart_empty_msg()} />
    {:else}
      <div class="chart" role="group" aria-label={m.roulette_chart_title()}>
        <div class="y" aria-hidden="true">
          {#each TIERS as tier (tier)}
            <span class="y-tick" style:height="{BAND}px">{tier}</span>
          {/each}
        </div>

        <div class="plot" style:height="{BAND * TIERS.length}px" bind:clientWidth={plotW}>
          {#each TIERS as tier (tier)}
            <div class="band" style:height="{BAND}px"></div>
          {/each}
          <!-- Inset from the plot edges so the first/last film and their date
               labels never hang over the axis. -->
          <div class="field">
            {#each ticks as tick (tick.x)}
              <span class="v-line" style:left="{tick.x}%"></span>
            {/each}
            {#each points as p (p.entry.id)}
              {@const entry = p.entry}
              {@const label = `${entry.title} · ${m.roulette_chart_tier({ tier: p.tier })} · ${fmtDate(p.time)}`}
              <!-- Declared in the loop so it closes over this film; Tooltip
                   renders it as the tip's content (phrasing content only). -->
              {#snippet tip()}
                {#if entry.poster_path}
                  <img
                    class="tip-poster"
                    src={tmdbImg(entry.poster_path, "w342")}
                    alt=""
                    loading="lazy"
                  />
                {/if}
                <strong class="tip-title">{entry.title}</strong>
                {#if entry.media_year}<span class="tip-year">({entry.media_year})</span>{/if}
                <br />
                <span class="tip-key" style:--tier-color={TIER_COLORS[p.tier]}></span>
                <span class="tip-meta">
                  {m.roulette_chart_tier({ tier: p.tier })} · {fmtDate(p.time)}
                </span>
              {/snippet}
              <span
                class="pt"
                style:left="{p.x}%"
                style:top="{p.y}px"
                style:--tier-color={TIER_COLORS[p.tier]}
              >
                <Tooltip text={tip}>
                  {#if entry.tmdb_id && entry.media_type}
                    <button
                      type="button"
                      class="hit clickable"
                      aria-label={label}
                      onclick={() =>
                        ondetails({ media_type: entry.media_type!, tmdb_id: entry.tmdb_id! })}
                    >
                      <span class="dot"></span>
                    </button>
                  {:else}
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex
                         (focusable so the tooltip is reachable by keyboard; a
                         free-text film has no details to open) -->
                    <span class="hit" role="img" tabindex="0" aria-label={label}>
                      <span class="dot"></span>
                    </span>
                  {/if}
                </Tooltip>
              </span>
            {/each}
          </div>
        </div>

        <div class="x" aria-hidden="true">
          {#each ticks as tick (tick.x)}
            <span class="x-tick" style:left="{tick.x}%">{tick.label}</span>
          {/each}
        </div>
      </div>
    {/if}
    {#if skipped > 0 && points.length > 0}
      <p class="note">{m.roulette_chart_skipped({ count: skipped })}</p>
    {/if}
  </Card>
{/if}

<style lang="sass">
// Horizontal room kept free on both sides of the plotted field.
$inset: 28px

.chart
  display: grid
  grid-template-columns: auto 1fr
  column-gap: 8px

.y
  display: flex
  flex-direction: column

.y-tick
  display: flex
  align-items: center
  justify-content: flex-end
  min-width: 14px
  font-family: var(--ss-font-mono)
  font-size: var(--ss-ui-xs, 11px)
  color: var(--ss-fg-muted)

.plot
  position: relative
  min-width: 0
  border-left: 1px solid var(--ss-line)
  border-bottom: 1px solid var(--ss-line)

// One band per tier; the hairline between them is the only grid.
.band
  border-top: 1px solid color-mix(in srgb, var(--ss-line) 50%, transparent)

.field
  position: absolute
  inset: 0 $inset

.v-line
  position: absolute
  top: 0
  bottom: 0
  width: 1px
  background: color-mix(in srgb, var(--ss-line) 50%, transparent)

.pt
  position: absolute
  transform: translate(-50%, -50%)
  line-height: 0
  // The tip is capped to roughly a poster's width.
  --ss-tooltip-max-w: 158px
  // Lift the hovered film (and its tip) over its neighbours.
  &:hover, &:focus-within
    z-index: 2

// The hit target is much bigger than the mark — a 10px dot is a pinpoint.
.hit
  display: flex
  align-items: center
  justify-content: center
  width: 24px
  height: 24px
  padding: 0
  border: none
  background: none
  appearance: none
  &:focus-visible
    outline: 2px solid var(--ss-accent)
    outline-offset: -2px

.clickable
  cursor: pointer

.dot
  width: 10px
  height: 10px
  border-radius: 50%
  background: var(--tier-color)
  // Surface-colored ring: overlapping films stay separate marks.
  box-shadow: 0 0 0 2px var(--ss-bg-elev)
  transition: transform var(--ss-dur-fast, 150ms) var(--ss-ease)
  .hit:hover &, .hit:focus-visible &
    transform: scale(1.4)
  @media (prefers-reduced-motion: reduce)
    transition: none

.x
  grid-column: 2
  position: relative
  height: 20px
  margin: 0 $inset

.x-tick
  position: absolute
  top: 6px
  transform: translateX(-50%)
  white-space: nowrap
  font-family: var(--ss-font-mono)
  font-size: var(--ss-ui-xs, 11px)
  line-height: 1
  color: var(--ss-fg-muted)
  font-variant-numeric: tabular-nums

.note
  margin: 10px 0 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  color: var(--ss-fg-faint)

// Tooltip body: the cover, then the film and where/when it landed.
.tip-poster
  display: block
  width: 140px
  max-width: 100%
  aspect-ratio: 2 / 3
  object-fit: cover
  margin-bottom: 6px
  background: var(--ss-bg-inset)

.tip-title
  color: var(--ss-fg)

.tip-year
  color: var(--ss-fg-faint)
  margin-left: 4px

.tip-key
  display: inline-block
  width: 7px
  height: 7px
  border-radius: 50%
  margin-right: 4px
  background: var(--tier-color)

.tip-meta
  color: var(--ss-fg-muted)
</style>
