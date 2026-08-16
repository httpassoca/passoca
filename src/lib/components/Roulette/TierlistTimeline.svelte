<script lang="ts">
  import { crossfade, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { Badge, Button, EmptyState, Modal, SegmentedControl } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import MediaPoster from "./MediaPoster.svelte";
  import TierRow from "./TierRow.svelte";
  import {
    TIERS,
    type RouletteClient,
    type TierItem,
    type TierlistSnapshot,
    type TierlistState,
  } from "$lib/roulette";

  let {
    client,
    state: tierState,
    snapshots,
    admin,
    onclose,
  }: {
    client: RouletteClient | null;
    state: TierlistState;
    snapshots: TierlistSnapshot[];
    admin: boolean;
    onclose: () => void;
  } = $props();

  let open = $state(true);

  const BASE_STEP_MS = 1800;
  const BASE_MOVE_MS = 500;

  let idx = $state(0);
  let playing = $state(false);
  let speed = $state("1");

  const speedNum = $derived(Number(speed) || 1);
  const moveMs = $derived(BASE_MOVE_MS / speedNum);

  const visible = $derived(snapshots.filter((s) => !s.hidden));
  const itemsByKey = $derived(new Map(tierState.items.map((i) => [i.key, i])));
  const frame = $derived(visible[idx] as TierlistSnapshot | undefined);

  // Films that later left history have no metadata anymore — skip their keys.
  function frameItems(f: TierlistSnapshot, tier: (typeof TIERS)[number]): TierItem[] {
    return f.general[tier].map((key) => itemsByKey.get(key)).filter((i): i is TierItem => !!i);
  }

  // Keep the cursor on a real frame when snapshots shrink (hide/moderation).
  $effect(() => {
    if (idx > visible.length - 1) idx = Math.max(0, visible.length - 1);
  });

  $effect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      if (idx >= visible.length - 1) {
        playing = false;
        return;
      }
      idx += 1;
    }, BASE_STEP_MS / speedNum);
    return () => clearInterval(t);
  });

  function togglePlay() {
    if (!playing && idx >= visible.length - 1) idx = 0;
    playing = !playing;
  }

  const [send, receive] = crossfade({
    duration: () => moveMs,
    fallback: (node) => fade(node, { duration: moveMs }),
  });

  function fmtWhen(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<!-- Fullscreen: the timeline replays whole tierlist frames, so it gets the
     entire viewport (the dssoca Modal is sized via --ss-modal-* custom
     properties, inherited from this wrapper into the <dialog>). -->
<div class="fullscreen">
  <Modal bind:open title={m.roulette_tierlist_timeline()} size="lg" {onclose}>
  <p class="desc">{m.roulette_tierlist_timeline_desc()}</p>

  {#if !frame}
    <EmptyState
      title={m.roulette_tierlist_timeline_empty()}
      message={m.roulette_tierlist_timeline_empty_msg()}
    />
  {:else}
    <div class="controls">
      <Button
        variant="ghost"
        size="md"
        iconOnly
        label={m.roulette_tierlist_prev()}
        disabled={idx === 0}
        onclick={() => {
          playing = false;
          idx = Math.max(0, idx - 1);
        }}>◀</Button
      >
      <Button
        variant="primary"
        size="md"
        iconOnly
        label={playing ? m.roulette_tierlist_pause() : m.roulette_tierlist_play()}
        disabled={visible.length < 2}
        onclick={togglePlay}>{playing ? "⏸" : "▶"}</Button
      >
      <Button
        variant="ghost"
        size="md"
        iconOnly
        label={m.roulette_tierlist_next()}
        disabled={idx >= visible.length - 1}
        onclick={() => {
          playing = false;
          idx = Math.min(visible.length - 1, idx + 1);
        }}>▶▏</Button
      >
      <span class="counter">{idx + 1}/{visible.length}</span>
      <span class="author">
        {m.roulette_tierlist_change_by({ name: frame.author })} · {fmtWhen(frame.created_at)}
      </span>
      {#if visible.length > 1}
        <span class="grow"></span>
        <SegmentedControl
          size="md"
          label={m.roulette_tierlist_speed()}
          bind:value={speed}
          options={[
            { value: "0.5", label: "0.5×" },
            { value: "1", label: "1×" },
            { value: "2", label: "2×" },
            { value: "4", label: "4×" },
          ]}
        />
      {/if}
    </div>

    <div class="rows">
      {#each TIERS as tier (tier)}
        <TierRow {tier}>
          {#each frameItems(frame, tier) as item (item.key)}
            <div
              class="cell"
              title={item.title}
              in:receive={{ key: item.key }}
              out:send={{ key: item.key }}
              animate:flip={{ duration: moveMs }}
            >
              {#if item.poster_path}
                <MediaPoster path={item.poster_path} size="w92" alt={item.title} />
              {:else}
                <span class="name">{item.title}</span>
              {/if}
            </div>
          {/each}
        </TierRow>
      {/each}
    </div>
  {/if}

  {#if admin && snapshots.length > 0}
    <div class="manage">
      <span class="lbl">{m.roulette_tierlist_manage()}</span>
      {#each snapshots as snap (snap.id)}
        <div class="snap" class:off={snap.hidden}>
          <span class="when">{fmtWhen(snap.created_at)}</span>
          <span class="who">{snap.author}</span>
          {#if snap.hidden}<Badge tone="neutral" size="md">{m.roulette_tierlist_hidden()}</Badge>{/if}
          <span class="grow"></span>
          <Button
            variant="ghost"
            size="md"
            onclick={() => client?.setSnapshotHidden(snap.id, !snap.hidden)}
          >
            {snap.hidden ? m.roulette_tierlist_restore() : m.roulette_tierlist_hide()}
          </Button>
        </div>
      {/each}
    </div>
  {/if}
  </Modal>
</div>

<style lang="sass">
.fullscreen
  display: contents
  :global(.ss-modal)
    width: 100vw
    max-width: 100vw
    height: 100vh
    max-height: 100vh
    border: none
  :global(.ss-modal .panel)
    height: 100%

.desc
  margin: 0 0 8px
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  letter-spacing: 0.04em
  color: var(--ss-fg-faint)

.controls
  display: flex
  align-items: center
  gap: 8px
  flex-wrap: wrap
  margin-bottom: 8px
  .grow
    flex: 1

.counter
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  color: var(--ss-fg-muted)
  font-variant-numeric: tabular-nums

.author
  font-family: var(--ss-font-mono)
  font-size: var(--ss-size-xs, 12px)
  color: var(--ss-fg-faint)

.rows
  display: flex
  flex-direction: column
  gap: 6px

// Smaller tiles than the live lists: a whole frame stays on screen, and the
// flights between tiers read as one motion.
.cell
  width: 60px
  aspect-ratio: 2 / 3
  flex: none
  display: flex
  align-items: flex-end
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  overflow: hidden
  :global(.poster.w92)
    width: 100%
    height: 100%
    border: none

.name
  padding: 3px
  font-size: 9px
  line-height: 1.25
  color: var(--ss-fg-muted)
  overflow: hidden
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 4
  word-break: break-word

.manage
  display: flex
  flex-direction: column
  gap: 4px
  border-top: 1px solid var(--ss-line)
  padding-top: 8px
  margin-top: 10px
  .lbl
    font-family: var(--ss-font-mono)
    font-size: var(--ss-size-xs, 12px)
    letter-spacing: 0.04em
    color: var(--ss-fg-faint)

.snap
  display: flex
  align-items: center
  gap: 8px
  padding: 2px 0
  font-size: var(--ss-size-sm, 14px)
  &.off
    .when, .who
      color: var(--ss-fg-faint)
      text-decoration: line-through
  .when
    font-family: var(--ss-font-mono)
    font-size: var(--ss-size-xs, 12px)
    color: var(--ss-fg-muted)
    font-variant-numeric: tabular-nums
  .who
    color: var(--ss-fg)
  .grow
    flex: 1
</style>
