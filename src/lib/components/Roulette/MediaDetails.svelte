<script lang="ts">
  import { Badge, Link, Modal, Spinner } from "dssoca";
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

  let open = $state(true);
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

<Modal bind:open title={m.roulette_media_details()} size="lg" {onclose}>
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
        <span class="tmdb">
          <Link
            href={`https://www.themoviedb.org/${details.media_type}/${details.tmdb_id}`}
            external
          >
            {m.roulette_media_open_tmdb()} ↗
          </Link>
        </span>
      </div>
    </div>
  {:else if failed}
    <p class="status">{m.roulette_media_error()}</p>
  {:else}
    <div class="status">
      <Spinner label={m.roulette_media_loading()} showLabel />
    </div>
  {/if}
</Modal>

<style lang="sass">
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
  font-family: var(--ss-font-display)
  font-weight: 400
  font-size: 20px
  color: var(--ss-fg)
  .y
    color: var(--ss-fg-muted)
    font-family: var(--ss-font-mono)
    font-size: 13px

.orig
  margin: 0
  color: var(--ss-fg-muted)
  font-size: 11.5px

.facts
  display: flex
  flex-wrap: wrap
  gap: 6px

.genres
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  color: var(--ss-fg-faint)
  text-transform: uppercase
  letter-spacing: 0.06em

.overview
  margin: 0
  font-size: 12.5px
  line-height: 1.7
  color: var(--ss-fg)

.tmdb
  width: fit-content
  font-size: 11.5px

.status
  margin: 0
  color: var(--ss-fg-faint)
  font-family: var(--ss-font-mono)
  text-align: center
  padding: 20px 0
</style>
