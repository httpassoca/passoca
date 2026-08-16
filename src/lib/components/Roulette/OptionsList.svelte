<script lang="ts">
  import { Button } from "dssoca";
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

  function hasMedia(option: Option): boolean {
    return Boolean(option.tmdb_id && option.media_type);
  }

  function openDetails(option: Option) {
    if (!hasMedia(option)) return;
    ondetails({ media_type: option.media_type!, tmdb_id: option.tmdb_id! });
  }

  function rowKeydown(e: KeyboardEvent, option: Option) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetails(option);
    }
  }
</script>

<ul class="options">
  {#each options as option (option.id)}
    {@const clickable = hasMedia(option)}
    <li class="pick" class:clickable>
      <!-- svelte-ignore a11y_no_static_element_interactions, a11y_no_noninteractive_tabindex
           (role/tabindex/handlers are all applied together when the row has media) -->
      <div
        class="row"
        role={clickable ? "button" : undefined}
        tabindex={clickable ? 0 : undefined}
        aria-label={clickable ? `${m.roulette_media_details()}: ${option.text}` : undefined}
        onclick={clickable ? () => openDetails(option) : undefined}
        onkeydown={clickable ? (e) => rowKeydown(e, option) : undefined}
      >
        <MediaPoster path={option.poster_path} size="w92" alt="" />
        <div class="info">
          <div class="t" class:mine={option.author === me}>{option.text}</div>
          <div class="sub">
            {#if option.media_year}{option.media_year} · {/if}{option.author}
          </div>
        </div>
      </div>
      {#if option.author === me || admin}
        <Button
          variant="ghost"
          size="md"
          iconOnly
          label={m.roulette_remove_option({ text: option.text })}
          onclick={(e) => {
            e.stopPropagation();
            onremove(option.id);
          }}>✕</Button
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
  // Fills the card the parent sizes (which ends at the history strip) and
  // scrolls inside it; on narrow screens the card is auto-height, so cap it.
  flex: 1
  min-height: 96px
  max-height: 60vh
  overflow: auto
  // Row thumbs — mock uses 26×38.
  :global(.poster)
    width: 26px

.pick
  display: flex
  align-items: center
  gap: 8px
  padding: 5px 6px
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-elev)
  transition: all 0.15s var(--ss-ease)
  &.clickable:hover
    border-color: var(--ss-line-strong)
    background: var(--ss-bg-elev-hover)

.row
  flex: 1
  min-width: 0
  display: flex
  align-items: center
  gap: 8px
  .clickable &
    cursor: pointer
  &:focus-visible
    outline: 2px solid var(--ss-accent)
    outline-offset: 1px

.info
  flex: 1
  min-width: 0

.t
  font-size: 11.5px
  color: var(--ss-fg)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  &.mine
    color: var(--ss-accent)

.sub
  font-size: 10px
  color: var(--ss-fg-faint)
</style>
