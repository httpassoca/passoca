<script lang="ts">
  import { Badge, Button, Input } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import { mediaLang, searchMedia } from "$lib/roulette";
  import type { MediaPick, MediaSummary } from "$lib/roulette";
  import MediaPoster from "./MediaPoster.svelte";

  let {
    apiUrl,
    enabled,
    disabled = false,
    hint = undefined,
    onadd,
  }: {
    apiUrl: string;
    /** TMDB configured on the API — when false this is a plain text input. */
    enabled: boolean;
    disabled?: boolean;
    hint?: string;
    onadd: (text: string, media: MediaPick | null) => void;
  } = $props();

  const DEBOUNCE_MS = 300;
  const MIN_QUERY = 2;

  let text = $state("");
  let results = $state<MediaSummary[]>([]);
  let open = $state(false);
  let active = $state(-1);
  let searching = $state(false);

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | null = null;
  let reqId = 0;

  function closeDropdown() {
    clearTimeout(debounceTimer);
    controller?.abort();
    reqId++;
    open = false;
    active = -1;
    searching = false;
  }

  // Debounced search driven by the input text.
  $effect(() => {
    const q = text.trim();
    clearTimeout(debounceTimer);
    if (!enabled || disabled || q.length < MIN_QUERY) {
      closeDropdown();
      return;
    }
    debounceTimer = setTimeout(() => run(q), DEBOUNCE_MS);
  });

  async function run(q: string) {
    controller?.abort();
    const ctrl = (controller = new AbortController());
    const id = ++reqId;
    searching = true;
    try {
      const found = await searchMedia(apiUrl, q, ctrl.signal);
      if (id !== reqId) return;
      results = found;
      open = true;
      active = -1;
    } catch {
      // Aborted or API down — silently fall back to free text.
      if (id === reqId) {
        results = [];
        open = false;
      }
    } finally {
      if (id === reqId) searching = false;
    }
  }

  function pick(r: MediaSummary) {
    onadd(r.title, { media_type: r.media_type, tmdb_id: r.tmdb_id, lang: mediaLang() });
    text = "";
    closeDropdown();
  }

  function submit() {
    if (open && active >= 0 && results[active]) {
      pick(results[active]);
      return;
    }
    const clean = text.trim();
    if (!clean) return;
    onadd(clean, null);
    text = "";
    closeDropdown();
  }

  function handleKey(e: KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = (active + 1) % results.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = active <= 0 ? results.length - 1 : active - 1;
    } else if (e.key === "Escape") {
      e.stopPropagation();
      closeDropdown();
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions
     (keydown only steers the dropdown; the input inside stays the focus target) -->
<div class="search-wrap" onkeydown={handleKey}>
  <form
    class="row"
    onsubmit={(e) => {
      e.preventDefault();
      submit();
    }}
  >
    <Input
      label={m.roulette_your_option()}
      placeholder={m.roulette_option_placeholder()}
      maxlength={120}
      bind:value={text}
      {disabled}
      {hint}
    />
    <Button type="submit" disabled={disabled || !text.trim()}>
      {m.roulette_add()}
    </Button>
  </form>

  {#if open}
    <ul class="dropdown" role="listbox" aria-label={m.roulette_your_option()}>
      {#each results as r, i (r.media_type + r.tmdb_id)}
        <li>
          <button
            type="button"
            class="result"
            class:active={i === active}
            role="option"
            aria-selected={i === active}
            onclick={() => pick(r)}
          >
            <MediaPoster path={r.poster_path} size="w92" alt="" />
            <span class="info">
              <span class="title">
                {r.title}
                {#if r.year}<span class="year">({r.year})</span>{/if}
              </span>
              <span class="meta">
                <Badge tone="neutral">
                  {r.media_type === "movie" ? m.roulette_media_movie() : m.roulette_media_tv()}
                </Badge>
                {#if r.original_title && r.original_title !== r.title}
                  <span class="orig">{r.original_title}</span>
                {/if}
              </span>
            </span>
          </button>
        </li>
      {:else}
        <li class="note">{m.roulette_media_no_results()}</li>
      {/each}
      <li class="note attribution">
        {searching ? m.roulette_media_loading() : m.roulette_media_attribution()}
      </li>
    </ul>
  {/if}
</div>

<style lang="sass">
.search-wrap
  position: relative

.row
  display: flex
  align-items: flex-start
  gap: var(--ss-gap, 10px)
  :global(label)
    flex: 1
  :global(button[type="submit"])
    margin-top: 22px

.dropdown
  position: absolute
  top: calc(100% + 4px)
  left: 0
  right: 0
  z-index: 30
  margin: 0
  padding: 4px
  list-style: none
  background: var(--ss-bg)
  border: 1px solid var(--ss-line-strong)
  box-shadow: 0 8px 24px color-mix(in srgb, var(--ss-fg) 12%, transparent)
  max-height: 340px
  overflow-y: auto

.result
  display: flex
  align-items: center
  gap: var(--ss-gap, 10px)
  width: 100%
  padding: 6px
  background: none
  border: none
  color: var(--ss-fg)
  font: inherit
  text-align: left
  cursor: pointer
  &:hover,
  &.active
    background: var(--ss-bg-inset)

.info
  display: flex
  flex-direction: column
  gap: 2px
  min-width: 0

.title
  font-size: var(--ss-size-body)
  overflow-wrap: anywhere
  .year
    color: var(--ss-fg-muted)
    font-size: var(--ss-size-sm)

.meta
  display: flex
  align-items: center
  gap: var(--ss-gap-sm, 6px)
  min-width: 0

.orig
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.note
  padding: 6px 8px
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

.attribution
  border-top: 1px solid var(--ss-line)
  font-family: var(--ss-font-mono)
</style>
