<script lang="ts">
  import { Avatar, Badge, Button, Textarea } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import {
    TIER_COLORS,
    keyForMedia,
    ranksFor,
    type CommentsByMedia,
    type MediaKey,
    type RouletteClient,
    type TierlistState,
  } from "$lib/roulette";

  let {
    client,
    media,
    name,
    admin,
    comments,
    submissions,
  }: {
    client: RouletteClient | null;
    media: MediaKey;
    /** Identified name; empty = not joined, read-only. */
    name: string;
    /** Server-confirmed admin — can delete anyone's comment. */
    admin: boolean;
    comments: CommentsByMedia;
    submissions: TierlistState["submissions"];
  } = $props();

  const key = $derived(keyForMedia(media));
  const list = $derived(comments[key] ?? []);
  const ranks = $derived(ranksFor(key, submissions));
  const tierOf = $derived(new Map(ranks.map((r) => [r.name, r.tier])));

  let draft = $state("");

  function post() {
    const body = draft.trim();
    if (!body || !client || !name) return;
    client.addComment(key, body);
    draft = "";
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      post();
    }
  }

  function fmt(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<section class="comments" aria-labelledby="comments-title">
  <h3 id="comments-title" class="ct">
    {m.roulette_comments_title()}
    {#if list.length}<span class="count">{list.length}</span>{/if}
  </h3>

  {#if ranks.length}
    <ul class="ranks">
      {#each ranks as rank (rank.name)}
        <li class="rank">
          <span class="tier" style:--tier-color={TIER_COLORS[rank.tier]}>{rank.tier}</span>
          {rank.name}
        </li>
      {/each}
    </ul>
  {/if}

  {#if list.length === 0}
    <p class="empty">{m.roulette_comments_empty()}</p>
  {:else}
    <ul class="list">
      {#each list as c (c.id)}
        {@const tier = tierOf.get(c.author)}
        <li class="comment">
          <Avatar name={c.author} size="sm" />
          <div class="main">
            <div class="meta">
              <span class="author">{c.author}</span>
              {#if tier}
                <Badge tone="neutral">{m.roulette_comments_ranked({ tier })}</Badge>
              {/if}
              <time class="when" datetime={c.created_at}>{fmt(c.created_at)}</time>
              {#if admin || c.author === name}
                <Button variant="ghost" size="sm" onclick={() => client?.removeComment(c.id)}>
                  {m.roulette_comments_delete()}
                </Button>
              {/if}
            </div>
            <p class="body">{c.body}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  {#if name && client}
    <div class="form">
      <Textarea
        label={m.roulette_comments_label()}
        placeholder={m.roulette_comments_placeholder()}
        bind:value={draft}
        rows={2}
        autosize
        maxRows={8}
        maxlength={2000}
        {onkeydown}
      />
      <div class="actions">
        <Button size="md" disabled={!draft.trim()} onclick={post}>
          {m.roulette_comments_post()}
        </Button>
      </div>
    </div>
  {:else}
    <p class="empty">{m.roulette_comments_join()}</p>
  {/if}
</section>

<style lang="sass">
.comments
  display: flex
  flex-direction: column
  gap: 10px

.ct
  margin: 0
  display: flex
  align-items: center
  gap: 8px
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  font-weight: 400
  color: var(--ss-fg-faint)
  text-transform: uppercase
  letter-spacing: 0.06em

.count
  color: var(--ss-fg-muted)

.ranks
  list-style: none
  margin: 0
  padding: 0
  display: flex
  flex-wrap: wrap
  gap: 6px 14px

.rank
  display: inline-flex
  align-items: center
  gap: 6px
  font-size: 12px
  color: var(--ss-fg-muted)

.tier
  display: inline-grid
  place-items: center
  width: 18px
  height: 18px
  border-radius: var(--ss-radius-1)
  background: var(--tier-color)
  color: var(--ss-bg)
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  font-weight: 700

.list
  list-style: none
  margin: 0
  padding: 0
  display: flex
  flex-direction: column
  gap: 12px
  max-height: 320px
  overflow-y: auto

.comment
  display: flex
  gap: 10px
  align-items: flex-start

.main
  display: flex
  flex-direction: column
  gap: 4px
  min-width: 0
  flex: 1

.meta
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 4px 8px

.author
  font-size: 12.5px
  color: var(--ss-fg)
  font-weight: 600

.when
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  color: var(--ss-fg-faint)

.body
  margin: 0
  font-size: 12.5px
  line-height: 1.6
  color: var(--ss-fg)
  white-space: pre-wrap
  overflow-wrap: anywhere

.empty
  margin: 0
  font-size: 12px
  color: var(--ss-fg-muted)

.form
  display: flex
  flex-direction: column
  gap: 6px

.actions
  display: flex
  justify-content: flex-end
</style>
