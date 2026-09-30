<script lang="ts">
  import { Badge, Button, Link, Modal, Spinner } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import { fetchMediaDetails, fetchMediaWarnings } from "$lib/roulette";
  import type { MediaDetailsData, MediaType, MediaWarningsData } from "$lib/roulette";
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

  // Does the Dog Die warnings load independently so they never block the
  // TMDB body. `undefined` = loading, `null` = API has no DDD key → hidden.
  let warnings = $state<MediaWarningsData | null | undefined>(undefined);
  let warningsFailed = $state(false);
  // Spoiler guard: the list is hidden until the viewer asks for it.
  let revealed = $state(false);

  $effect(() => {
    warnings = undefined;
    warningsFailed = false;
    revealed = false;
    let cancelled = false;
    fetchMediaWarnings(apiUrl, mediaType, tmdbId)
      .then((w) => {
        if (!cancelled) warnings = w;
      })
      .catch(() => {
        if (!cancelled) warningsFailed = true;
      });
    return () => {
      cancelled = true;
    };
  });

  const present = $derived((warnings?.topics ?? []).filter((t) => t.yes > t.no));
  const absent = $derived((warnings?.topics ?? []).filter((t) => t.yes <= t.no));
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
        {#if warnings !== null}
          <section class="warnings" aria-labelledby="ddd-title">
            <h3 id="ddd-title" class="wt">{m.roulette_warnings_title()}</h3>
            {#if warningsFailed}
              <p class="wline">{m.roulette_warnings_error()}</p>
            {:else if warnings === undefined}
              <div class="wline"><Spinner label={m.roulette_media_loading()} size="sm" /></div>
            {:else if !warnings.found}
              <p class="wline">{m.roulette_warnings_notfound()}</p>
            {:else if warnings.topics.length === 0}
              <p class="wline">{m.roulette_warnings_none()}</p>
            {:else if !revealed}
              <div class="wrow">
                <span class="wline">{m.roulette_warnings_count({ count: present.length })}</span>
                <Button variant="ghost" size="sm" onclick={() => (revealed = true)}>
                  {m.roulette_warnings_reveal()}
                </Button>
              </div>
            {:else}
              {#if present.length}
                <ul class="chips">
                  {#each present as t (t.topic_id)}
                    <li class="chip">
                      <Badge tone="caution">{t.name}</Badge>
                      <span class="votes">{m.roulette_warnings_votes({ yes: t.yes, no: t.no })}</span>
                    </li>
                  {/each}
                </ul>
              {/if}
              {#if absent.length}
                <p class="wline">
                  {m.roulette_warnings_absent({ list: absent.map((t) => t.name).join(", ") })}
                </p>
              {/if}
              <div class="wrow">
                {#if warnings.url}
                  <Link href={warnings.url} external>{m.roulette_warnings_open()} ↗</Link>
                {/if}
                <Button variant="ghost" size="sm" onclick={() => (revealed = false)}>
                  {m.roulette_warnings_hide()}
                </Button>
              </div>
            {/if}
            {#if !warningsFailed && warnings !== undefined}
              <!-- Licence condition: exact phrase, visibly shown wherever DDD data appears. -->
              <p class="powered">
                <Link href="https://www.doesthedogdie.com" external>
                  {m.roulette_warnings_powered()}
                </Link>
              </p>
            {/if}
          </section>
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

.warnings
  display: flex
  flex-direction: column
  gap: 6px
  padding: 10px 12px
  border: 1px solid var(--ss-line)
  border-radius: var(--ss-radius-1)
  background: var(--ss-bg-inset)

.wt
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  font-weight: 400
  color: var(--ss-fg-faint)
  text-transform: uppercase
  letter-spacing: 0.06em

.wline
  margin: 0
  font-size: 12px
  color: var(--ss-fg-muted)

.wrow
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 4px 12px
  font-size: 11.5px

.chips
  list-style: none
  margin: 0
  padding: 0
  display: flex
  flex-wrap: wrap
  gap: 6px 12px

.chip
  display: inline-flex
  align-items: center
  gap: 6px

.votes
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  color: var(--ss-fg-muted)

.powered
  margin: 0
  font-size: 12px

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
