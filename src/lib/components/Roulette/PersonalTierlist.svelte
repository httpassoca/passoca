<script lang="ts">
  import { onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from "svelte-dnd-action";
  import { Button, Card, EmptyState } from "dssoca";
  import { goto } from "$app/navigation";
  import { m } from "$lib/paraglide/messages";
  import TierRow from "./TierRow.svelte";
  import TierTile from "./TierTile.svelte";
  import {
    TIERS,
    buildZones,
    placementsFromZones,
    type DndTierItem,
    type RouletteClient,
    type TierName,
    type TierPlacement,
    type TierZones,
    type TierlistState,
  } from "$lib/roulette";

  let {
    client,
    state: tierState,
    name,
  }: {
    client: RouletteClient | null;
    state: TierlistState;
    name: string;
  } = $props();

  const FLIP_MS = 150;
  const SAVE_DEBOUNCE_MS = 400;

  let zones = $state<TierZones>({ S: [], A: [], B: [], C: [], D: [], unranked: [] });
  let dragging = $state(false);
  // Local edits not yet confirmed by a server echo; while set, incoming
  // snapshots must not rebuild the zones or they'd revert the user's drag.
  let dirty = $state(false);
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function canonical(placements: TierPlacement[]): string {
    const order = (t: TierName) => TIERS.indexOf(t);
    return JSON.stringify(
      [...placements].sort((a, b) => order(a.tier) - order(b.tier) || a.position - b.position)
    );
  }

  $effect(() => {
    const next = buildZones(tierState, name);
    if (dragging) return;
    if (dirty) {
      // Only accept the snapshot once it reflects our latest local placements
      // (the echo of our own save); anything earlier is stale.
      const mine = tierState.submissions[name] ?? [];
      if (canonical(placementsFromZones(zones)) !== canonical(mine)) return;
      dirty = false;
    }
    if (JSON.stringify(next) !== JSON.stringify($state.snapshot(zones))) zones = next;
  });

  function queueSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }

  function flushSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = null;
    client?.setTierlist(placementsFromZones(zones));
  }

  function handleConsider(zone: TierName | "unranked", e: CustomEvent<DndEvent<DndTierItem>>) {
    dragging = true;
    zones[zone] = e.detail.items;
  }

  function handleFinalize(zone: TierName | "unranked", e: CustomEvent<DndEvent<DndTierItem>>) {
    zones[zone] = e.detail.items;
    dragging = false;
    dirty = true;
    queueSave();
  }

  function isShadow(item: DndTierItem): boolean {
    return Boolean((item as Record<string, unknown>)[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
  }

  onDestroy(() => {
    // Don't lose a drag that happened within the debounce window.
    if (saveTimer) flushSave();
  });
</script>

{#snippet tiles(zone: TierName | "unranked")}
  {#each zones[zone] as item (item.id)}
    <div animate:flip={{ duration: FLIP_MS }} class="drag" class:shadow={isShadow(item)}>
      <TierTile {item} />
    </div>
  {/each}
{/snippet}

<Card
  title={m.roulette_tierlist_personal({ name: name || "?" })}
  meta={m.roulette_tierlist_personal_desc()}
>
  {#if !name || !client}
    <EmptyState title={m.roulette_tierlist_join_prompt()}>
      {#snippet action()}
        <Button size="sm" onclick={() => goto("/roulette")}>
          {m.roulette_tierlist_join_cta()}
        </Button>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="rows">
      {#each TIERS as tier (tier)}
        <TierRow {tier}>
          <div
            class="zone"
            use:dndzone={{
              items: zones[tier],
              flipDurationMs: FLIP_MS,
              type: "tierlist",
              dropTargetStyle: {},
              dropTargetClasses: ["drop-active"],
            }}
            onconsider={(e) => handleConsider(tier, e)}
            onfinalize={(e) => handleFinalize(tier, e)}
          >
            {@render tiles(tier)}
          </div>
        </TierRow>
      {/each}

      <div class="unranked">
        <span class="lbl">{m.roulette_tierlist_unranked()}</span>
        <div
          class="zone tray"
          use:dndzone={{
            items: zones.unranked,
            flipDurationMs: FLIP_MS,
            type: "tierlist",
            dropTargetStyle: {},
            dropTargetClasses: ["drop-active"],
          }}
          onconsider={(e) => handleConsider("unranked", e)}
          onfinalize={(e) => handleFinalize("unranked", e)}
        >
          {@render tiles("unranked")}
        </div>
      </div>
    </div>
  {/if}
</Card>

<style lang="sass">
.rows
  display: flex
  flex-direction: column
  gap: 6px

// The dnd zone fills the whole strip so empty tiers stay droppable.
.zone
  flex: 1
  align-self: stretch
  min-height: 62px
  display: flex
  flex-wrap: wrap
  gap: 6px
  align-items: center
  &:global(.drop-active)
    outline: 1px dashed var(--ss-accent)
    outline-offset: 2px

.drag
  cursor: grab
  &:hover :global(.tile)
    border-color: var(--ss-accent)
  &.shadow
    opacity: 0.5
    :global(.tile)
      border: 1px dashed var(--ss-accent)
      visibility: visible

.unranked
  display: flex
  align-items: flex-start
  gap: 8px
  border-top: 1px solid var(--ss-line)
  padding-top: 8px
  margin-top: 2px
  .lbl
    flex: none
    padding-top: 4px
    font-family: var(--ss-font-mono)
    font-size: var(--ss-size-xs, 12px)
    letter-spacing: 0.04em
    color: var(--ss-fg-faint)
  .tray
    min-height: 62px
</style>
