<script lang="ts">
  import { onMount } from "svelte";
  import {
    Badge,
    Button,
    Card,
    Container,
    EmptyState,
    Heading,
    Input,
    NumberField,
    Switch,
    Toaster,
    toast,
    CHART_PALETTE,
  } from "dssoca";
  import Wheel from "$lib/components/Roulette/Wheel.svelte";
  import {
    getRouletteBackend,
    DEFAULT_STATE,
    type RouletteOption,
    type RouletteState,
  } from "$lib/roulette";

  const backend = getRouletteBackend();
  const NAME_KEY = "passoca:roulette:name";
  const SPIN_SECONDS = 4;

  let name = $state("");
  let draftName = $state("");
  let editingName = $state(false);
  let draft = $state("");
  let options = $state<RouletteOption[]>([]);
  let config = $state<RouletteState>({ ...DEFAULT_STATE });
  let loaded = $state(false);
  let busy = $state(false);

  let rotation = $state(0);
  let spinDuration = $state(0);
  let spinning = $state(false);
  let winner = $state<RouletteOption | null>(null);
  let lastSpunAt: string | null | undefined = undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  // The wheel order must be identical on every device, so every client
  // animates to the same segment for a given winner_id.
  const picks = $derived(
    options
      .filter((o) => o.picked)
      .slice()
      .sort(
        (a, b) =>
          a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id)
      )
  );
  const myPickCount = $derived(
    picks.filter((o) => o.author === name).length
  );
  const segments = $derived(
    picks.map((p) => ({ id: p.id, label: p.text }))
  );

  async function refresh(animate = true) {
    try {
      const data = await backend.load();
      options = data.options;
      config = data.state;
      syncSpin(animate);
      loaded = true;
    } catch {
      toast.error("Couldn't load the roulette — try refreshing.");
    }
  }

  function syncSpin(animate: boolean) {
    if (config.spun_at === lastSpunAt) return;
    lastSpunAt = config.spun_at;

    if (!config.spun_at || !config.winner_id) {
      winner = null;
      return;
    }

    const index = picks.findIndex((p) => p.id === config.winner_id);
    if (index === -1) {
      // Winner no longer in the wheel (deleted/unpicked); just show it.
      winner = options.find((o) => o.id === config.winner_id) ?? null;
      return;
    }

    const segment = 360 / picks.length;
    const align = 360 - (index + 0.5) * segment;

    if (animate) {
      spinning = true;
      winner = null;
      spinDuration = SPIN_SECONDS;
      const turns = Math.max(3, config.spin_turns ?? 4);
      rotation = rotation - (rotation % 360) + 360 * turns + align;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        spinning = false;
        winner = picks[index] ?? null;
      }, SPIN_SECONDS * 1000 + 150);
    } else {
      spinDuration = 0;
      rotation = align;
      winner = picks[index] ?? null;
    }
  }

  async function run(action: () => Promise<void>) {
    busy = true;
    try {
      await action();
      await refresh();
    } catch {
      toast.error("Something went wrong — try again.");
    } finally {
      busy = false;
    }
  }

  function saveName() {
    const clean = draftName.trim();
    if (!clean) return;
    name = clean;
    editingName = false;
    localStorage.setItem(NAME_KEY, clean);
  }

  function addIdea() {
    const text = draft.trim();
    if (!text || !name) return;
    draft = "";
    run(() => backend.addOption(name, text));
  }

  function togglePick(option: RouletteOption, picked: boolean) {
    if (picked && myPickCount >= config.max_picks) {
      toast.info(
        `Max ${config.max_picks} in the roulette per person — unpick one first.`
      );
      refresh();
      return;
    }
    run(() => backend.setPicked(option.id, picked));
  }

  function spin() {
    if (picks.length < 2 || spinning) return;
    const winnerId = picks[Math.floor(Math.random() * picks.length)].id;
    // 4–6 turns with a random fraction so every spin lands differently.
    const turns = Math.round((4 + Math.random() * 2) * 100) / 100;
    run(() => backend.spin(winnerId, turns));
  }

  onMount(() => {
    name = localStorage.getItem(NAME_KEY) ?? "";
    draftName = name;
    refresh(false);

    const unsubscribe = backend.subscribe(() => refresh());
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    // Realtime needs the tables added to the supabase_realtime publication;
    // poll as insurance so the group never gets stuck on a stale list.
    const poll = backend.shared
      ? setInterval(() => refresh(), 15000)
      : undefined;

    return () => {
      unsubscribe();
      window.removeEventListener("focus", onFocus);
      clearInterval(poll);
      clearTimeout(settleTimer);
    };
  });
