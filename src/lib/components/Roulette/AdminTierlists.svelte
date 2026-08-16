<script lang="ts">
  import { Accordion, Button, Card } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import TierRow from "./TierRow.svelte";
  import TierTile from "./TierTile.svelte";
  import {
    TIERS,
    buildZones,
    type MediaKey,
    type RouletteClient,
    type TierlistState,
  } from "$lib/roulette";

  let {
    client,
    state: tierState,
    ondetails,
  }: {
    client: RouletteClient | null;
    state: TierlistState;
    ondetails: (media: MediaKey) => void;
  } = $props();

  const items = $derived(
    Object.keys(tierState.submissions)
      .sort()
      .map((name) => ({
        id: name,
        label: name,
        hint: m.roulette_tierlist_ranked_count({ count: tierState.submissions[name].length }),
      }))
  );
</script>

{#if items.length > 0}
  <Card title={m.roulette_tierlist_all()} meta={m.roulette_tierlist_all_desc()}>
    <Accordion {items} multiple>
      {#snippet panel(item)}
        {@const zones = buildZones(tierState, item.id)}
        <div class="rows">
          {#each TIERS as tier (tier)}
            <TierRow {tier}>
              {#each zones[tier] as zoneItem (zoneItem.id)}
                <TierTile
                  item={zoneItem}
                  onclick={zoneItem.media_type && zoneItem.tmdb_id
                    ? () =>
                        ondetails({ media_type: zoneItem.media_type!, tmdb_id: zoneItem.tmdb_id! })
                    : null}
                />
              {/each}
            </TierRow>
          {/each}
          <div class="actions">
            <Button
              variant="danger"
              size="sm"
              onclick={() => client?.removeTierlist(item.id)}
            >
              {m.roulette_tierlist_delete({ name: item.id })}
            </Button>
          </div>
        </div>
      {/snippet}
    </Accordion>
  </Card>
{/if}

<style lang="sass">
.rows
  display: flex
  flex-direction: column
  gap: 6px

.actions
  display: flex
  justify-content: flex-end
</style>
