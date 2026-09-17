<script lang="ts">
  import { Badge, Button, DateField, Input, Modal, Switch, toast } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import type { HistoryAddInput, MediaPick } from "$lib/roulette";
  import MediaSearchInput from "./MediaSearchInput.svelte";

  let {
    apiUrl,
    mediaEnabled,
    onadd,
    onclose,
  }: {
    apiUrl: string;
    mediaEnabled: boolean;
    /** Resolves once the server accepted the entry; rejects with a message. */
    onadd: (input: HistoryAddInput) => Promise<void>;
    onclose: () => void;
  } = $props();

  let open = $state(true);
  // The film: either a TMDB pick (poster + canonical metadata server-side)
  // or plain text for things TMDB doesn't know. Picking fills the title,
  // which stays editable — an edited title overrides the canonical one.
  let picked = $state<{ text: string; media: MediaPick | null } | null>(null);
  let title = $state("");
  let author = $state("");
  let date = $state(new Date().toISOString().slice(0, 10));
  let dateUnknown = $state(false);
  let saving = $state(false);

  const canSubmit = $derived(!!picked && title.trim().length > 0 && !saving);

  function pick(text: string, media: MediaPick | null) {
    picked = { text, media };
    title = text;
  }

  async function submit() {
    if (!picked || !canSubmit) return;
    saving = true;
    try {
      const clean = title.trim();
      await onadd({
        // Same wording as the pick → let the server store the canonical title.
        title: picked.media && clean === picked.text ? "" : clean,
        author: author.trim() || null,
        drawn_at: dateUnknown || !date ? null : new Date(date).toISOString(),
        media: picked.media,
      });
      toast.success(m.roulette_history_added({ title: clean }));
      open = false;
    } catch (err) {
      toast.error((err as Error).message || m.roulette_history_add_failed());
    } finally {
      saving = false;
    }
  }
</script>

<Modal bind:open title={m.roulette_history_add()} {onclose}>
  <div class="form">
    <p class="desc">{m.roulette_history_add_desc()}</p>

    {#if !picked}
      <MediaSearchInput
        {apiUrl}
        enabled={mediaEnabled}
        hint={m.roulette_history_add_hint()}
        onadd={pick}
      />
    {:else}
      <div class="picked">
        <div class="grow">
          <Input label={m.roulette_field_title()} maxlength={200} bind:value={title} />
        </div>
        <Button variant="ghost" size="md" onclick={() => (picked = null)}>
          {m.roulette_history_add_change()}
        </Button>
      </div>
      <div class="source">
        {#if picked.media}
          <Badge tone="brand" size="md">
            {picked.media.media_type === "movie" ? m.roulette_media_movie() : m.roulette_media_tv()}
          </Badge>
          <span>{m.roulette_history_add_tmdb()}</span>
        {:else}
          <span>{m.roulette_history_add_freetext()}</span>
        {/if}
      </div>
    {/if}

    <Input
      label={m.roulette_history_add_author()}
      placeholder={m.roulette_history_add_author_hint()}
      maxlength={40}
      bind:value={author}
    />

    <div class="date-row">
      <div class="grow">
        <DateField label={m.roulette_field_date()} bind:value={date} disabled={dateUnknown} />
      </div>
      <Switch label={m.roulette_date_unknown()} bind:checked={dateUnknown} />
    </div>
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (open = false)}>{m.roulette_cancel()}</Button>
    <Button variant="primary" onclick={submit} disabled={!canSubmit} loading={saving}>
      {m.roulette_history_add_submit()}
    </Button>
  {/snippet}
</Modal>

<style lang="sass">
.form
  display: flex
  flex-direction: column
  gap: 14px
  // Room for the search dropdown (absolute, inside the modal's scroll body).
  min-height: 300px

.desc
  margin: 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-sm)
  color: var(--ss-fg-muted)

.picked
  display: flex
  align-items: flex-end
  gap: 8px

.grow
  flex: 1
  min-width: 0

.source
  display: flex
  align-items: center
  gap: 8px
  margin-top: -6px
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  color: var(--ss-fg-faint)

.date-row
  display: flex
  align-items: flex-end
  gap: 12px
  flex-wrap: wrap
</style>
