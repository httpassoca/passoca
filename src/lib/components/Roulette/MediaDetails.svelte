<script lang="ts">
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
     (backdrop click is a pointer shortcut; keyboard users have Escape and the ✕ button) -->
<div
  class="hub-overlay"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
  onclick={(e) => {
    if (e.target === e.currentTarget) onclose();
  }}
>
  <div class="hub-panel modal">
    <div class="hub-panel-head">
      <div class="title">{m.roulette_media_details()}</div>
      <button class="hub-btn ghost" onclick={onclose}>✕</button>
    </div>
    <div class="hub-panel-body">
      {#if details}
        <div class="body">
          <MediaPoster
            path={details.poster_path}
            size="w342"
            alt={m.roulette_media_poster_alt({ title: details.title })}
          />
          <div class="text">
            <h2 class="t">
              {details.title}
              {#if details.year}<span class="y">({details.year})</span>{/if}
            </h2>
            {#if details.original_title && details.original_title !== details.title}
              <p class="orig">{details.original_title}</p>
            {/if}
            <div class="facts">
              <span class="hub-badge up">
                {details.media_type === "movie" ? m.roulette_media_movie() : m.roulette_media_tv()}
              </span>
              {#if details.vote_average}
                <span class="hub-badge">★ {details.vote_average.toFixed(1)}</span>
              {/if}
              {#if details.runtime}
                <span class="hub-badge">{m.roulette_media_runtime({ min: details.runtime })}</span>
              {/if}
              {#if details.seasons}
                <span class="hub-badge">{m.roulette_media_seasons({ count: details.seasons })}</span>
              {/if}
              {#if details.episodes}
                <span class="hub-badge">{m.roulette_media_episodes({ count: details.episodes })}</span>
              {/if}
            </div>
            {#if details.genres.length}
              <p class="hs-caption">{details.genres.join(" · ")}</p>
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
    </div>
  </div>
</div>

<style lang="sass">
.modal
  width: min(640px, 100%)

.body
  display: flex
  gap: 16px
  @media (max-width: 560px)
    flex-direction: column
    align-items: center

.text
  display: flex
  flex-direction: column
  gap: 8px
  min-width: 0

.t
  margin: 0
  font-family: var(--hs-font-display)
  font-weight: 400
  font-size: 20px
  color: var(--hs-fg)
  .y
    color: var(--hs-fg-muted)
    font-family: var(--hs-font-mono)
    font-size: 13px

.orig
  margin: 0
  color: var(--hs-fg-muted)
  font-size: 11.5px

.facts
  display: flex
  flex-wrap: wrap
  gap: 6px

.overview
  margin: 0
  font-size: 12.5px
  line-height: 1.7
  color: var(--hs-fg)

.tmdb-link
  color: var(--hs-primary)
  font-size: 11.5px
  width: fit-content
  text-decoration: none
  border-bottom: 1px solid var(--hs-primary)
  &:hover
    border-bottom-width: 2px

.status
  margin: 0
  color: var(--hs-fg-faint)
  font-family: var(--hs-font-mono)
  text-align: center
  padding: 20px 0
</style>
