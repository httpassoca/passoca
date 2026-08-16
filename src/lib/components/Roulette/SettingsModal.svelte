<script lang="ts">
  import { Badge, Button, EmptyState, Modal, toast } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import {
    colorForName,
    type HistoryEntry,
    type Option,
    type Presence,
    type TierlistState,
  } from "$lib/roulette";

  let {
    presence,
    options,
    history,
    submissions,
    me,
    maxPicks,
    onsetmax,
    onremove,
    onclose,
  }: {
    presence: Presence[];
    options: Option[];
    history: HistoryEntry[];
    submissions: TierlistState["submissions"];
    /** The admin's own name — its row never shows delete actions. */
    me: string;
    maxPicks: number;
    onsetmax: (value: number) => void;
    onremove: (name: string, wipe: boolean) => void;
    onclose: () => void;
  } = $props();

  let open = $state(true);

  const online = $derived(new Set(presence.map((p) => p.name)));
  const pickCounts = $derived(
    options.reduce(
      (acc, o) => acc.set(o.author, (acc.get(o.author) ?? 0) + 1),
      new Map<string, number>()
    )
  );
  // "Users" have no table server-side either — the list is the union of every
  // place a name can appear: who's online, tierlist submitters, wheel pick
  // authors and past winners.
  const users = $derived(
    [
      ...new Set([
        ...presence.map((p) => p.name),
        ...Object.keys(submissions),
        ...options.map((o) => o.author),
        ...history.map((h) => h.author).filter((a): a is string => !!a),
      ]),
    ]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  );

  function metaFor(user: string): string {
    const n = pickCounts.get(user) ?? 0;
    return [n > 0 ? m.roulette_user_picks({ count: n }) : null, submissions[user] ? m.roulette_user_tierlist() : null]
      .filter(Boolean)
      .join(" · ");
  }

  function remove(user: string, wipe: boolean) {
    onremove(user, wipe);
    toast.success(m.roulette_user_deleted({ name: user }));
  }
</script>

<Modal bind:open title={m.roulette_settings()} size="md" {onclose}>
  <div class="limit-row">
    <span class="label">{m.roulette_settings_limit()}</span>
    <span class="stepper">
      <Button
        variant="ghost"
        size="md"
        iconOnly
        label="−"
        disabled={maxPicks <= 1}
        onclick={() => onsetmax(maxPicks - 1)}>−</Button
      >
      <span class="value">{maxPicks}</span>
      <Button
        variant="ghost"
        size="md"
        iconOnly
        label="+"
        disabled={maxPicks >= 10}
        onclick={() => onsetmax(maxPicks + 1)}>+</Button
      >
    </span>
  </div>

  <div class="sect">{m.roulette_users()}</div>
  {#if users.length === 0}
    <EmptyState title={m.roulette_users_empty()} compact fullWidth />
  {:else}
    {#each users as user (user)}
      <div class="user">
        <span class="udot" style:background={colorForName(user)}></span>
        <span class="uname" class:me={user === me}>{user}</span>
        {#if online.has(user)}
          <Badge tone="positive" dot>{m.roulette_user_online()}</Badge>
        {/if}
        <span class="meta">{metaFor(user)}</span>
        {#if user !== me}
          <span class="actions">
            <Button variant="ghost" size="md" onclick={() => remove(user, false)}>
              {m.roulette_user_delete()}
            </Button>
            <Button variant="danger" size="md" onclick={() => remove(user, true)}>
              {m.roulette_user_wipe()}
            </Button>
          </span>
        {/if}
      </div>
    {/each}
  {/if}
</Modal>

<style lang="sass">
.limit-row
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  .label
    font-size: var(--ss-size-sm)
    color: var(--ss-fg)

.stepper
  display: inline-flex
  align-items: center
  gap: 4px
  .value
    min-width: 24px
    text-align: center
    font-family: var(--ss-font-mono)
    font-size: var(--ss-size-sm)
    color: var(--ss-fg)

.sect
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  color: var(--ss-fg-faint)
  text-transform: uppercase
  letter-spacing: 0.06em
  border-top: 1px solid var(--ss-line)
  margin: 12px 0 8px
  padding-top: 10px

.user
  display: flex
  align-items: center
  gap: 8px
  padding: 5px 0
  & + .user
    border-top: 1px solid var(--ss-line)

.udot
  width: 8px
  height: 8px
  flex: none
  border: 1px solid var(--ss-line-strong)

.uname
  font-size: var(--ss-size-sm)
  color: var(--ss-fg)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  &.me
    color: var(--ss-accent)

.meta
  flex: 1
  min-width: 0
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  color: var(--ss-fg-muted)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.actions
  display: inline-flex
  gap: 4px
  flex: none
</style>
