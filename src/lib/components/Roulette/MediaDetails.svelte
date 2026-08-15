<script lang="ts">
  import { Badge, Button } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import { fetchMediaDetails } from "$lib/roulette";
  import type { MediaDetailsData, MediaType } from "$lib/roulette";
  import MediaPoster from "./MediaPoster.svelte";

  let {
    apiUrl,
    mediaType,
    tmdbId,
    onclose,
  }: {
    apiUrl: string;
    mediaType: MediaType;
    tmdbId: number;
    onclose: () => void;
  } = $props();

  let details = $state<MediaDetailsData | null>(null);
  let failed = $state(false);

  $effect(() => {
    details = null;
    failed = false;
    let cancelled = false;
    fetchMediaDetails(apiUrl, mediaType, tmdbId)
      .then((d) => {
        if (!cancelled) details = d;
      })
      .catch(() => {
        if (!cancelled) failed = true;
      });
    return () => {
      cancelled = true;
    };
  });
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") onclose();
  }}
/>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
     (backdrop click is a pointer shortcut; keyboard users have Escape and the Close button) -->
<div
  class="overlay"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
  onclick={(e) => {
    if (e.target === e.currentTarget) onclose();
  }}
>
  <div class="panel">
    {#if details}
      <div class="body">
        <MediaPoster
          path={details.poster_path}
          size="w342"
          alt={m.roulette_media_poster_alt({ title: details.title })}
        />
        <div class="text">
          <h2 class="title">
            {details.title}
            {#if details.year}<span class="year">({details.year})</span>{/if}
          </h2>
          {#if details.original_title && details.original_title !== details.title}
            <p class="orig">{details.original_title}</p>
          {/if}
          <div class="facts">
            <Badge tone="brand">
              {details.media_type === "movie" ? m.roulette_media_movie() : m.roulette_media_tv()}
            </Badge>
            {#if details.vote_average}
              <Badge tone="neutral">★ {details.vote_average.toFixed(1)}</Badge>
            {/if}
            {#if details.runtime}
              <Badge tone="neutral">{m.roulette_media_runtime({ min: details.runtime })}</Badge>
            {/if}
            {#if details.seasons}
              <Badge tone="neutral">{m.roulette_media_seasons({ count: details.seasons })}</Badge>
            {/if}
            {#if details.episodes}
              <Badge tone="neutral">{m.roulette_media_episodes({ count: details.episodes })}</Badge>
            {/if}
          </div>
          {#if details.genres.length}
            <p class="genres">{details.genres.join(" · ")}</p>
          {/if}
          {#if details.overview}
            <p class="overview">{details.overview}</p>
          {/if}
          <a
            class="tmdb-link"
            href={`https://www.themoviedb.org/${details.media_type}/${details.tmdb_id}`}
            target="_blank"
            rel="noreferrer"
          >
            {m.roulette_media_open_tmdb()} ↗
          </a>
        </div>
      </div>
    {:else if failed}
      <p class="status">{m.roulette_media_error()}</p>
    {:else}
      <p class="status">{m.roulette_media_loading()}</p>
    {/if}
    <div class="close">
      <Button onclick={onclose}>{m.roulette_close()}</Button>
    </div>
  </div>
</div>

<style lang="sass">
// Above the wheel takeover (1000) and its confetti (1001) so details can be
// opened from the winner overlay.
.overlay
  position: fixed
  inset: 0
  z-index: 1100
  display: flex
  align-items: center
  justify-content: center
  padding: 24px
  background: color-mix(in srgb, var(--ss-bg) 92%, transparent)
  backdrop-filter: blur(3px)

.panel
  width: min(680px, 100%)
  max-height: 86vh
  overflow-y: auto
  padding: var(--ss-s-6, 24px)
  background: var(--ss-bg)
  border: 1px solid var(--ss-line-strong)

.body
  display: flex
  gap: var(--ss-s-5, 20px)
  @media (max-width: 560px)
    flex-direction: column
    align-items: center

.text
  display: flex
  flex-direction: column
  gap: var(--ss-s-2, 8px)
  min-width: 0

.title
  margin: 0
  font-size: var(--ss-size-h3)
  font-family: var(--ss-font-display)
  .year
    color: var(--ss-fg-muted)
    font-size: var(--ss-size-body)
    font-family: var(--ss-font-mono)

.orig
  margin: 0
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

.facts
  display: flex
  flex-wrap: wrap
  gap: var(--ss-gap-sm, 6px)

.genres
  margin: 0
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

.overview
  margin: 0
  font-size: var(--ss-size-body)
  line-height: 1.55

.tmdb-link
  color: var(--ss-accent)
  font-size: var(--ss-size-sm)
  width: fit-content

.status
  margin: 0
  color: var(--ss-fg-muted)
  font-family: var(--ss-font-mono)
  text-align: center

.close
  display: flex
  justify-content: center
  margin-top: var(--ss-s-5, 20px)
</style>
