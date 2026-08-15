<script lang="ts">
  import { tmdbImg, type PosterSize } from "$lib/roulette";

  let {
    path,
    size = "w342",
    alt = "",
  }: {
    path: string | null;
    size?: PosterSize;
    alt?: string;
  } = $props();
</script>

{#if path}
  <img class="poster {size}" src={tmdbImg(path, size)} {alt} loading="lazy" />
{:else}
  <span class="poster placeholder {size}" role="img" aria-label={alt}>🎬</span>
{/if}

<style lang="sass">
.poster
  display: block
  flex-shrink: 0
  aspect-ratio: 2 / 3
  object-fit: cover
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  &.w92
    width: 30px
  &.w342
    width: min(150px, 32vw)

.placeholder
  display: flex
  align-items: center
  justify-content: center
  font-size: 13px
  &.w342
    font-size: 40px
</style>