</script>

<svelte:head>
  <title>Roulette</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Container page>
  <div class="head">
    <Heading>Film roulette</Heading>
    {#if backend.shared}
      <Badge tone="positive" dot>shared</Badge>
    {:else}
      <Badge tone="caution" dot>local only</Badge>
    {/if}
  </div>
  <p class="hint">
    Hidden page — share the URL. Everyone throws in ideas, flags
    {config.max_picks === 1 ? "one" : `up to ${config.max_picks}`} for the
    wheel, and one spin decides for the whole group.
  </p>

  {#if !name || editingName}
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
  {:else}
    <p class="you">
      You are <strong>{name}</strong>
      <Button
        variant="ghost"
        size="sm"
        onclick={() => (editingName = true)}>change</Button
      >
    </p>
  {/if}

  <section>
    <Card title="Ideas" meta={`${options.length}`}>
      <form
        class="row"
        onsubmit={(e) => {
          e.preventDefault();
          addIdea();
        }}
      >
        <Input
          label="Suggestion"
          placeholder="A film, a genre, a wild card — anything"
          maxlength={80}
          bind:value={draft}
          disabled={!name}
          hint={name ? undefined : "Set your name first"}
        />
        <Button type="submit" disabled={!name || !draft.trim() || busy}>
          Add
        </Button>
      </form>

      {#if loaded && options.length === 0}
        <EmptyState
          title="Nothing yet"
          message="Start the brainstorm — add the first idea."
        />
      {/if}

      <ul class="ideas">
        {#each options as option (option.id)}
          <li>
            <span
              class="swatch"
              class:off={!option.picked}
              style:background={option.picked
                ? CHART_PALETTE[
                    picks.findIndex((p) => p.id === option.id) %
                      CHART_PALETTE.length
                  ]
                : "transparent"}
            ></span>
            <span class="text">{option.text}</span>
            <Badge tone={option.author === name ? "brand" : "neutral"}>
              {option.author}
            </Badge>
            <Switch
              label="in roulette"
              size="sm"
              checked={option.picked}
              disabled={option.author !== name || busy}
              onchange={(checked) => togglePick(option, checked)}
            />
            {#if option.author === name}
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                label={`Delete "${option.text}"`}
                disabled={busy}
                onclick={() => run(() => backend.removeOption(option.id))}
                >✕</Button
              >
            {/if}
          </li>
        {/each}
      </ul>
    </Card>
  </section>

  <section>
    <Card title="Roulette" meta={`${picks.length} in the wheel`}>
      {#if picks.length === 0}
        <EmptyState
          title="The wheel is empty"
          message={`Flip "in roulette" on an idea to add it here.`}
        />
      {:else}
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
            <Button
              onclick={spin}
              disabled={picks.length < 2 || spinning || busy}
            >
              Spin
            </Button>
            {#if winner && !spinning}
              <Button
                variant="ghost"
                onclick={() => run(() => backend.clearSpin())}
              >
                Clear result
              </Button>
            {/if}
          </div>
          {#if picks.length < 2}
            <p class="hint">Need at least 2 picks to spin.</p>
          {/if}
        </div>
      {/if}
    </Card>
  </section>

  <section>
    <Card title="Settings">
      <div class="settings">
        <NumberField
          label="Picks per person"
          min={1}
          max={10}
          step={1}
          value={config.max_picks}
          hint="How many of each person's ideas can enter the wheel."
          onchange={(e) => {
            const value = e.currentTarget.valueAsNumber;
            if (Number.isInteger(value) && value >= 1 && value <= 10) {
              run(() => backend.setMaxPicks(value));
            }
          }}
        />
      </div>
      {#if !backend.shared}
        <p class="hint">
          Supabase env vars are missing, so this is running in local-only mode:
          everything stays in this browser.
        </p>
      {/if}
    </Card>
  </section>
</Container>

<Toaster />

<style lang="sass">
.head
  display: flex
  align-items: center
  gap: 10px

.hint
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 8px 0 18px

.you
  margin: 4px 0 18px
  strong
    color: var(--ss-accent)

section
  margin-bottom: 22px

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

.ideas
  list-style: none
  margin: 16px 0 0
  padding: 0
  li
    display: flex
    align-items: center
    gap: 10px
    padding: 8px 0
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
  &.off
    border-style: dashed

.wheel-area
  display: flex
  flex-direction: column
  align-items: center
  padding: 10px 0
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
