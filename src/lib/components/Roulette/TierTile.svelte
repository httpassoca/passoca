<script lang="ts">
  import MediaPoster from "./MediaPoster.svelte";
  import type { TierItem } from "$lib/roulette";

  let { item }: { item: TierItem } = $props();
</script>

<div class="tile" title={item.title}>
  {#if item.poster_path}
    <MediaPoster path={item.poster_path} size="w92" alt={item.title} />
  {:else}
    <span class="name">{item.title}</span>
  {/if}
</div>

<style lang="sass">
.tile
  width: 46px
  height: 62px
  flex: none
  display: flex
  align-items: flex-end
  padding: 3px
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  overflow: hidden
  // The tile owns the frame; the poster fills it edge to edge. (Compound
  // selector so this outweighs MediaPoster's own .poster.w92 width.)
  :global(.poster.w92)
    width: 46px
    height: 62px
    margin: -3px
    border: none

.name
  font-size: 8.5px
  line-height: 1.25
  color: var(--ss-fg-muted)
  overflow: hidden
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 3
  word-break: break-word
</style>
