<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { HistoryEntry, MediaKey, RouletteClient } from "$lib/roulette";
  import MediaPoster from "./MediaPoster.svelte";

  let {
    history,
    admin,
    client,
    ondetails,
  }: {
    history: HistoryEntry[];
    admin: boolean;
    client: RouletteClient | null;
    ondetails: (media: MediaKey) => void;
  } = $props();

  let open = $state(false);
  let editingId = $state<string | null>(null);
  let editTitle = $state("");
  let editDate = $state("");

  function startEdit(entry: HistoryEntry) {
    editingId = entry.id;
    editTitle = entry.title;
    editDate = entry.drawn_at.slice(0, 10);
  }
  function saveEdit() {
    if (!client || !editingId) return;
    const iso = editDate ? new Date(editDate).toISOString() : new Date().toISOString();
    client.editHistory(editingId, editTitle.trim(), iso);
    editingId = null;
  }
  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

<div class="hub-panel">
  <button class="hub-panel-head" aria-expanded={open} onclick={() => (open = !open)}>
    <span class="title">{m.roulette_history()}</span>
    <span class="meta">{m.roulette_watched({ count: history.length })} · {open ? "▾" : "▸"}</span>
  </button>
  {#if open}
    <div class="hub-panel-body body">
      {#if history.length > 0}
        {#each history as entry (entry.id)}
          <div class="row">
            {#if editingId === entry.id}
              <div class="edit">
                <label class="hub-field grow">
                  <span class="lbl">{m.roulette_field_title()}</span>
                  <input class="hub-input sm" maxlength={200} bind:value={editTitle} />
                </label>
                <label class="hub-field">
                  <span class="lbl">{m.roulette_field_date()}</span>
                  <input class="hub-input sm" type="date" bind:value={editDate} />
                </label>
                <div class="acts">
                  <button class="hub-btn primary" onclick={saveEdit}>{m.roulette_save()}</button>
                  <button class="hub-btn ghost" onclick={() => (editingId = null)}>
                    {m.roulette_cancel()}
                  </button>
                </div>
              </div>
            {:else}
              <MediaPoster path={entry.poster_path} size="w92" alt="" />
              <div class="info">
                <div class="t">
                  {entry.title}{#if entry.media_year}&nbsp;<span class="y">({entry.media_year})</span>{/if}
                </div>
                <div class="sub">
                  {fmtDate(entry.drawn_at)}{#if entry.author} · {m.roulette_picked_by({ name: entry.author })}{/if}
                  {#if entry.tmdb_id && entry.media_type}
                    ·
                    <button
                      class="details"
                      onclick={() =>
                        ondetails({ media_type: entry.media_type!, tmdb_id: entry.tmdb_id! })}
                    >
                      {m.roulette_media_details()} ↗
                    </button>
                  {/if}
                </div>
              </div>
              {#if admin}
                <span class="acts">
                  <button class="hub-btn ghost" onclick={() => startEdit(entry)}>✎</button>
                  <button class="hub-btn ghost" onclick={() => client?.removeHistory(entry.id)}
                    >✕</button
                  >
                </span>
              {/if}
            {/if}
          </div>
        {/each}
        <p class="hs-caption foot">{m.roulette_history_admin_caption()}</p>
      {:else}
        <p class="hs-caption">{m.roulette_no_films()} — {m.roulette_no_films_msg()}</p>
      {/if}
    </div>
  {:else if history.length > 0}
    <div class="hub-panel-body">
      <p class="hs-caption teaser">
        {m.roulette_last()} {history[0].title} · {fmtDate(history[0].drawn_at)}
      </p>
    </div>
  {/if}
</div>

<style lang="sass">
.body
  display: flex
  flex-direction: column
  gap: 1px
  padding: 6px 8px
  // History thumbs — mock uses 18×26.
  :global(.poster)
    width: 18px

.row
  display: flex
  align-items: center
  gap: 8px
  padding: 4px 2px
  border-bottom: 1px solid var(--hs-line)
  &:last-of-type
    border-bottom: none

.info
  flex: 1
  min-width: 0

.t
  font-size: 11px
  color: var(--hs-fg)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  .y
    color: var(--hs-fg-faint)

.sub
  font-size: 9.5px
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

.acts
  display: flex
  gap: 2px
  flex: none

.edit
  display: flex
  align-items: flex-end
  gap: 8px
  width: 100%
  flex-wrap: wrap
  padding: 4px 0

.grow
  flex: 1

.hub-input.sm
  padding: 6px 8px
  font-size: 12px

.foot
  margin: 0
  padding-top: 5px

.teaser
  margin: 0
</style>
