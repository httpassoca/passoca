<script lang="ts">
  import { onMount } from "svelte";
  import {
    Badge,
    Button,
    Card,
    EmptyState,
    Heading,
    NumberField,
    Toaster,
    toast,
    CHART_PALETTE,
  } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import IdeasEditor from "$lib/components/Roulette/IdeasEditor.svelte";
  import OnlineUsers from "$lib/components/Roulette/OnlineUsers.svelte";
  import PersonalIdeas from "$lib/components/Roulette/PersonalIdeas.svelte";
  import JoinCard from "$lib/components/Roulette/JoinCard.svelte";
  import HistoryCard from "$lib/components/Roulette/HistoryCard.svelte";
  import OptionsList from "$lib/components/Roulette/OptionsList.svelte";
  import WheelArea from "$lib/components/Roulette/WheelArea.svelte";
  import MediaSearchInput from "$lib/components/Roulette/MediaSearchInput.svelte";
  import MediaDetails from "$lib/components/Roulette/MediaDetails.svelte";
  import {
    createRouletteClient,
    colorForName,
    fetchMediaStatus,
    SpinController,
    DEFAULT_WHEEL,
    NAME_KEY,
    PW_KEY,
    type RouletteClient,
    type WheelState,
    type HistoryEntry,
    type MediaKey,
    type MediaPick,
    type Presence,
  } from "$lib/roulette";

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
  let draftPassword = $state("");
  let editingName = $state(false);
  let personalOpen = $state(false);
  let personalTeaser = $state("");

  // TMDB integration: search only lights up when the API has a token.
  let mediaEnabled = $state(false);
  let detailsFor = $state<MediaKey | null>(null);

  const myColor = $derived(name ? colorForName(name) : CHART_PALETTE[0]);
  // Admin is server-confirmed (password-verified identify), never inferred
  // from the name alone.
  let admin = $state(false);

  const options = $derived(wheelState.options);
  const myOptionCount = $derived(options.filter((o) => o.author === name).length);
  // The admin curates the wheel and has no per-person limit.
  const atLimit = $derived(!admin && myOptionCount >= wheelState.max_picks);
  const segments = $derived(options.map((o) => ({ id: o.id, label: o.text })));

  // Spin animation state (driven by the server's spun_at timestamp).
  const spin = new SpinController(SPIN_SECONDS);
  // Whether the wheel store has emitted a real server snapshot yet (its first
  // emission is always the local placeholder, fired synchronously on subscribe).
  let sawServerWheel = false;

  const winner = $derived(
    spin.winnerId ? options.find((o) => o.id === spin.winnerId) ?? null : null
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

  function saveName() {
    const clean = draftName.trim();
    if (!clean) return;
    name = clean;
    editingName = false;
    localStorage.setItem(NAME_KEY, clean);
    client?.identify(name, colorForName(name), draftPassword || undefined);
  }

  function addPick(text: string, media: MediaPick | null) {
    if (!text || !name || !client) return;
    if (atLimit) {
      toast.info(m.roulette_max_toast({ max: wheelState.max_picks }));
      return;
    }
    client.addOption(name, text, myColor, media);
  }

  function requestSpin() {
    if (options.length < 2 || spin.spinning || !client) return;
    client.spin();
  }

  onMount(() => {
    name = localStorage.getItem(NAME_KEY) ?? "";
    draftName = name;
    draftPassword = localStorage.getItem(PW_KEY) ?? "";

    if (!API_URL) {
      toast.error(m.roulette_missing_api());
      return;
    }

    const c = createRouletteClient(API_URL);
    client = c;

    fetchMediaStatus(API_URL).then((enabled) => (mediaEnabled = enabled));

    const unsubs = [
      c.connected.subscribe((v) => {
        connected = v;
        // The server forgets presence on disconnect — re-identify on every
        // (re)connect so name and admin status survive reconnects.
        if (v && name) c.identify(name, colorForName(name), draftPassword || undefined);
      }),
      c.wheel.subscribe((w) => {
        // The store emits its local DEFAULT_WHEEL placeholder synchronously on
        // subscribe; if it counted as the "first snapshot", the real server
        // state (carrying the last spun_at) would replay the spin animation
        // for every visitor. Only server snapshots may drive the wheel.
        if (!sawServerWheel) {
          sawServerWheel = true;
          return;
        }
        wheelState = w;
        loaded = true;
        spin.sync(w, spin.lastSpunAt !== undefined);
      }),
      c.history.subscribe((h) => (history = h)),
      c.presence.subscribe((p) => (presence = p)),
      c.personal.subscribe((p) => (personalTeaser = p)),
      c.identity.subscribe((id) => {
        if (!id) return;
        if (!id.ok) {
          // Wrong admin password: back to the join form.
          admin = false;
          name = "";
          localStorage.removeItem(NAME_KEY);
          localStorage.removeItem(PW_KEY);
          return;
        }
        admin = id.admin;
        if (id.admin && draftPassword) localStorage.setItem(PW_KEY, draftPassword);
      }),
    ];
    const offError = c.onError((msg) => toast.error(msg));

    if (name) c.identify(name, colorForName(name), draftPassword || undefined);

    return () => {
      unsubs.forEach((u) => u());
      offError();
      spin.destroy();
      c.destroy();
    };
  });
</script>

<svelte:head>
  <title>{m.roulette_title()}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="page">
  <div class="head">
    <Heading>{m.roulette_title()}</Heading>
    <div class="head-side">
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
  </div>
  <p class="hint">
    {wheelState.max_picks === 1
      ? m.roulette_hint_one()
      : m.roulette_hint_many({ max: wheelState.max_picks })}
  </p>

  <OnlineUsers users={presence} me={name} />

  {#if !name || editingName}
    <JoinCard bind:draftName bind:draftPassword onjoin={saveName} />
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
          {#snippet action()}
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={personalOpen}
              onclick={() => (personalOpen = !personalOpen)}
            >
              {personalOpen ? m.roulette_hide() : m.roulette_show()}
            </Button>
          {/snippet}
          {#if personalOpen}
            <PersonalIdeas {client} />
          {:else}
            <p class="muted teaser">
              {personalTeaser.trim().split("\n")[0] || m.roulette_preview_empty()}
            </p>
          {/if}
        </Card>
      {/if}

      <HistoryCard {history} {admin} {client} ondetails={(media) => (detailsFor = media)} />
    </section>

    <aside class="side">
      <Card title={m.roulette_card()} meta={m.roulette_in_wheel({ count: options.length })}>
        <MediaSearchInput
          apiUrl={API_URL ?? ""}
          enabled={mediaEnabled}
          disabled={!name || atLimit}
          hint={!name
            ? m.roulette_set_name_first()
            : atLimit
              ? m.roulette_at_limit()
              : undefined}
          onadd={addPick}
        />

        {#if options.length > 0}
          <OptionsList
            {options}
            me={name}
            {admin}
            onremove={(id) => client?.removeOption(id)}
            ondetails={(media) => (detailsFor = media)}
          />

          <WheelArea
            {segments}
            {spin}
            {winner}
            optionCount={options.length}
            onspin={requestSpin}
            onclear={() => client?.clearSpin()}
            ondetails={(media) => (detailsFor = media)}
          />
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

{#if detailsFor && API_URL}
  <MediaDetails
    apiUrl={API_URL}
    mediaType={detailsFor.media_type}
    tmdbId={detailsFor.tmdb_id}
    onclose={() => (detailsFor = null)}
  />
{/if}

<Toaster />

<style lang="sass">
.page
  width: 100%
  padding: var(--ss-container-page-py, 28px) var(--ss-container-px, 20px) var(--ss-s-12, 48px)

.head
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: var(--ss-gap, 10px)

// Status + identity live on the right edge of the page head.
.head-side
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: var(--ss-gap, 10px)
  margin-left: auto

.you
  display: flex
  align-items: center
  gap: var(--ss-gap-sm, 6px)
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

.layout
  display: grid
  grid-template-columns: minmax(0, 1fr) clamp(340px, 34vw, 460px)
  gap: var(--ss-block-gap, 22px)
  align-items: start
  margin-top: var(--ss-s-4, 18px)
  @media (max-width: 980px)
    grid-template-columns: minmax(0, 1fr)

.ideas
  display: flex
  flex-direction: column
  gap: var(--ss-block-gap, 22px)

.side
  display: flex
  flex-direction: column
  gap: var(--ss-block-gap, 22px)

.settings
  max-width: 260px
</style>
