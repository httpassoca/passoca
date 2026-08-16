<script lang="ts">
  import { EmptyState, Modal, Spinner } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import TierRow from "./TierRow.svelte";
  import TierTile from "./TierTile.svelte";
  import {
    TIERS,
    TIER_COLORS,
    ranksFor,
    type MediaKey,
    type TierlistState,
  } from "$lib/roulette";

  let {
    state: tierState,
    loading = false,
    ondetails,
    onclose,
  }: {
    state: TierlistState;
    /** Still waiting for the first server snapshot. */
    loading?: boolean;
    ondetails: (media: MediaKey) => void;
    onclose: () => void;
  } = $props();

  let open = $state(true);

  const itemsByKey = $derived(new Map(tierState.items.map((i) => [i.key, i])));
  const listCount = $derived(Object.keys(tierState.submissions).length);
</script>

<!-- Fullscreen, like the timeline: a whole tierlist wants the viewport. -->
<Modal bind:open fullscreen title={m.roulette_tierlist_general()} {onclose}>
  <p class="desc">
    {m.roulette_tierlist_general_desc()} · {m.roulette_tierlist_based_on({ count: listCount })}
  </p>

  {#if loading}
    <div class="loading">
      <Spinner label={m.roulette_media_loading()} showLabel />
    </div>
  {:else if listCount === 0}
    <EmptyState title={m.roulette_tierlist_empty()} message={m.roulette_tierlist_empty_msg()} />
  {:else}
    <div class="rows">
      {#each TIERS as tier (tier)}
        <TierRow {tier}>
          {#each tierState.general[tier] as key (key)}
            {@const item = itemsByKey.get(key)}
            {#if item}
              {@const ranks = ranksFor(key, tierState.submissions)}
              <!-- Declared in the loop so it closes over this film; Tooltip
                   renders it as the tip's content (phrasing content only). -->
              {#snippet tip()}
                <strong class="tip-title">{item.title}</strong>
                {#if item.media_year}<span class="tip-year">({item.media_year})</span>{/if}
                {#each ranks as rank (rank.name)}
                  <br />
                  <span class="tip-name">{rank.name}</span>
                  <span class="tip-tier" style:--tier-color={TIER_COLORS[rank.tier]}>
                    {rank.tier}
                  </span>
                {/each}
              {/snippet}
              <TierTile
                {item}
                tooltip={tip}
                onclick={item.media_type && item.tmdb_id
                  ? () => ondetails({ media_type: item.media_type!, tmdb_id: item.tmdb_id! })
                  : null}
              />
            {/if}
          {/each}
        </TierRow>
      {/each}
      <p class="hint">{m.roulette_tierlist_hover_hint()}</p>
    </div>
  {/if}
</Modal>

<style lang="sass">
.desc
  margin: 0 0 8px
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  letter-spacing: 0.04em
  color: var(--ss-fg-faint)

.rows
  display: flex
  flex-direction: column
  gap: 6px

.loading
  display: flex
  justify-content: center
  padding: 16px 0

.hint
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  letter-spacing: 0.04em
  color: var(--ss-fg-faint)

// Tooltip body: the film, then one line per person who ranked it.
.tip-title
  color: var(--ss-fg)

.tip-year
  color: var(--ss-fg-faint)
  margin-left: 4px

.tip-name
  color: var(--ss-fg-muted)

.tip-tier
  color: var(--tier-color)
  font-weight: 600
  margin-left: 4px
</style>
