<script lang="ts">
  import { Badge, Button, CHART_PALETTE } from "dssoca";
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
  {#each options as option, i (option.id)}
    <li>
      <span
        class="swatch"
        style:background={CHART_PALETTE[i % CHART_PALETTE.length]}
      ></span>
      {#if option.tmdb_id}
        <MediaPoster path={option.poster_path} size="w92" alt="" />
      {/if}
      <span class="text">
        {option.text}
        {#if option.media_year}<span class="year">({option.media_year})</span>{/if}
      </span>
      <Badge tone={option.author === me ? "brand" : "neutral"}>
        {option.author}
      </Badge>
      {#if option.tmdb_id && option.media_type}
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          label={m.roulette_media_details()}
          onclick={() =>
            ondetails({ media_type: option.media_type!, tmdb_id: option.tmdb_id! })}>ℹ</Button
        >
      {/if}
      {#if option.author === me || admin}
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          label={m.roulette_remove_option({ text: option.text })}
          onclick={() => onremove(option.id)}>✕</Button
        >
      {/if}
    </li>
  {/each}
</ul>

<style lang="sass">
.options
  list-style: none
  margin: var(--ss-s-4, 16px) 0 0
  padding: 0
  li
    display: flex
    align-items: center
    gap: var(--ss-gap, 10px)
    padding: var(--ss-s-2, 7px) 0
    border-bottom: 1px solid var(--ss-line)
    &:last-child
      border-bottom: none
  .text
    flex: 1
    min-width: 0
    overflow-wrap: anywhere
    font-size: var(--ss-size-body)
  .year
    color: var(--ss-fg-muted)
    font-size: var(--ss-size-sm)

.swatch
  width: 10px
  height: 10px
  flex-shrink: 0
  border: 1px solid var(--ss-line-strong)
</style>
