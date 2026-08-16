<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { MediaKey, Option } from "$lib/roulette";
  import MediaPoster from "./MediaPoster.svelte";

  let {
    options,
    me,
    admin,
    onremove,
    ondetails,
  }: {
    options: Option[];
    me: string;
    admin: boolean;
    onremove: (id: string) => void;
    ondetails: (media: MediaKey) => void;
  } = $props();
</script>

<ul class="options">
  {#each options as option (option.id)}
    <li class="pick">
      <MediaPoster path={option.poster_path} size="w92" alt="" />
      <div class="info">
        <div class="t" class:mine={option.author === me}>{option.text}</div>
        <div class="sub">
          {#if option.media_year}{option.media_year} · {/if}{option.author}
          {#if option.tmdb_id && option.media_type}
            ·
            <button
              class="details"
              onclick={() =>
                ondetails({ media_type: option.media_type!, tmdb_id: option.tmdb_id! })}
            >
              {m.roulette_media_details()} ↗
            </button>
          {/if}
        </div>
      </div>
      {#if option.author === me || admin}
        <button
          class="hub-btn ghost"
          aria-label={m.roulette_remove_option({ text: option.text })}
          onclick={() => onremove(option.id)}>✕</button
        >
      {/if}
    </li>
  {/each}
</ul>

<style lang="sass">
.options
  list-style: none
  margin: 0
  padding: 0
  display: flex
  flex-direction: column
  gap: 6px
  max-height: 336px
  overflow: auto
  // Row thumbs — mock uses 26×38.
  :global(.poster)
    width: 26px

.pick
  display: flex
  align-items: center
  gap: 8px
  padding: 5px 6px
  border: 1px solid var(--hs-line)
  background: var(--hs-bg-elev)
  transition: all 0.15s var(--hs-ease)
  &:hover
    border-color: var(--hs-line-strong)
    background: var(--hs-bg-elev-hover)

.info
  flex: 1
  min-width: 0

.t
  font-size: 11.5px
  color: var(--hs-fg)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  &.mine
    color: var(--hs-primary)

.sub
  font-size: 10px
  color: var(--hs-fg-faint)

.details
  background: none
  border: none
  padding: 0
  font: inherit
  color: var(--hs-fg-faint)
  cursor: pointer
  &:hover
    color: var(--hs-primary)
</style>
