<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Toaster, toast } from "dssoca";
  import { goto } from "$app/navigation";
  import { m } from "$lib/paraglide/messages";
  import AdminTierlists from "$lib/components/Roulette/AdminTierlists.svelte";
  import GeneralTierlist from "$lib/components/Roulette/GeneralTierlist.svelte";
  import MediaDetails from "$lib/components/Roulette/MediaDetails.svelte";
  import PersonalTierlist from "$lib/components/Roulette/PersonalTierlist.svelte";
  import TierlistTimeline from "$lib/components/Roulette/TierlistTimeline.svelte";
  import {
    createRouletteClient,
    colorForName,
    DEFAULT_TIERLIST,
    NAME_KEY,
    PW_KEY,
    type MediaKey,
    type RouletteClient,
    type TierlistSnapshot,
    type TierlistState,
  } from "$lib/roulette";

  const API_URL = import.meta.env.VITE_API_URL as string | undefined;

  let client = $state<RouletteClient | null>(null);
  let tierState = $state<TierlistState>({ ...DEFAULT_TIERLIST });
  let name = $state("");
  // Server-confirmed via the identify ack — never inferred from the name.
  let admin = $state(false);
  let detailsFor = $state<MediaKey | null>(null);
  let snapshots = $state<TierlistSnapshot[]>([]);
  let timelineOpen = $state(false);
  let loaded = $state(false);
  // The store emits its local DEFAULT_TIERLIST placeholder synchronously on
  // subscribe; only server snapshots count as "loaded".
  let sawServerTierlist = false;

  onMount(() => {
    name = localStorage.getItem(NAME_KEY) ?? "";
    const password = localStorage.getItem(PW_KEY) ?? "";

    if (!API_URL) {
      toast.error(m.roulette_missing_api());
      return;
    }

    const c = createRouletteClient(API_URL);
    client = c;

    const unsubs = [
      c.connected.subscribe((v) => {
        // The server forgets presence on disconnect — re-identify on every
        // (re)connect so tierlist saves keep working after reconnects.
        if (v && name) c.identify(name, colorForName(name), password || undefined);
      }),
      c.tierlist.subscribe((t) => {
        if (!sawServerTierlist) {
          sawServerTierlist = true;
          return;
        }
        tierState = t;
        loaded = true;
      }),
      c.tierlistSnapshots.subscribe((s) => (snapshots = s)),
      c.identity.subscribe((id) => {
        if (!id) return;
        // Wrong admin password: treat as not identified; ranking stays locked.
        if (!id.ok) name = "";
        admin = id.ok && id.admin;
      }),
    ];
    const offError = c.onError((msg) => toast.error(msg));

    return () => {
      unsubs.forEach((u) => u());
      offError();
      c.destroy();
    };
  });
</script>

<svelte:head>
  <title>{m.roulette_tierlist_title()}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="page">
  <div class="column">
    <div class="head">
      <div>
        <h1><span class="accent">{m.roulette_tierlist_title()}.</span></h1>
        <div class="sub">{m.roulette_tierlist_sub()}</div>
      </div>
      <div class="head-actions">
        <Button size="md" onclick={() => (timelineOpen = true)}>
          {m.roulette_tierlist_timeline()}
        </Button>
        <Button size="md" onclick={() => goto("/roulette")}>
          {m.roulette_tierlist_back()}
        </Button>
      </div>
    </div>

    <GeneralTierlist state={tierState} loading={!loaded} ondetails={(media) => (detailsFor = media)} />
    <PersonalTierlist {client} state={tierState} {name} ondetails={(media) => (detailsFor = media)} />
    {#if admin}
      <AdminTierlists {client} state={tierState} ondetails={(media) => (detailsFor = media)} />
    {/if}
  </div>

  {#if timelineOpen}
    <TierlistTimeline
      {client}
      state={tierState}
      {snapshots}
      {admin}
      onclose={() => (timelineOpen = false)}
    />
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

.column
  max-width: 960px
  width: 100%
  margin: 0 auto
  display: flex
  flex-direction: column
  gap: 12px

.head
  display: flex
  align-items: flex-end
  justify-content: space-between
  gap: 24px
  margin-bottom: 4px
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
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-xs, 12px)
  margin-top: 6px
  font-family: var(--ss-font-mono)

.head-actions
  display: flex
  gap: 6px
  align-items: center
  flex-wrap: wrap
</style>
