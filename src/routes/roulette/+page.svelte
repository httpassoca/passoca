<script lang="ts">
  import { onMount } from "svelte";
  import { Toaster, toast, CHART_PALETTE } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import "./hub.css";
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
  const segments = $derived(options.map((o) => ({ id: o.id, label: o.text })));

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

<div class="page hub">
  <div class="hub-pageHead">
    <div>
      <h1><span class="accent">{m.roulette_title()}.</span></h1>
      <div class="sub">
        {m.roulette_online_count({ count: presence.length })}
        · {connected ? m.roulette_live() : m.roulette_connecting()}
        · {mediaEnabled ? m.roulette_tmdb_up() : m.roulette_tmdb_off()}
      </div>
    </div>
    <div class="head-actions">
      {#if name && !editingName}
        <span class="you">
          {m.roulette_you_are()}
          <span class="dot" style:background={myColor}></span>
          <strong>{name}</strong>
          {#if admin}<span class="hub-badge up">{m.roulette_admin()}</span>{/if}
        </span>
        <button class="hub-btn ghost" onclick={() => (editingName = true)}>
          {m.roulette_change()}
        </button>
      {/if}
      <button class="hub-btn" onclick={() => (rulesOpen = true)}>
        {m.roulette_rules()} <span class="kbd">?</span>
      </button>
    </div>
  </div>

  {#if !name || editingName}
    <JoinCard bind:draftName bind:draftPassword onjoin={saveName} />
  {/if}

  <div class="layout">
    <section class="main-col">
      <div class="hub-panel">
        <div class="hub-panel-head">
          <div class="title">{m.roulette_ideas()}</div>
          <div class="meta">
            {#each presence as p (p.name)}
              <span
                class="pdot"
                class:me={p.name === name}
                style:background={p.color ?? colorForName(p.name)}
                title={p.name}
              ></span>
            {/each}
            {m.roulette_editing_count({ count: presence.length })}
          </div>
        </div>
        <div class="hub-panel-body">
          {#if name && client}
            <IdeasEditor
              doc={client.doc}
              awareness={client.provider.awareness}
              {name}
              color={myColor}
            />
          {:else}
            <p class="hs-caption">{m.roulette_ideas_join()}</p>
          {/if}
        </div>
      </div>

      {#if name && client}
        <div class="hub-panel">
          <button
            class="hub-panel-head"
            aria-expanded={personalOpen}
            onclick={() => (personalOpen = !personalOpen)}
          >
            <span class="title">{m.roulette_personal()}</span>
            <span class="meta">{m.roulette_personal_desc()} · {personalOpen ? "▾" : "▸"}</span>
          </button>
          <div class="hub-panel-body">
            {#if personalOpen}
              <PersonalIdeas {client} />
            {:else}
              <p class="hs-caption teaser">
                {personalTeaser.trim().split("\n")[0] || m.roulette_preview_empty()}
              </p>
            {/if}
          </div>
        </div>
      {/if}
    </section>

    <aside class="side-col">
      <div class="hub-panel">
        <div class="hub-panel-head">
          <div class="title">{m.roulette_your_option()}</div>
          <div class="meta">
            {m.roulette_you_progress({
              count: myOptionCount,
              max: admin ? "∞" : wheelState.max_picks,
            })}
          </div>
        </div>
        <div class="hub-panel-body">
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
        </div>
      </div>

      <div class="hub-panel">
        <div class="hub-panel-head">
          <div class="title">{m.roulette_card()}</div>
          <div class="meta">
            {m.roulette_in_wheel({ count: options.length })} ·
            {#if admin}
              <button
                class="hub-btn ghost step"
                disabled={wheelState.max_picks <= 1}
                onclick={() => setMax(wheelState.max_picks - 1)}>−</button
              >
            {/if}
            {m.roulette_limit_per_person({ max: wheelState.max_picks })}
            {#if admin}
              <button
                class="hub-btn ghost step"
                disabled={wheelState.max_picks >= 10}
                onclick={() => setMax(wheelState.max_picks + 1)}>+</button
              >
            {/if}
          </div>
        </div>
        <div class="hub-panel-body">
          {#if options.length > 0}
            <OptionsList
              {options}
              me={name}
              {admin}
              onremove={(id) => client?.removeOption(id)}
              ondetails={(media) => (detailsFor = media)}
            />
          {:else if loaded}
            <p class="hs-caption">{m.roulette_wheel_empty()} — {m.roulette_wheel_empty_msg()}</p>
          {/if}
        </div>
        <div class="panel-foot">
          {#if winner && !spin.spinning}
            <div class="winner-row">
              <MediaPoster path={winner.poster_path} size="w92" alt="" />
              <div class="info">
                <div class="t">
                  {winner.text}{#if winner.media_year}&nbsp;<span class="y">({winner.media_year})</span>{/if}
                </div>
                <div class="sub">{m.roulette_picked_by({ name: winner.author ?? "" })}</div>
              </div>
              {#if winner.tmdb_id && winner.media_type}
                <button
                  class="hub-btn ghost"
                  onclick={() =>
                    (detailsFor = { media_type: winner.media_type!, tmdb_id: winner.tmdb_id! })}
                >
                  {m.roulette_media_details()}
                </button>
              {/if}
              <button class="hub-btn ghost" onclick={() => client?.clearSpin()}>
                {m.roulette_clear_result()}
              </button>
            </div>
          {/if}
          <button
            class="hub-btn primary spin-btn"
            disabled={options.length < 2 || spin.spinning}
            onclick={requestSpin}
          >
            {spin.spinning ? m.roulette_spinning() : m.roulette_spin_wheel()}
          </button>
          <p class="hs-caption center">
            {options.length < 2 ? m.roulette_need_two() : m.roulette_spin_caption()}
          </p>
        </div>
      </div>

      <HistoryCard {history} {admin} {client} ondetails={(media) => (detailsFor = media)} />
    </aside>
  </div>

  <WheelArea {segments} {spin} {winner} ondetails={(media) => (detailsFor = media)} />

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
  background: var(--hs-bg)

.head-actions
  display: flex
  gap: 6px
  align-items: center
  flex-wrap: wrap

.you
  display: flex
  align-items: center
  gap: 6px
  color: var(--hs-fg-muted)
  font-size: 11.5px
  strong
    color: var(--hs-primary)

.dot
  width: 8px
  height: 8px
  border: 1px solid var(--hs-line-strong)

.pdot
  display: inline-block
  width: 7px
  height: 7px
  border: 1px solid var(--hs-line-strong)
  &.me
    outline: 1px solid var(--hs-primary)
    outline-offset: 1px

.layout
  display: flex
  gap: 8px
  align-items: flex-start
  @media (max-width: 900px)
    flex-direction: column

.main-col
  flex: 7
  min-width: 0
  display: flex
  flex-direction: column
  gap: 8px

.side-col
  flex: 3
  min-width: 230px
  display: flex
  flex-direction: column
  gap: 8px
  @media (max-width: 900px)
    width: 100%

.teaser
  margin: 0
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.step
  padding: 1px 5px
  font-size: 11px
  text-transform: none

.panel-foot
  border-top: 1px solid var(--hs-line)
  padding: 8px

.winner-row
  display: flex
  align-items: center
  gap: 8px
  padding: 5px 6px
  margin-bottom: 8px
  border: 1px solid color-mix(in srgb, var(--hs-primary) 40%, transparent)
  background: color-mix(in srgb, var(--hs-primary) 8%, transparent)
  :global(.poster)
    width: 26px
  .info
    flex: 1
    min-width: 0
  .t
    font-size: 11.5px
    color: var(--hs-fg)
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    .y
      color: var(--hs-fg-faint)
  .sub
    font-size: 10px
    color: var(--hs-fg-faint)

.spin-btn
  width: 100%
  justify-content: center
  padding: 8px 18px
  font-size: 13px

.center
  text-align: center
  margin: 5px 0 0
</style>
