<script lang="ts">
  import { Card, EmptyState } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import TierRow from "./TierRow.svelte";
  import TierTile from "./TierTile.svelte";
  import { TIERS, tooltipFor, type MediaKey, type TierlistState } from "$lib/roulette";

  let {
    state: tierState,
    ondetails,
  }: {
    state: TierlistState;
    ondetails: (media: MediaKey) => void;
  } = $props();

  const itemsByKey = $derived(new Map(tierState.items.map((i) => [i.key, i])));
  const listCount = $derived(Object.keys(tierState.submissions).length);
</script>

<Card
  title={m.roulette_tierlist_general()}
  meta="{m.roulette_tierlist_general_desc()} · {m.roulette_tierlist_based_on({ count: listCount })}"
>
  {#if listCount === 0}
    <EmptyState
      title={m.roulette_tierlist_empty()}
      message={m.roulette_tierlist_empty_msg()}
    />
  {:else}
    <div class="rows">
      {#each TIERS as tier (tier)}
        <TierRow {tier}>
          {#each tierState.general[tier] as key (key)}
            {@const item = itemsByKey.get(key)}
            {#if item}
              <TierTile
                {item}
                tooltip="{item.title} · {tooltipFor(key, tierState.submissions)}"
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
</Card>

<style lang="sass">
.rows
  display: flex
  flex-direction: column
  gap: 6px

.hint
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  letter-spacing: 0.04em
  color: var(--ss-fg-faint)
</style>
