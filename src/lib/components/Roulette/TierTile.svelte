<script lang="ts">
  import { Tooltip } from "dssoca";
  import MediaPoster from "./MediaPoster.svelte";
  import type { TierItem } from "$lib/roulette";

  let {
    item,
    tooltip,
    onclick = null,
  }: {
    item: TierItem;
    /** Tooltip text; defaults to the film title. */
    tooltip?: string;
    /** When set, the tile is a button (opens the details modal). */
    onclick?: (() => void) | null;
  } = $props();
</script>

{#snippet inner()}
  {#if item.poster_path}
    <MediaPoster path={item.poster_path} size="w342" alt={item.title} />
  {:else}
    <span class="name">{item.title}</span>
  {/if}
{/snippet}

<Tooltip text={tooltip ?? item.title}>
  {#if onclick}
    <div
      class="tile clickable"
      role="button"
      tabindex="0"
      {onclick}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onclick?.();
        }
      }}
    >
      {@render inner()}
    </div>
  {:else}
    <div class="tile">{@render inner()}</div>
  {/if}
</Tooltip>

<style lang="sass">
.tile
  width: 108px
  aspect-ratio: 2 / 3
  flex: none
  display: flex
  align-items: flex-end
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  overflow: hidden
  &:hover
    border-color: var(--ss-line-strong)
  // The tile owns the frame; the poster fills it edge to edge. (Compound
  // selector so this outweighs MediaPoster's own .poster.w342 width.)
  :global(.poster.w342)
    width: 100%
    height: 100%
    border: none

.clickable
  cursor: pointer
  &:hover
    border-color: var(--ss-accent)
  &:focus-visible
    outline: 2px solid var(--ss-accent)
    outline-offset: 2px

.name
  padding: 4px
  font-size: 11px
  line-height: 1.25
  color: var(--ss-fg-muted)
  overflow: hidden
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 5
  word-break: break-word
</style>
