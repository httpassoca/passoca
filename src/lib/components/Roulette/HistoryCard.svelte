<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { HistoryEntry, MediaKey, RouletteClient } from "$lib/roulette";
  import { Button, Card, DateField, EmptyState, Input, toast } from "dssoca";
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

  // The history is its own full-width strip now, so it opens by default.
  let open = $state(true);
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
  function openDetails(entry: HistoryEntry) {
    if (entry.tmdb_id && entry.media_type) {
      ondetails({ media_type: entry.media_type, tmdb_id: entry.tmdb_id });
    }
  }
  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

{#snippet caption(entry: HistoryEntry)}
  <div class="cap">
    <div class="t">
      {entry.title}{#if entry.media_year}&nbsp;<span class="y">({entry.media_year})</span>{/if}
    </div>
    <div class="sub">
      {entry.drawn_at ? fmtDate(entry.drawn_at) : m.roulette_date_unknown()}{#if entry.author}
        · {m.roulette_picked_by({ name: entry.author })}{/if}
    </div>
  </div>
{/snippet}

<Card title={m.roulette_history()} meta={m.roulette_watched({ count: history.length })}>
  {#snippet action()}
    <Button
      variant="ghost"
      size="md"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      {open ? m.roulette_hide() : m.roulette_show()}
    </Button>
  {/snippet}
  {#if open}
    {#if history.length > 0}
      <div class="grid">
        {#each history as entry (entry.id)}
          {#if editingId === entry.id}
            <div class="edit">
              <div class="grow">
                <Input label={m.roulette_field_title()} maxlength={200} bind:value={editTitle} />
              </div>
              <DateField label={m.roulette_field_date()} bind:value={editDate} />
              <div class="acts">
                <Button variant="primary" size="md" onclick={saveEdit}>
                  {m.roulette_save()}
                </Button>
                <Button variant="ghost" size="md" onclick={() => (editingId = null)}>
                  {m.roulette_cancel()}
                </Button>
              </div>
            </div>
          {:else}
            <div class="cell">
              {#if entry.tmdb_id && entry.media_type}
                <div
                  class="tile clickable"
                  role="button"
                  tabindex="0"
                  aria-label={entry.title}
                  onclick={() => openDetails(entry)}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetails(entry);
                    }
                  }}
                >
                  <MediaPoster path={entry.poster_path} size="w342" alt="" />
                </div>
              {:else}
                <div class="tile">
                  <MediaPoster path={entry.poster_path} size="w342" alt="" />
                </div>
              {/if}
              {@render caption(entry)}
              {#if admin}
                <span class="acts">
                  <Button
                    variant="ghost"
                    size="md"
                    iconOnly
                    label={m.roulette_edit()}
                    onclick={() => startEdit(entry)}
                  >
                    ✎
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    iconOnly
                    label={m.roulette_remove_option({ text: entry.title })}
                    onclick={() => {
                      client?.removeHistory(entry.id);
                      toast.success(m.roulette_history_removed());
                    }}
                  >
                    ✕
                  </Button>
                </span>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
      <p class="caption foot">{m.roulette_history_admin_caption()}</p>
    {:else}
      <EmptyState title={m.roulette_no_films()} message={m.roulette_no_films_msg()} />
    {/if}
  {:else if history.length > 0}
    <p class="caption teaser">
      {m.roulette_last()} {history[0].title} ·
      {history[0].drawn_at ? fmtDate(history[0].drawn_at) : m.roulette_date_unknown()}
    </p>
  {/if}
</Card>

<style lang="sass">
.grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr))
  gap: 12px 10px
  align-items: start

.cell
  display: flex
  flex-direction: column
  gap: 5px
  min-width: 0

.tile
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  overflow: hidden
  line-height: 0
  transition: border-color var(--ss-dur, 250ms) var(--ss-ease), box-shadow var(--ss-dur, 250ms) var(--ss-ease)
  // The tile owns the frame; the poster fills it edge to edge. (Compound
  // selector so this outweighs MediaPoster's own .poster.w342 width.)
  :global(.poster.w342)
    width: 100%
    height: auto
    border: none

.clickable
  cursor: pointer
  &:hover
    border-color: var(--ss-accent)
    box-shadow: var(--ss-shadow-pop)
  &:focus-visible
    outline: 2px solid var(--ss-accent)
    outline-offset: 2px

.cap
  min-width: 0

.t
  font-size: 11.5px
  line-height: 1.3
  overflow: hidden
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 2
  word-break: break-word
  .y
    color: var(--ss-fg-faint)

.sub
  font-size: 9.5px
  color: var(--ss-fg-faint)
  margin-top: 2px

.acts
  display: flex
  gap: 2px

.edit
  grid-column: 1 / -1
  display: flex
  align-items: flex-end
  gap: 8px
  width: 100%
  flex-wrap: wrap
  padding: 4px 0

.grow
  flex: 1

.caption
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-sm)
  color: var(--ss-fg-muted)

.foot
  padding-top: 10px

.teaser
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>
