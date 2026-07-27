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
  import confetti from "canvas-confetti";
  import { m } from "$lib/paraglide/messages";
  import Wheel from "$lib/components/Roulette/Wheel.svelte";
  import IdeasEditor from "$lib/components/Roulette/IdeasEditor.svelte";
  import OnlineUsers from "$lib/components/Roulette/OnlineUsers.svelte";
  import PersonalIdeas from "$lib/components/Roulette/PersonalIdeas.svelte";
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
  // The admin curates the wheel and has no per-person limit.
  const atLimit = $derived(!admin && myOptionCount >= wheelState.max_picks);
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

  // Fullscreen takeover: only for spins witnessed live (not for late joiners
  // who load an already-settled winner). Dismissing is local to this client.
  let overlayDismissed = $state(true);
  const overlayVisible = $derived(spinning || (!!winner && !overlayDismissed));
  let confettiFiredFor: string | null = null;

  function fireConfetti() {
    const base = { zIndex: 1001, spread: 75, ticks: 240 };
    confetti({ ...base, particleCount: 140, origin: { x: 0.5, y: 0.55 } });
    setTimeout(() => confetti({ ...base, particleCount: 70, angle: 55, origin: { x: 0.05, y: 0.9 } }), 250);
    setTimeout(() => confetti({ ...base, particleCount: 70, angle: 125, origin: { x: 0.95, y: 0.9 } }), 450);
  }

  $effect(() => {
    if (winner && !spinning && !overlayDismissed && lastSpunAt && confettiFiredFor !== lastSpunAt) {
      confettiFiredFor = lastSpunAt;
      fireConfetti();
    }
  });

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
      overlayDismissed = false;
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
    if (atLimit) {
      toast.info(m.roulette_max_toast({ max: wheelState.max_picks }));
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
  let historyOpen = $state(false);
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
      toast.error(m.roulette_missing_api());
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
  <title>{m.roulette_title()}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape" && overlayVisible && !spinning) overlayDismissed = true;
  }}
/>

