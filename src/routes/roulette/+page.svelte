<script lang="ts">
  import { onMount } from "svelte";
  import {
    Badge,
    Button,
    Card,
    EmptyState,
    Heading,
    Input,
    NumberField,
    Toaster,
    toast,
    CHART_PALETTE,
  } from "dssoca";
  import Wheel from "$lib/components/Roulette/Wheel.svelte";
  import IdeasEditor from "$lib/components/Roulette/IdeasEditor.svelte";
  import OnlineUsers from "$lib/components/Roulette/OnlineUsers.svelte";
  import {
    createRouletteClient,
    colorForName,
    isAdmin,
    DEFAULT_WHEEL,
    type RouletteClient,
    type WheelState,
    type HistoryEntry,
    type Presence,
  } from "$lib/roulette";

  const NAME_KEY = "passoca:roulette:name";
  const SPIN_SECONDS = 4;
  const API_URL = import.meta.env.VITE_API_URL as string | undefined;

  let client = $state<RouletteClient | null>(null);
  let connected = $state(false);
  let wheelState = $state<WheelState>({ ...DEFAULT_WHEEL });
  let history = $state<HistoryEntry[]>([]);
  let presence = $state<Presence[]>([]);
  let loaded = $state(false);

  let name = $state("");
  let draftName = $state("");
  let editingName = $state(false);
  let draftPick = $state("");

  const myColor = $derived(name ? colorForName(name) : CHART_PALETTE[0]);
  const admin = $derived(isAdmin(name));

  const options = $derived(wheelState.options);
  const myOptionCount = $derived(options.filter((o) => o.author === name).length);
  const segments = $derived(options.map((o) => ({ id: o.id, label: o.text })));

  // Spin animation state (driven by the server's spun_at timestamp).
  let rotation = $state(0);
  let spinDuration = $state(0);
  let spinning = $state(false);
  let winnerId = $state<string | null>(null);
  let lastSpunAt: string | null | undefined = undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  const winner = $derived(
    winnerId ? options.find((o) => o.id === winnerId) ?? null : null
  );

  // Settings: NumberField steppers mutate the binding without a change event.
  let maxPicksDraft = $state<number | null>(DEFAULT_WHEEL.max_picks);
  $effect(() => {
    maxPicksDraft = wheelState.max_picks;
  });
  $effect(() => {
    const value = maxPicksDraft;
    if (
      loaded &&
      admin &&
      value != null &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 10 &&
      value !== wheelState.max_picks
    ) {
      client?.setMaxPicks(value);
    }
  });

  function syncSpin(next: WheelState, animate: boolean) {
    if (next.spun_at === lastSpunAt) return;
    lastSpunAt = next.spun_at;

    if (!next.spun_at || !next.winner_id) {
      winnerId = null;
      return;
    }
    const index = next.options.findIndex((o) => o.id === next.winner_id);
    if (index === -1) {
      winnerId = null;
      return;
    }
    const segment = 360 / next.options.length;
    const align = 360 - (index + 0.5) * segment;

    if (animate) {
      spinning = true;
      winnerId = null;
      spinDuration = SPIN_SECONDS;
      const turns = Math.max(3, next.spin_turns ?? 4);
      rotation = rotation - (rotation % 360) + 360 * turns + align;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        spinning = false;
        winnerId = next.winner_id;
      }, SPIN_SECONDS * 1000 + 150);
    } else {
      spinDuration = 0;
      rotation = align;
      winnerId = next.winner_id;
    }
  }

  function saveName() {
    const clean = draftName.trim();
    if (!clean) return;
    name = clean;
    editingName = false;
    localStorage.setItem(NAME_KEY, clean);
    client?.identify(name, colorForName(name));
  }

  function addPick() {
    const text = draftPick.trim();
    if (!text || !name || !client) return;
    if (myOptionCount >= wheelState.max_picks) {
      toast.info(
        `Max ${wheelState.max_picks} in the wheel per person — remove one first.`
      );
      return;
    }
    draftPick = "";
    client.addOption(name, text, myColor);
  }

  function spin() {
    if (options.length < 2 || spinning || !client) return;
    client.spin();
  }

  // --- History editing (admin) ---
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

  onMount(() => {
    name = localStorage.getItem(NAME_KEY) ?? "";
    draftName = name;

    if (!API_URL) {
      toast.error("Missing API URL (VITE_API_URL).");
      return;
    }

    const c = createRouletteClient(API_URL);
    client = c;

    const unsubs = [
      c.connected.subscribe((v) => (connected = v)),
      c.wheel.subscribe((w) => {
        wheelState = w;
        loaded = true;
        syncSpin(w, lastSpunAt !== undefined);
      }),
      c.history.subscribe((h) => (history = h)),
      c.presence.subscribe((p) => (presence = p)),
    ];
    const offError = c.onError((m) => toast.error(m));

    if (name) c.identify(name, colorForName(name));

    return () => {
      unsubs.forEach((u) => u());
      offError();
      clearTimeout(settleTimer);
      c.destroy();
    };
  });
