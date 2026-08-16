<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { HistoryEntry, MediaKey, RouletteClient } from "$lib/roulette";
  import { Button, Card, DateField, EmptyState, Input } from "dssoca";
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

{#snippet rowInfo(entry: HistoryEntry)}
  <MediaPoster path={entry.poster_path} size="w92" alt="" />
  <div class="info">
    <div class="t">
      {entry.title}{#if entry.media_year}&nbsp;<span class="y">({entry.media_year})</span>{/if}
    </div>
    <div class="sub">
      {fmtDate(entry.drawn_at)}{#if entry.author} · {m.roulette_picked_by({ name: entry.author })}{/if}
    </div>
  </div>
{/snippet}

<Card title={m.roulette_history()} meta={m.roulette_watched({ count: history.length })}>
  {#snippet action()}
    <Button
      variant="ghost"
      size="sm"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      {open ? m.roulette_hide() : m.roulette_show()}
    </Button>
  {/snippet}
  {#if open}
    {#if history.length > 0}
      <div class="rows">
        {#each history as entry (entry.id)}
          <div class="row">
            {#if editingId === entry.id}
              <div class="edit">
                <div class="grow">
                  <Input label={m.roulette_field_title()} maxlength={200} bind:value={editTitle} />
                </div>
                <DateField label={m.roulette_field_date()} bind:value={editDate} />
                <div class="acts">
                  <Button variant="primary" size="sm" onclick={saveEdit}>
                    {m.roulette_save()}
                  </Button>
                  <Button variant="ghost" size="sm" onclick={() => (editingId = null)}>
                    {m.roulette_cancel()}
                  </Button>
                </div>
              </div>
            {:else}
              {#if entry.tmdb_id && entry.media_type}
                <div
                  class="hit clickable"
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
                  {@render rowInfo(entry)}
                </div>
              {:else}
                <div class="hit">
                  {@render rowInfo(entry)}
                </div>
              {/if}
              {#if admin}
                <span class="acts">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    label={m.roulette_edit()}
                    onclick={() => startEdit(entry)}
                  >
                    ✎
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    label={m.roulette_remove_option({ text: entry.title })}
                    onclick={() => client?.removeHistory(entry.id)}
                  >
                    ✕
                  </Button>
                </span>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
      <p class="caption foot">{m.roulette_history_admin_caption()}</p>
    {:else}
      <EmptyState title={m.roulette_no_films()} message={m.roulette_no_films_msg()} />
    {/if}
  {:else if history.length > 0}
    <p class="caption teaser">
      {m.roulette_last()} {history[0].title} · {fmtDate(history[0].drawn_at)}
    </p>
  {/if}
</Card>

<style lang="sass">
.rows
  display: flex
  flex-direction: column
  gap: 1px
  // History thumbs stay dense — 18px wide.
  :global(.poster)
    width: 18px

.row
  display: flex
  align-items: center
  gap: 4px
  border-bottom: 1px solid var(--ss-line)
  &:last-of-type
    border-bottom: none

.hit
  display: flex
  align-items: center
  gap: 8px
  flex: 1
  min-width: 0
  padding: 4px 2px
  border-radius: 4px

.clickable
  cursor: pointer
  &:hover
    background: var(--ss-bg-elev-hover)
  &:focus-visible
    outline: 2px solid var(--ss-accent)
    outline-offset: -2px

.info
  flex: 1
  min-width: 0

.t
  font-size: 11px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  .y
    color: var(--ss-fg-faint)

.sub
  font-size: 9.5px
  color: var(--ss-fg-faint)

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

.caption
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-sm)
  color: var(--ss-fg-muted)

.foot
  padding-top: 5px
</style>
