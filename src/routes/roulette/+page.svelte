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
    Textarea,
    Toaster,
    toast,
    CHART_PALETTE,
  } from "dssoca";
  import Wheel from "$lib/components/Roulette/Wheel.svelte";
  import {
    createRouletteBackend,
    DEFAULT_WHEEL,
    type RouletteBackend,
    type RouletteDoc,
  } from "$lib/roulette";

  const NAME_KEY = "passoca:roulette:name";
  const SPIN_SECONDS = 4;
  const PAD_DEBOUNCE_MS = 700;

  let backend = $state<RouletteBackend | null>(null);
  let doc = $state<RouletteDoc>({ pads: {}, wheel: { ...DEFAULT_WHEEL } });
  let loaded = $state(false);
  let busy = $state(false);

  let name = $state("");
  let draftName = $state("");
  let editingName = $state(false);
  let draftPick = $state("");

  // My pad is edited locally and pushed debounced; remote refreshes must not
  // clobber it mid-keystroke.
  let myPadText = $state("");
  let padFocused = false;
  let padDirty = false;
  let padTimer: ReturnType<typeof setTimeout> | undefined;

  let rotation = $state(0);
  let spinDuration = $state(0);
  let spinning = $state(false);
  let winnerId = $state<string | null>(null);
  let lastSpunAt: string | null | undefined = undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let loadErrorShown = false;

  const wheel = $derived(doc.wheel);
  const options = $derived(wheel.options);
  const myOptionCount = $derived(
    options.filter((o) => o.author === name).length
  );
  const segments = $derived(options.map((o) => ({ id: o.id, label: o.text })));
  const otherPads = $derived(
    Object.entries(doc.pads)
      .filter(([author]) => author !== name)
      .sort(([a], [b]) => a.localeCompare(b))
  );
  const winner = $derived(
    winnerId ? options.find((o) => o.id === winnerId) ?? null : null
  );

  function applyDoc(next: RouletteDoc, animate = true) {
    doc = next;
    if (!padFocused && !padDirty) myPadText = next.pads[name]?.text ?? "";
    syncSpin(animate);
  }

  function syncSpin(animate: boolean) {
    if (wheel.spun_at === lastSpunAt) return;
    lastSpunAt = wheel.spun_at;

    if (!wheel.spun_at || !wheel.winner_id) {
      winnerId = null;
      return;
    }

    const index = options.findIndex((o) => o.id === wheel.winner_id);
    if (index === -1) {
      winnerId = null;
      return;
    }

    const segment = 360 / options.length;
    const align = 360 - (index + 0.5) * segment;

    if (animate) {
      spinning = true;
      winnerId = null;
      spinDuration = SPIN_SECONDS;
      const turns = Math.max(3, wheel.spin_turns ?? 4);
      rotation = rotation - (rotation % 360) + 360 * turns + align;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        spinning = false;
        winnerId = wheel.winner_id;
      }, SPIN_SECONDS * 1000 + 150);
    } else {
      spinDuration = 0;
      rotation = align;
      winnerId = wheel.winner_id;
    }
  }

  async function refresh(animate = true) {
    if (!backend) return;
    try {
      applyDoc(await backend.load(), animate);
      loaded = true;
      loadErrorShown = false;
    } catch {
      // The poll retries forever; don't toast every cycle.
      if (!loadErrorShown) {
        loadErrorShown = true;
        toast.error("Can't reach the roulette — retrying in the background.");
      }
    }
  }

  async function run(action: () => Promise<RouletteDoc>) {
    if (!backend) return;
    busy = true;
    try {
      applyDoc(await action());
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
    myPadText = doc.pads[name]?.text ?? "";
  }

  function onPadInput() {
    padDirty = true;
    clearTimeout(padTimer);
    padTimer = setTimeout(flushPad, PAD_DEBOUNCE_MS);
  }

  async function flushPad() {
    if (!backend || !name || !padDirty) return;
    padDirty = false;
    try {
      applyDoc(await backend.savePad(name, myPadText));
    } catch {
      padDirty = true; // retry on the next input or blur
    }
  }

  function addPick() {
    const text = draftPick.trim();
    if (!text || !name || !backend) return;
    if (myOptionCount >= wheel.max_picks) {
      toast.info(
        `Max ${wheel.max_picks} in the wheel per person — remove one first.`
      );
      return;
    }
    draftPick = "";
    run(() => backend!.addOption(name, text));
  }

  function spin() {
    if (options.length < 2 || spinning || !backend) return;
    const winner = options[Math.floor(Math.random() * options.length)];
    // 4–6 turns with a random fraction so every spin lands differently.
    const turns = Math.round((4 + Math.random() * 2) * 100) / 100;
    run(() => backend!.spin(winner.id, turns));
  }

  onMount(() => {
    name = localStorage.getItem(NAME_KEY) ?? "";
    draftName = name;

    let cleanup: (() => void) | undefined;
    let disposed = false;

    (async () => {
      backend = await createRouletteBackend();
      if (disposed) return;
      await refresh(false);

      const unsubscribe = backend.subscribe(() => refresh());
      const onFocus = () => refresh();
      window.addEventListener("focus", onFocus);
      cleanup = () => {
        unsubscribe();
        window.removeEventListener("focus", onFocus);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
      clearTimeout(padTimer);
      clearTimeout(settleTimer);
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
    {#if backend}
      {#if backend.shared}
        <Badge tone="positive" dot>shared</Badge>
      {:else}
        <Badge tone="caution" dot>local only</Badge>
      {/if}
    {/if}
    {#if name && !editingName}
      <span class="you">
        you are <strong>{name}</strong>
        <Button variant="ghost" size="sm" onclick={() => (editingName = true)}>
          change
        </Button>
      </span>
    {/if}
  </div>
  <p class="hint">
    Hidden page — share the URL. Brainstorm together on the left; each person
    sends {wheel.max_picks === 1 ? "one option" : `up to ${wheel.max_picks} options`}
    to the wheel, and one spin decides for everyone.
  </p>

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
        description="Everyone gets a pad. Write anything — titles, genres, vibes — and watch the others think."
      >
        {#if name}
          <div class="pad">
            <Textarea
              label={`${name} (you)`}
              placeholder="Brainstorm here…"
              rows={6}
              autosize
              maxRows={16}
              maxlength={8000}
              bind:value={myPadText}
              oninput={onPadInput}
              onfocus={() => (padFocused = true)}
              onblur={() => {
                padFocused = false;
                flushPad();
              }}
            />
          </div>
        {:else}
          <p class="muted">Set your name to get a pad.</p>
        {/if}

        {#each otherPads as [author, pad] (author)}
          <div class="pad">
            <Textarea label={author} value={pad.text} rows={3} autosize maxRows={16} readonly />
          </div>
        {/each}

        {#if loaded && otherPads.length === 0}
          <p class="muted">No one else is here yet — share the URL.</p>
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
            disabled={!name || myOptionCount >= wheel.max_picks}
            hint={!name
              ? "Set your name first"
              : myOptionCount >= wheel.max_picks
                ? "You're at your limit — remove one to swap"
                : undefined}
          />
          <Button
            type="submit"
            disabled={!name || !draftPick.trim() || busy ||
              myOptionCount >= wheel.max_picks}
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
                {#if option.author === name}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    label={`Remove "${option.text}"`}
                    disabled={busy}
                    onclick={() => run(() => backend!.removeOption(option.id))}
                    >✕</Button
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
              <Button
                onclick={spin}
                disabled={options.length < 2 || spinning || busy}
              >
                Spin
              </Button>
              {#if winner && !spinning}
                <Button
                  variant="ghost"
                  onclick={() => run(() => backend!.clearSpin())}
                >
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

      <Card title="Settings">
        <div class="settings">
          <NumberField
            label="Options per person"
            min={1}
            max={10}
            step={1}
            value={wheel.max_picks}
            hint="How many options each person can send to the wheel."
            onchange={(e) => {
              const value = e.currentTarget.valueAsNumber;
              if (Number.isInteger(value) && value >= 1 && value <= 10) {
                run(() => backend!.setMaxPicks(value));
              }
            }}
          />
        </div>
        {#if backend && !backend.shared}
          <p class="hint">
            No storage configured on the server, so this is running in
            local-only mode: everything stays in this browser.
          </p>
        {/if}
      </Card>
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
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  strong
    color: var(--ss-accent)

.hint
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 8px 0 20px

.muted
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 10px 0 0

.join
  max-width: 440px
  margin-bottom: 20px

.layout
  display: grid
  grid-template-columns: minmax(0, 1fr) clamp(340px, 34vw, 460px)
  gap: 22px
  align-items: start
  @media (max-width: 980px)
    grid-template-columns: minmax(0, 1fr)

.side
  display: flex
  flex-direction: column
  gap: 22px

.pad
  margin-bottom: 14px
  &:last-child
    margin-bottom: 0

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