<div class="page">
  <div class="head">
    <Heading>{m.roulette_title()}</Heading>
    {#if client}
      {#if connected}
        <Badge tone="positive" dot>{m.roulette_live()}</Badge>
      {:else}
        <Badge tone="caution" dot>{m.roulette_connecting()}</Badge>
      {/if}
    {/if}
    {#if name && !editingName}
      <span class="you">
        {m.roulette_you_are()}
        <span class="dot" style:background={myColor}></span>
        <strong>{name}</strong>
        {#if admin}<Badge tone="brand">{m.roulette_admin()}</Badge>{/if}
        <Button variant="ghost" size="sm" onclick={() => (editingName = true)}>
          {m.roulette_change()}
        </Button>
      </span>
    {/if}
  </div>
  <p class="hint">
    {wheelState.max_picks === 1
      ? m.roulette_hint_one()
      : m.roulette_hint_many({ max: wheelState.max_picks })}
  </p>

  <OnlineUsers users={presence} me={name} />

  {#if !name || editingName}
    <div class="join">
      <Card title={m.roulette_who_are_you()}>
        <form
          class="row"
          onsubmit={(e) => {
            e.preventDefault();
            saveName();
          }}
        >
          <Input
            label={m.roulette_name()}
            placeholder={m.roulette_name_placeholder()}
            maxlength={24}
            bind:value={draftName}
          />
          <Button type="submit" disabled={!draftName.trim()}>{m.roulette_join()}</Button>
        </form>
      </Card>
    </div>
  {/if}

  <div class="layout">
    <section class="ideas">
      <Card
        title={m.roulette_ideas()}
        description={m.roulette_ideas_desc()}
      >
        {#if name && client}
          <IdeasEditor
            doc={client.doc}
            awareness={client.provider.awareness}
            {name}
            color={myColor}
          />
        {:else}
          <p class="muted">{m.roulette_ideas_join()}</p>
        {/if}
      </Card>

      {#if name && client}
        <Card
          title={m.roulette_personal()}
          description={m.roulette_personal_desc()}
        >
          <PersonalIdeas {client} />
        </Card>
      {/if}

      <Card title={m.roulette_history()} meta={m.roulette_watched({ count: history.length })}>
        {#snippet action()}
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={historyOpen}
            onclick={() => (historyOpen = !historyOpen)}
          >
            {historyOpen ? m.roulette_hide() : m.roulette_show()}
          </Button>
        {/snippet}
        {#if !historyOpen}
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
    </section>

    <aside class="side">
      <Card title={m.roulette_card()} meta={m.roulette_in_wheel({ count: options.length })}>
        <form
          class="row"
          onsubmit={(e) => {
            e.preventDefault();
            addPick();
          }}
        >
          <Input
            label={m.roulette_your_option()}
            placeholder={m.roulette_option_placeholder()}
            maxlength={120}
            bind:value={draftPick}
            disabled={!name || atLimit}
            hint={!name
              ? m.roulette_set_name_first()
              : atLimit
                ? m.roulette_at_limit()
                : undefined}
          />
          <Button type="submit" disabled={!name || !draftPick.trim() || atLimit}>
            {m.roulette_add()}
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
                    label={m.roulette_remove_option({ text: option.text })}
                    onclick={() => client?.removeOption(option.id)}>✕</Button
                  >
                {/if}
              </li>
            {/each}
          </ul>

          <!-- The same node expands to a fixed fullscreen takeover during a
               witnessed spin, so the CSS rotation transition never restarts. -->
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
               (backdrop click is a pointer shortcut; keyboard users have Escape and the Close button) -->
          <div
            class="wheel-area"
            class:takeover={overlayVisible}
            onclick={(e) => {
              if (overlayVisible && !spinning && e.target === e.currentTarget)
                overlayDismissed = true;
            }}
          >
            <Wheel {segments} {rotation} duration={spinDuration} />

            {#if winner && !spinning}
              <div class="winner" role="status">
                <span class="clap">🎬</span>
                <span class="winner-text">{winner.text}</span>
                <span class="winner-by">{m.roulette_picked_by({ name: winner.author ?? "" })}</span>
              </div>
            {:else if spinning}
              <p class="spinning-label">{m.roulette_spinning()}</p>
            {/if}

            <div class="row center">
              {#if overlayVisible}
                {#if winner && !spinning}
                  <Button onclick={() => (overlayDismissed = true)}>
                    {m.roulette_close()}
                  </Button>
                {/if}
              {:else}
                <Button onclick={spin} disabled={options.length < 2 || spinning}>
                  {m.roulette_spin()}
                </Button>
                {#if winner && !spinning}
                  <Button variant="ghost" onclick={() => client?.clearSpin()}>
                    {m.roulette_clear_result()}
                  </Button>
                {/if}
              {/if}
            </div>
            {#if options.length < 2 && !overlayVisible}
              <p class="hint">{m.roulette_need_two()}</p>
            {/if}
          </div>
        {:else if loaded}
          <EmptyState
            title={m.roulette_wheel_empty()}
            message={m.roulette_wheel_empty_msg()}
          />
        {/if}
      </Card>

      {#if admin}
        <Card title={m.roulette_settings()}>
          <div class="settings">
            <NumberField
              label={m.roulette_max_picks()}
              min={1}
              max={10}
              step={1}
              bind:value={maxPicksDraft}
              hint={m.roulette_max_picks_hint()}
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
  // Fullscreen takeover while a witnessed spin runs / the winner shows.
  &.takeover
    position: fixed
    inset: 0
    z-index: 1000
    justify-content: center
    padding: 24px
    background: color-mix(in srgb, var(--ss-bg) 92%, transparent)
    backdrop-filter: blur(3px)
    :global(svg)
      width: min(78vmin, 640px)
      margin-bottom: 14px
    .winner-text
      font-size: clamp(28px, 6vmin, 52px)
    .winner-by
      font-size: var(--ss-size-md, 1rem)
    .clap
      font-size: 40px
    .spinning-label
      font-size: var(--ss-size-h3)

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
