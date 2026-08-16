<script lang="ts">
  import { onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from "svelte-dnd-action";
  import { Button, Card, EmptyState, toast } from "dssoca";
  import { goto } from "$app/navigation";
  import { m } from "$lib/paraglide/messages";
  import TierRow from "./TierRow.svelte";
  import TierTile from "./TierTile.svelte";
  import {
    TIERS,
    buildZones,
    placementsFromZones,
    type DndTierItem,
    type MediaKey,
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
    ondetails,
  }: {
    client: RouletteClient | null;
    state: TierlistState;
    name: string;
    ondetails: (media: MediaKey) => void;
  } = $props();

  const FLIP_MS = 150;
  const SAVE_DEBOUNCE_MS = 600;

  let zones = $state<TierZones>({ S: [], A: [], B: [], C: [], D: [], unranked: [] });
  let dragging = $state(false);
  let lastFinalize = 0;
  // Local edits not yet saved (or not yet confirmed by a server echo); while
  // set, incoming snapshots must not rebuild the zones or they'd revert them.
  let dirty = $state(false);
  // Autosave: every drop persists the personal list. The general tierlist
  // stays put until someone hits publish, so a save is never a group edit.
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let status = $state<"idle" | "saving" | "saved">("idle");

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
      // (the echo of our own save); anything earlier would drop unsaved drags.
      const mine = tierState.submissions[name] ?? [];
      if (canonical(placementsFromZones(zones)) !== canonical(mine)) return;
      dirty = false;
      status = "saved";
    }
    if (JSON.stringify(next) !== JSON.stringify($state.snapshot(zones))) zones = next;
  });

  /** Sends the pending edit now (also used before publishing and on unmount). */
  function flushSave() {
    clearTimeout(saveTimer);
    saveTimer = undefined;
    if (!dirty || !client) return;
    client.setTierlist(placementsFromZones(zones));
  }

  function queueSave() {
    clearTimeout(saveTimer);
    status = "saving";
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }

  // Publishing is the only thing that moves the group's list — flush first so
  // the aggregate is computed from the drag that just happened.
  function publish() {
    flushSave();
    client?.publishTierlist();
    toast.success(m.roulette_tierlist_published());
  }

  onDestroy(() => flushSave());

  function handleConsider(zone: TierName | "unranked", e: CustomEvent<DndEvent<DndTierItem>>) {
    dragging = true;
    zones[zone] = e.detail.items;
  }

  function handleFinalize(zone: TierName | "unranked", e: CustomEvent<DndEvent<DndTierItem>>) {
    zones[zone] = e.detail.items;
    dragging = false;
    dirty = true;
    lastFinalize = Date.now();
    queueSave();
  }

  // A drop shouldn't double as a click on the tile it landed on.
  function openDetails(item: DndTierItem) {
    if (dragging || Date.now() - lastFinalize < 250) return;
    if (item.media_type && item.tmdb_id) {
      ondetails({ media_type: item.media_type, tmdb_id: item.tmdb_id });
    }
  }

  function isShadow(item: DndTierItem): boolean {
    return Boolean((item as Record<string, unknown>)[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
  }
</script>

{#snippet tiles(zone: TierName | "unranked")}
  {#each zones[zone] as item (item.id)}
    <div animate:flip={{ duration: FLIP_MS }} class="drag" class:shadow={isShadow(item)}>
      <TierTile
        {item}
        onclick={item.media_type && item.tmdb_id ? () => openDetails(item) : null}
      />
    </div>
  {/each}
{/snippet}

<Card
  title={m.roulette_tierlist_personal({ name: name || "?" })}
  meta={m.roulette_tierlist_personal_desc()}
>
  {#snippet action()}
    {#if name && client}
      <span class="status">
        {#if status === "saving"}
          {m.roulette_tierlist_saving()}
        {:else if status === "saved"}
          {m.roulette_tierlist_autosaved()}
        {:else}
          {m.roulette_tierlist_autosave_hint()}
        {/if}
      </span>
      <Button variant="primary" size="md" onclick={publish}>
        {m.roulette_tierlist_publish()}
      </Button>
    {/if}
  {/snippet}
  {#if !name || !client}
    <EmptyState title={m.roulette_tierlist_join_prompt()}>
      {#snippet action()}
        <Button size="md" onclick={() => goto("/roulette")}>
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

.status
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  letter-spacing: 0.04em
  color: var(--ss-fg-faint)

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
  &.shadow
    opacity: 0.5
    :global(.tile)
      border: 1px dashed var(--ss-accent)
      visibility: visible

.unranked
  display: flex
  flex-direction: column
  gap: 6px
  border-top: 1px solid var(--ss-line)
  padding-top: 8px
  margin-top: 2px
  .lbl
    width: 100%
    font-family: var(--ss-font-mono)
    font-size: var(--ss-size-xs, 12px)
    letter-spacing: 0.04em
    color: var(--ss-fg-faint)
  .tray
    width: 100%
    min-height: 62px
    padding: 6px
    border: 1px solid var(--ss-line)
    background: var(--ss-bg-elev)
    // Hovered posters grow smoothly and lift off the tray; scale the tile
    // (not the .drag wrapper) so dnd/flip inline transforms never fight the
    // hover state.
    :global(.tile)
      transition: transform var(--ss-dur, 250ms) var(--ss-ease), box-shadow var(--ss-dur, 250ms) var(--ss-ease)
    .drag:hover
      position: relative
      z-index: 2
      :global(.tile)
        transform: scale(1.3)
        box-shadow: var(--ss-shadow-pop)
</style>
