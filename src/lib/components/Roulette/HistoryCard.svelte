<script lang="ts">
  import { Badge, Button, Card, EmptyState, Input } from "dssoca";
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
  {#if !open}
    {#if history.length > 0}
      <p class="muted">
        {m.roulette_last()} {history[0].title} · {fmtDate(history[0].drawn_at)}
      </p>
    {:else}
      <p class="muted">{m.roulette_no_films()}</p>
    {/if}
  {:else if history.length > 0}
    <ul class="history">
      {#each history as entry (entry.id)}
        <li>
          {#if editingId === entry.id}
            <div class="edit-row">
              <Input label={m.roulette_field_title()} maxlength={200} bind:value={editTitle} />
              <label class="date">
                {m.roulette_field_date()}
                <input type="date" bind:value={editDate} />
              </label>
              <div class="edit-actions">
                <Button size="sm" onclick={saveEdit}>{m.roulette_save()}</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => (editingId = null)}>{m.roulette_cancel()}</Button
                >
              </div>
            </div>
          {:else}
            {#if entry.tmdb_id}
              <MediaPoster path={entry.poster_path} size="w92" alt="" />
            {/if}
            <span class="h-title">
              {entry.title}
              {#if entry.media_year}<span class="h-year">({entry.media_year})</span>{/if}
            </span>
            {#if entry.author}
              <Badge tone="neutral">{entry.author}</Badge>
            {/if}
            <span class="h-date">{fmtDate(entry.drawn_at)}</span>
            {#if entry.tmdb_id && entry.media_type}
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                label={m.roulette_media_details()}
                onclick={() =>
                  ondetails({ media_type: entry.media_type!, tmdb_id: entry.tmdb_id! })}>ℹ</Button
              >
            {/if}
            {#if admin}
              <span class="h-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => startEdit(entry)}>{m.roulette_edit()}</Button
                >
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => client?.removeHistory(entry.id)}>✕</Button
                >
              </span>
            {/if}
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <EmptyState
      title={m.roulette_no_films()}
      message={m.roulette_no_films_msg()}
    />
  {/if}
</Card>

<style lang="sass">
.muted
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 10px 0 0

.history
  list-style: none
  margin: var(--ss-s-1, 4px) 0 0
  padding: 0
  li
    display: flex
    align-items: center
    gap: var(--ss-gap, 10px)
    padding: var(--ss-s-2, 8px) 0
    border-bottom: 1px solid var(--ss-line)
    &:last-child
      border-bottom: none
  .h-title
    flex: 1
    min-width: 0
    overflow-wrap: anywhere
    font-size: var(--ss-size-body)
  .h-year
    color: var(--ss-fg-muted)
    font-size: var(--ss-size-sm)
  .h-date
    color: var(--ss-fg-muted)
    font-size: var(--ss-size-sm)
    font-family: var(--ss-font-mono)
  .h-actions
    display: flex
    gap: 2px

.edit-row
  display: flex
  align-items: flex-end
  gap: 10px
  width: 100%
  flex-wrap: wrap
  .date
    display: flex
    flex-direction: column
    font-size: var(--ss-size-sm)
    color: var(--ss-fg-muted)
    gap: 4px
    input
      background: var(--ss-bg-inset)
      border: 1px solid var(--ss-line)
      color: var(--ss-fg)
      font: inherit
      padding: 6px 8px
  .edit-actions
    display: flex
    gap: var(--ss-gap-sm, 6px)
</style>
