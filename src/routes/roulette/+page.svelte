<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Badge, Button, Card, EmptyState, Kbd, Spinner, Toaster, toast, CHART_PALETTE } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import IdeasEditor from "$lib/components/Roulette/IdeasEditor.svelte";
  import PersonalIdeas from "$lib/components/Roulette/PersonalIdeas.svelte";
  import JoinCard from "$lib/components/Roulette/JoinCard.svelte";
  import HistoryCard from "$lib/components/Roulette/HistoryCard.svelte";
  import OptionsList from "$lib/components/Roulette/OptionsList.svelte";
  import WheelArea from "$lib/components/Roulette/WheelArea.svelte";
  import MediaSearchInput from "$lib/components/Roulette/MediaSearchInput.svelte";
  import MediaDetails from "$lib/components/Roulette/MediaDetails.svelte";
  import RulesModal from "$lib/components/Roulette/RulesModal.svelte";
  import MediaPoster from "$lib/components/Roulette/MediaPoster.svelte";
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
  let rulesOpen = $state(false);

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

  // Spin animation state (driven by the server's spun_at timestamp).
  const spin = new SpinController(SPIN_SECONDS);
  // Whether the wheel store has emitted a real server snapshot yet (its first
  // emission is always the local placeholder, fired synchronously on subscribe).
  let sawServerWheel = false;

  const winner = $derived(
    spin.winnerId ? options.find((o) => o.id === spin.winnerId) ?? null : null
  );

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

  function setMax(value: number) {
    if (value >= 1 && value <= 10) client?.setMaxPicks(value);
  }

  function openWinnerDetails() {
    if (winner?.tmdb_id && winner.media_type) {
      detailsFor = { media_type: winner.media_type, tmdb_id: winner.tmdb_id };
    }
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
    <div>
      <h1><span class="accent">{m.roulette_title()}.</span></h1>
      <div class="sub">
        <!-- Hovering the count smoothly expands into everyone's name + dot. -->
        <span class="online" tabindex="-1">
          <span>{m.roulette_online_count({ count: presence.length })}</span>
          <span class="names">
            {#each presence as p (p.name)}
              <span class="pname" class:me={p.name === name}>
                <span class="pdot" style:background={p.color ?? colorForName(p.name)}></span>
                {p.name}
              </span>
            {/each}
          </span>
        </span>
        · {connected ? m.roulette_live() : m.roulette_connecting()}
      </div>
    </div>
    <div class="head-actions">
      {#if name && !editingName}
        <span class="you">
          {m.roulette_you_are()}
          <span class="dot" style:background={myColor}></span>
          <strong>{name}</strong>
          {#if admin}<Badge tone="brand">{m.roulette_admin()}</Badge>{/if}
        </span>
        <Button variant="ghost" size="md" onclick={() => (editingName = true)}>
          {m.roulette_change()}
        </Button>
      {/if}
      <Button size="md" onclick={() => goto("/roulette/tierlist")}>
        {m.roulette_tierlist_link()}
      </Button>
      <Button size="md" onclick={() => (rulesOpen = true)}>
        {m.roulette_rules()}
        {#snippet trailing()}<Kbd size="md">?</Kbd>{/snippet}
      </Button>
    </div>
  </div>

  {#if !name || editingName}
    <JoinCard bind:draftName bind:draftPassword onjoin={saveName} />
  {/if}

  <div class="layout">
    <section class="main-col">
      <Card title={m.roulette_ideas()}>
        {#snippet action()}
          <span class="presence">
            {#each presence as p (p.name)}
              <span
                class="pdot"
                class:me={p.name === name}
                style:background={p.color ?? colorForName(p.name)}
                title={p.name}
              ></span>
            {/each}
            {m.roulette_editing_count({ count: presence.length })}
          </span>
        {/snippet}
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
        <Card title={m.roulette_personal()} description={m.roulette_personal_desc()}>
          {#snippet action()}
            <Button
              variant="ghost"
              size="md"
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
    </section>

    <aside class="side-col">
      <Card
        title={m.roulette_your_option()}
        meta={m.roulette_you_progress({
          count: myOptionCount,
          max: admin ? "∞" : wheelState.max_picks,
        })}
      >
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
      </Card>

      <Card title={m.roulette_card()} meta={m.roulette_in_wheel({ count: options.length })}>
        {#snippet action()}
          <span class="limit">
            {#if admin}
              <Button
                variant="ghost"
                size="md"
                iconOnly
                label="−"
                disabled={wheelState.max_picks <= 1}
                onclick={() => setMax(wheelState.max_picks - 1)}>−</Button
              >
            {/if}
            {m.roulette_limit_per_person({ max: wheelState.max_picks })}
            {#if admin}
              <Button
                variant="ghost"
                size="md"
                iconOnly
                label="+"
                disabled={wheelState.max_picks >= 10}
                onclick={() => setMax(wheelState.max_picks + 1)}>+</Button
              >
            {/if}
          </span>
        {/snippet}
        {#if options.length > 0}
          <OptionsList
            {options}
            me={name}
            {admin}
            onremove={(id) => client?.removeOption(id)}
            ondetails={(media) => (detailsFor = media)}
          />
        {:else if loaded}
          <EmptyState title={m.roulette_wheel_empty()} message={m.roulette_wheel_empty_msg()} />
        {:else}
          <div class="loading">
            <Spinner label={m.roulette_media_loading()} showLabel />
          </div>
        {/if}
        {#snippet footer()}
          <div class="spin-foot">
            {#if winner && !spin.spinning}
              <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_tabindex
                   (role/tabindex/handlers are applied together when the winner has media) -->
              <div
                class="winner-row"
                class:clickable={!!winner.tmdb_id}
                role={winner.tmdb_id ? "button" : undefined}
                tabindex={winner.tmdb_id ? 0 : undefined}
                onclick={openWinnerDetails}
                onkeydown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openWinnerDetails();
                  }
                }}
              >
                <MediaPoster path={winner.poster_path} size="w92" alt="" />
                <div class="info">
                  <div class="t">
                    {winner.text}{#if winner.media_year}&nbsp;<span class="y">({winner.media_year})</span>{/if}
                  </div>
                  <div class="bysub">{m.roulette_picked_by({ name: winner.author ?? "" })}</div>
                </div>
                <Button
                  variant="ghost"
                  size="md"
                  onclick={(e) => {
                    e.stopPropagation();
                    client?.clearSpin();
                  }}
                >
                  {m.roulette_clear_result()}
                </Button>
              </div>
            {/if}
            <Button
              variant="primary"
              fullWidth
              disabled={options.length === 0}
              loading={spin.spinning}
              loadingLabel={m.roulette_spinning()}
              onclick={() => (spin.previewOpen = true)}
            >
              {spin.spinning ? m.roulette_spinning() : m.roulette_open_wheel()}
            </Button>
            <p class="muted center">
              {options.length < 2 ? m.roulette_need_two() : m.roulette_spin_caption()}
            </p>
          </div>
        {/snippet}
      </Card>

      <HistoryCard {history} {admin} {client} ondetails={(media) => (detailsFor = media)} />
    </aside>
  </div>

  <WheelArea
    {options}
    {spin}
    {winner}
    {admin}
    canSpin={options.length >= 2}
    onspin={requestSpin}
    ondeny={() => client?.deny()}
    ondetails={(media) => (detailsFor = media)}
  />

  {#if rulesOpen}
    <RulesModal onclose={() => (rulesOpen = false)} />
  {/if}

  {#if detailsFor && API_URL}
    <MediaDetails
      apiUrl={API_URL}
      mediaType={detailsFor.media_type}
      tmdbId={detailsFor.tmdb_id}
      onclose={() => (detailsFor = null)}
    />
  {/if}
</div>

<Toaster />

<style lang="sass">
.page
  width: 100%
  min-height: 100vh
  padding: 16px 20px 48px
  background: var(--ss-bg)

.head
  display: flex
  align-items: flex-end
  justify-content: space-between
  gap: 24px
  margin-bottom: 12px
  flex-wrap: wrap
  h1
    font-family: var(--ss-font-display)
    font-weight: 400
    font-size: 32px
    line-height: 1
    margin: 0
    letter-spacing: -0.015em
    text-shadow: 3px 3px var(--ss-bg)
  .accent
    position: relative
    z-index: 0
    &::before
      content: ""
      position: absolute
      left: -2%
      right: -6%
      top: 70%
      height: 22%
      background: var(--ss-accent)
      opacity: 0.9
      z-index: -1

.sub
  display: flex
  align-items: center
  gap: 5px
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-xs, 12px)
  margin-top: 6px
  font-family: var(--ss-font-mono)

// "{n} online" grows into the full list of names on hover.
.online
  display: inline-flex
  align-items: center
  gap: 0
  cursor: default
  .names
    display: inline-flex
    align-items: center
    gap: 8px
    max-width: 0
    opacity: 0
    overflow: hidden
    white-space: nowrap
    transition: max-width var(--ss-dur-slow, 350ms) var(--ss-ease), opacity var(--ss-dur, 250ms) var(--ss-ease), margin-left var(--ss-dur-slow, 350ms) var(--ss-ease)
  &:hover .names,
  &:focus-within .names
    max-width: 60vw
    opacity: 1
    margin-left: 8px

.pname
  display: inline-flex
  align-items: center
  gap: 4px
  &.me
    color: var(--ss-accent)

.pdot
  display: inline-block
  width: 7px
  height: 7px
  flex: none
  border: 1px solid var(--ss-line-strong)
  &.me
    outline: 1px solid var(--ss-accent)
    outline-offset: 1px

.head-actions
  display: flex
  gap: 6px
  align-items: center
  flex-wrap: wrap

.you
  display: flex
  align-items: center
  gap: 6px
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  strong
    color: var(--ss-accent)

.dot
  width: 8px
  height: 8px
  border: 1px solid var(--ss-line-strong)

.presence
  display: inline-flex
  align-items: center
  gap: 5px
  color: var(--ss-fg-muted)
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)

.limit
  display: inline-flex
  align-items: center
  gap: 4px
  color: var(--ss-fg-muted)
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)

.layout
  display: flex
  gap: 12px
  align-items: flex-start
  @media (max-width: 900px)
    flex-direction: column

.main-col
  flex: 7
  min-width: 0
  display: flex
  flex-direction: column
  gap: 12px

.side-col
  flex: 3
  min-width: 230px
  display: flex
  flex-direction: column
  gap: 12px
  @media (max-width: 900px)
    width: 100%

.muted
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 0

.teaser
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.spin-foot
  display: flex
  flex-direction: column
  gap: 8px
  width: 100%

.winner-row
  display: flex
  align-items: center
  gap: 8px
  padding: 5px 6px
  border: 1px solid color-mix(in srgb, var(--ss-accent) 40%, transparent)
  background: color-mix(in srgb, var(--ss-accent) 8%, transparent)
  &.clickable
    cursor: pointer
    &:hover
      border-color: var(--ss-accent)
    &:focus-visible
      outline: 2px solid var(--ss-accent)
      outline-offset: 2px
  :global(.poster)
    width: 26px
  .info
    flex: 1
    min-width: 0
  .t
    font-size: 11.5px
    color: var(--ss-fg)
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    .y
      color: var(--ss-fg-faint)
  .bysub
    font-size: 10px
    color: var(--ss-fg-faint)

.loading
  display: flex
  justify-content: center
  padding: 16px 0

.center
  text-align: center
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  color: var(--ss-fg-faint)
</style>