</script>

<svelte:head>
  <title>Roulette</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="page">
  <div class="head">
    <Heading>Film roulette</Heading>
    {#if client}
      {#if connected}
        <Badge tone="positive" dot>live</Badge>
      {:else}
        <Badge tone="caution" dot>connecting…</Badge>
      {/if}
    {/if}
    {#if name && !editingName}
      <span class="you">
        you are
        <span class="dot" style:background={myColor}></span>
        <strong>{name}</strong>
        {#if admin}<Badge tone="brand">admin</Badge>{/if}
        <Button variant="ghost" size="sm" onclick={() => (editingName = true)}>
          change
        </Button>
      </span>
    {/if}
  </div>
  <p class="hint">
    Hidden page — share the URL. Brainstorm together on the left; each person
    sends {wheelState.max_picks === 1
      ? "one option"
      : `up to ${wheelState.max_picks} options`}
    to the wheel, and one spin decides for everyone.
  </p>

  <OnlineUsers users={presence} me={name} />

  {#if !name || editingName}
    <div class="join">
      <Card title="Who are you?">
        <form
          class="row"
          onsubmit={(e) => {
            e.preventDefault();
            saveName();
          }}
        >
          <Input
            label="Name"
            placeholder="e.g. Rafa"
            maxlength={24}
            bind:value={draftName}
          />
          <Button type="submit" disabled={!draftName.trim()}>Join</Button>
        </form>
      </Card>
    </div>
  {/if}

  <div class="layout">
    <section class="ideas">
      <Card
        title="Ideas"
        description="One shared draft — everyone types together, live."
      >
        {#if name && client}
          <IdeasEditor
            doc={client.doc}
            awareness={client.provider.awareness}
            {name}
            color={myColor}
          />
        {:else}
          <p class="muted">Set your name to join the draft.</p>
        {/if}
      </Card>

      <Card title="History" meta={`${history.length} watched`}>
        {#if history.length > 0}
          <ul class="history">
            {#each history as entry (entry.id)}
              <li>
                {#if editingId === entry.id}
                  <div class="edit-row">
                    <Input label="Title" maxlength={200} bind:value={editTitle} />
                    <label class="date">
                      Date
                      <input type="date" bind:value={editDate} />
                    </label>
                    <div class="edit-actions">
                      <Button size="sm" onclick={saveEdit}>Save</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onclick={() => (editingId = null)}>Cancel</Button
                      >
                    </div>
                  </div>
                {:else}
                  <span class="h-title">{entry.title}</span>
                  {#if entry.author}
                    <Badge tone="neutral">{entry.author}</Badge>
                  {/if}
                  <span class="h-date">{fmtDate(entry.drawn_at)}</span>
                  {#if admin}
                    <span class="h-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => startEdit(entry)}>Edit</Button
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
            title="No films yet"
            message="Spin the wheel and the winner lands here."
          />
        {/if}
      </Card>
    </section>

    <aside class="side">
      <Card title="Roulette" meta={`${options.length} in the wheel`}>
        <form
          class="row"
          onsubmit={(e) => {
            e.preventDefault();
            addPick();
          }}
        >
          <Input
            label="Your option"
            placeholder="The one you're sending to the wheel"
            maxlength={120}
            bind:value={draftPick}
            disabled={!name || myOptionCount >= wheelState.max_picks}
            hint={!name
              ? "Set your name first"
              : myOptionCount >= wheelState.max_picks
                ? "You're at your limit — remove one to swap"
                : undefined}
          />
          <Button
            type="submit"
            disabled={!name || !draftPick.trim() ||
              myOptionCount >= wheelState.max_picks}
          >
            Add
          </Button>
        </form>

        {#if options.length > 0}
          <ul class="options">
            {#each options as option, i (option.id)}
              <li>
                <span
                  class="swatch"
                  style:background={CHART_PALETTE[i % CHART_PALETTE.length]}
                ></span>
                <span class="text">{option.text}</span>
                <Badge tone={option.author === name ? "brand" : "neutral"}>
                  {option.author}
                </Badge>
                {#if option.author === name || admin}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    label={`Remove "${option.text}"`}
                    onclick={() => client?.removeOption(option.id)}>✕</Button
                  >
                {/if}
              </li>
            {/each}
          </ul>

          <div class="wheel-area">
            <Wheel {segments} {rotation} duration={spinDuration} />

            {#if winner && !spinning}
              <div class="winner" role="status">
                <span class="clap">🎬</span>
                <span class="winner-text">{winner.text}</span>
                <span class="winner-by">picked by {winner.author}</span>
              </div>
            {:else if spinning}
              <p class="spinning-label">Spinning…</p>
            {/if}

            <div class="row center">
              <Button onclick={spin} disabled={options.length < 2 || spinning}>
                Spin
              </Button>
              {#if winner && !spinning}
                <Button variant="ghost" onclick={() => client?.clearSpin()}>
                  Clear result
                </Button>
              {/if}
            </div>
            {#if options.length < 2}
              <p class="hint">Need at least 2 options to spin.</p>
            {/if}
          </div>
        {:else if loaded}
          <EmptyState
            title="The wheel is empty"
            message="Send your option in and it shows up here."
          />
        {/if}
      </Card>

      {#if admin}
        <Card title="Settings">
          <div class="settings">
            <NumberField
              label="Options per person"
              min={1}
              max={10}
              step={1}
              bind:value={maxPicksDraft}
              hint="How many options each person can send to the wheel."
            />
          </div>
        </Card>
      {/if}
    </aside>
  </div>
</div>

<Toaster />

<style lang="sass">
.page
  width: 100%
  padding: 28px var(--ss-container-px, 20px) 48px

.head
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: 10px

.you
  display: flex
  align-items: center
  gap: 6px
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  strong
    color: var(--ss-accent)

.dot
  width: 10px
  height: 10px
  border-radius: 50%
  border: 1px solid var(--ss-line-strong)

.hint
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 8px 0 16px

.muted
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 10px 0 0

.join
  max-width: 440px
  margin: 16px 0 20px

.layout
  display: grid
  grid-template-columns: minmax(0, 1fr) clamp(340px, 34vw, 460px)
  gap: 22px
  align-items: start
  margin-top: 18px
  @media (max-width: 980px)
    grid-template-columns: minmax(0, 1fr)

.ideas
  display: flex
  flex-direction: column
  gap: 22px

.side
  display: flex
  flex-direction: column
  gap: 22px

.row
  display: flex
  align-items: flex-start
  gap: 10px
  :global(label)
    flex: 1
  :global(button[type="submit"])
    margin-top: 22px
  &.center
    justify-content: center
    margin-top: 14px
    :global(button)
      margin-top: 0

.options
  list-style: none
  margin: 16px 0 0
  padding: 0
  li
    display: flex
    align-items: center
    gap: 10px
    padding: 7px 0
    border-bottom: 1px solid var(--ss-line)
    &:last-child
      border-bottom: none
  .text
    flex: 1
    min-width: 0
    overflow-wrap: anywhere

.swatch
  width: 10px
  height: 10px
  flex-shrink: 0
  border: 1px solid var(--ss-line-strong)

.history
  list-style: none
  margin: 4px 0 0
  padding: 0
  li
    display: flex
    align-items: center
    gap: 10px
    padding: 8px 0
    border-bottom: 1px solid var(--ss-line)
    &:last-child
      border-bottom: none
  .h-title
    flex: 1
    min-width: 0
    overflow-wrap: anywhere
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
    gap: 6px

.wheel-area
  display: flex
  flex-direction: column
  align-items: center
  padding: 18px 0 6px
  :global(svg)
    margin-bottom: 6px

.spinning-label
  color: var(--ss-fg-muted)
  font-family: var(--ss-font-mono)
  animation: blink 1s steps(2, start) infinite

.winner
  display: flex
  flex-direction: column
  align-items: center
  gap: 2px
  margin-top: 8px
  animation: pop 0.5s cubic-bezier(0.2, 1.6, 0.3, 1)

.clap
  font-size: 26px

.winner-text
  font-size: var(--ss-size-h3)
  font-family: var(--ss-font-display)
  color: var(--ss-accent)
  text-align: center

.winner-by
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

.settings
  max-width: 260px

@keyframes pop
  0%
    transform: scale(0.4)
    opacity: 0
  100%
    transform: scale(1)
    opacity: 1

@keyframes blink
  50%
    opacity: 0.35
</style>
