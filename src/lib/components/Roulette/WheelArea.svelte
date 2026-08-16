<script lang="ts">
  import { Button } from "dssoca";
  import confetti from "canvas-confetti";
  import { m } from "$lib/paraglide/messages";
  import Wheel from "./Wheel.svelte";
  import MediaPoster from "./MediaPoster.svelte";
  import { tmdbImg } from "$lib/roulette/media";
  import type { MediaKey, Option, SpinController } from "$lib/roulette";

  let {
    options,
    spin,
    winner,
    admin = false,
    canSpin = false,
    onspin,
    ondeny,
    ondetails,
  }: {
    options: Option[];
    spin: SpinController;
    winner: Option | null;
    admin?: boolean;
    canSpin?: boolean;
    onspin: () => void;
    ondeny: () => void;
    ondetails: (media: MediaKey) => void;
  } = $props();

  // The wheel lives ONLY in this fullscreen takeover. The node stays rendered
  // while hidden so the CSS rotation transition never restarts mid-spin.
  //
  // Two stages, one always-mounted wheel:
  // - idle: the whole wheel centered on screen, SPIN button below, draggable
  //   for fun (opened locally via `spin.previewOpen`).
  // - expanded: the wheel drops DOWN to the bottom of the screen — its center
  //   (hub) sits at the bottom edge with the top half visible, and a needle at
  //   the hub points up at the 12 o'clock wedge — used while spinning and for
  //   the winner reveal.
  const expanded = $derived(spin.spinning || (!!winner && !spin.overlayDismissed));
  const overlayVisible = $derived(spin.previewOpen || expanded);

  let vw = $state(1024);
  let vh = $state(768);

  // Expanded geometry: the hub must stay on screen (the needle lives there),
  // so the radius is bounded by the viewport height with headroom for the
  // 12 o'clock wedge and the winner announcement.
  const RIM_PAD = 10; // matches Wheel's padding around the circle
  const radius = $derived(Math.round(Math.min(2600, Math.max(320, vh - 150))));
  const size = $derived(2 * (radius + RIM_PAD));
  // Wheel center in the expanded stage — a hair above the bottom edge.
  const hubY = $derived(vh - 16);

  // Idle geometry: the whole wheel fits on screen, room for the SPIN button.
  const idleD = $derived(Math.round(Math.min(0.82 * vw, 0.56 * vh)));
  const idleCenterY = $derived(Math.round(0.4 * vh));
  const idleScale = $derived(idleD / (2 * radius));

  // The holder is moved/scaled purely via composited transforms (no layout),
  // transitioned when the stage flips — the wheel "flies up" as a spin starts.
  const holderTransform = $derived(
    expanded
      ? `translate(-50%, ${hubY - size / 2}px)`
      : `translate(-50%, ${idleCenterY - size / 2}px) scale(${idleScale})`
  );

  // --- Idle "nudge for fun" drag ---------------------------------------------
  // Directly accumulates into spin.rotation; the SpinController normalizes to
  // a whole-turn boundary before every real spin, so play offsets never skew
  // the landing math.
  let draggingWheel = $state(false);
  let dragAngle = 0;
  let dragAt = 0;
  let dragVel = 0; // deg/ms, smoothed

  function pointerAngle(e: PointerEvent): number {
    return (Math.atan2(e.clientY - idleCenterY, e.clientX - vw / 2) * 180) / Math.PI;
  }

  function dragStart(e: PointerEvent) {
    if (expanded || spin.spinning || !e.isPrimary) return;
    draggingWheel = true;
    dragAngle = pointerAngle(e);
    dragAt = e.timeStamp;
    dragVel = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function dragMove(e: PointerEvent) {
    if (!draggingWheel || spin.spinning) return;
    const a = pointerAngle(e);
    let delta = a - dragAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const dt = Math.max(1, e.timeStamp - dragAt);
    dragVel = 0.7 * dragVel + 0.3 * (delta / dt);
    dragAngle = a;
    dragAt = e.timeStamp;
    spin.spinDuration = 0;
    spin.rotation += delta;
  }

  function dragEnd() {
    if (!draggingWheel) return;
    draggingWheel = false;
    if (spin.spinning) return;
    // Small fling so a flick keeps rolling a bit — capped well under a turn.
    const extra = Math.max(-300, Math.min(300, dragVel * 320));
    if (Math.abs(extra) > 8) {
      spin.spinDuration = 1.2;
      spin.rotation += extra;
    }
  }

  function dismiss() {
    if (spin.spinning) return;
    if (winner) spin.overlayDismissed = true;
    spin.previewOpen = false;
  }

  const winnerBackdrop = $derived(
    winner?.backdrop_path
      ? tmdbImg(winner.backdrop_path, "w1280")
      : winner?.poster_path
        ? tmdbImg(winner.poster_path, "w780")
        : null
  );

  let confettiFiredFor: string | null = null;

  function fireConfetti() {
    const base = { zIndex: 1001, spread: 75, ticks: 240 };
    confetti({ ...base, particleCount: 140, origin: { x: 0.5, y: 0.5 } });
    setTimeout(() => confetti({ ...base, particleCount: 70, angle: 55, origin: { x: 0.05, y: 0.9 } }), 250);
    setTimeout(() => confetti({ ...base, particleCount: 70, angle: 125, origin: { x: 0.95, y: 0.9 } }), 450);
  }

  $effect(() => {
    if (
      winner &&
      !spin.spinning &&
      !spin.overlayDismissed &&
      spin.lastSpunAt &&
      confettiFiredFor !== spin.lastSpunAt
    ) {
      confettiFiredFor = spin.lastSpunAt;
      fireConfetti();
    }
  });
</script>

<svelte:window
  bind:innerWidth={vw}
  bind:innerHeight={vh}
  onkeydown={(e) => {
    if (e.key === "Escape" && overlayVisible) dismiss();
  }}
/>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
     (backdrop click is a pointer shortcut; keyboard users have Escape and the Close button) -->
<div
  class="wheel-overlay"
  class:visible={overlayVisible}
  aria-hidden={!overlayVisible}
  onclick={(e) => {
    if (overlayVisible && e.target === e.currentTarget) dismiss();
  }}
>
  <!-- svelte-ignore a11y_no_static_element_interactions
       (the drag is a playful extra; SPIN is the real, accessible control) -->
  <div
    class="wheel-holder"
    class:draggable={!expanded}
    class:dragging={draggingWheel}
    style:width="{size}px"
    style:height="{size}px"
    style:transform={holderTransform}
    aria-hidden="true"
    onpointerdown={dragStart}
    onpointermove={dragMove}
    onpointerup={dragEnd}
    onpointercancel={dragEnd}
  >
    <!-- Static shadow disc: a box-shadow rotates for free, unlike the old
         drop-shadow filter which re-rendered the artwork every spin frame. -->
    <div class="wheel-shadow"></div>
    <div
      class="spin-layer"
      style:transform="rotate({spin.rotation}deg)"
      style:transition={spin.spinDuration > 0
        ? `transform ${spin.spinDuration}s cubic-bezier(0.12, 0.64, 0.08, 1)`
        : "none"}
    >
      <Wheel
        {options}
        {radius}
        apexHeight={radius}
        winnerId={spin.spinning ? null : spin.winnerId}
      />
    </div>
  </div>

  <!-- Fixed needle at the wheel's hub, pointing up at the 12 o'clock wedge:
       the wheel spins underneath, this never moves. Expanded stage only. -->
  <div
    class="pointer"
    class:shown={expanded && !(winner && !spin.spinning)}
    style:top="{hubY}px"
    aria-hidden="true"
  ></div>

  {#if spin.previewOpen && !expanded}
    <div class="idle-ui" style:top="{idleCenterY + idleD / 2 + 20}px">
      <Button variant="primary" size="lg" disabled={!canSpin} onclick={onspin}>
        {m.roulette_spin()}
      </Button>
      <p class="idle-hint">
        {canSpin ? m.roulette_wheel_play_hint() : m.roulette_need_two()}
      </p>
    </div>
  {/if}

  {#if winner && !spin.spinning && winnerBackdrop}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
         (click-through dismiss shortcut; keyboard users have Escape and Close) -->
    <!-- Fullscreen winner art under a cinema gradient. -->
    <div
      class="winner-bg"
      style:background-image="linear-gradient(180deg, rgb(0 0 0 / 0.5) 0%, rgb(0 0 0 / 0.35) 40%, rgb(0 0 0 / 0.88) 100%), url('{winnerBackdrop}')"
      onclick={dismiss}
    ></div>
  {/if}

  <div class="stage">
    {#if winner && !spin.spinning}
      <div class="winner" role="status">
        {#if winner.poster_path}
          <MediaPoster
            path={winner.poster_path}
            size="w342"
            alt={m.roulette_media_poster_alt({ title: winner.text })}
          />
        {:else}
          <span class="clap">🎬</span>
        {/if}
        <span class="winner-text">
          {winner.text}
          {#if winner.media_year}<span class="winner-year">({winner.media_year})</span>{/if}
        </span>
        {#if winner.original_title && winner.original_title !== winner.text}
          <span class="winner-orig">{winner.original_title}</span>
        {/if}
        <span class="winner-by">{m.roulette_picked_by({ name: winner.author ?? "" })}</span>
        <div class="acts">
          {#if winner.tmdb_id && winner.media_type}
            <Button
              variant="ghost"
              onclick={() => ondetails({ media_type: winner.media_type!, tmdb_id: winner.tmdb_id! })}
            >
              {m.roulette_media_details()}
            </Button>
          {/if}
          {#if admin}
            <Button variant="danger" onclick={ondeny}>
              {m.roulette_deny()}
            </Button>
          {/if}
          <Button onclick={() => (spin.overlayDismissed = true)}>
            {m.roulette_close()}
          </Button>
        </div>
      </div>
    {:else if spin.spinning}
      <p class="spinning-label">{m.roulette_spinning()}</p>
    {/if}
  </div>
</div>

<style lang="sass">
// The takeover is deliberately cinema-dark in every site theme so the
// backdrop art pops; light text inside it is intentional, not theme-driven.
.wheel-overlay
  position: fixed
  inset: 0
  z-index: 1000
  overflow: hidden
  background: color-mix(in srgb, var(--ss-bg) 22%, black)
  // Hidden, not unmounted — keeps the rotation transition state alive.
  visibility: hidden
  pointer-events: none
  &.visible
    visibility: visible
    pointer-events: auto

// Stage moves are pure composited transforms so the spin stays smooth while
// the wheel glides between center stage and its hang-from-the-top position.
.wheel-holder
  position: absolute
  top: 0
  left: 50%
  will-change: transform
  transition: transform 0.9s var(--ss-ease)
  touch-action: none
  &.draggable
    cursor: grab
  &.dragging
    cursor: grabbing

.wheel-shadow
  position: absolute
  inset: 10px // RIM_PAD — hugs the circle itself
  border-radius: 50%
  box-shadow: 0 0 70px rgb(0 0 0 / 0.65)

.spin-layer
  position: absolute
  inset: 0
  will-change: transform

// Needle anchored at the hub: base at the wheel's center, tip pointing up.
.pointer
  position: absolute
  left: 50%
  transform: translate(-50%, -100%)
  width: 26px
  height: 54px
  clip-path: polygon(50% 0, 12% 100%, 88% 100%)
  background: var(--ss-accent)
  filter: drop-shadow(0 0 10px rgb(0 0 0 / 0.7))
  z-index: 3
  opacity: 0
  transition: opacity 0.3s var(--ss-ease)
  &.shown
    opacity: 1
  // Hub cap over the needle base.
  &::after
    content: ""
    position: absolute
    left: 50%
    bottom: -9px
    transform: translateX(-50%)
    width: 18px
    height: 18px
    border-radius: 50%
    background: var(--ss-accent)
    border: 2px solid rgb(0 0 0 / 0.45)

.idle-ui
  position: absolute
  left: 0
  right: 0
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px
  z-index: 3

.idle-hint
  margin: 0
  color: rgb(255 255 255 / 0.55)
  font-family: var(--ss-font-mono)
  font-size: 11.5px

.winner-bg
  position: absolute
  inset: 0
  background-size: cover
  background-position: center
  z-index: 2
  animation: bgfade 0.6s var(--ss-ease)

// The reveal layer. Pointer-events pass through the empty space so a backdrop
// click still lands on the overlay itself (dismiss shortcut).
.stage
  position: absolute
  inset: 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 24px
  pointer-events: none
  z-index: 4

.winner
  display: flex
  flex-direction: column
  align-items: center
  gap: 4px
  pointer-events: auto
  animation: pop 0.5s cubic-bezier(0.2, 1.6, 0.3, 1)
  :global(.poster)
    width: min(150px, 26vmin)
    box-shadow: 0 8px 40px rgb(0 0 0 / 0.6)

.clap
  font-size: 40px

.winner-text
  font-size: clamp(24px, 5vmin, 44px)
  font-family: var(--ss-font-display)
  color: var(--ss-accent)
  text-align: center
  text-shadow: 0 2px 18px rgb(0 0 0 / 0.7)

.winner-year
  color: rgb(255 255 255 / 0.6)
  font-family: var(--ss-font-mono)
  font-size: 0.55em

.winner-orig
  color: rgb(255 255 255 / 0.6)
  font-size: 13px

.winner-by
  color: rgb(255 255 255 / 0.6)
  font-family: var(--ss-font-mono)
  font-size: 11.5px

.acts
  display: flex
  gap: 8px
  margin-top: 10px
  flex-wrap: wrap
  justify-content: center

.spinning-label
  position: absolute
  top: 8vh
  color: rgb(255 255 255 / 0.7)
  font-family: var(--ss-font-mono)
  animation: blink 1s steps(2, start) infinite

@keyframes pop
  0%
    transform: scale(0.4)
    opacity: 0
  100%
    transform: scale(1)
    opacity: 1

@keyframes bgfade
  0%
    opacity: 0
  100%
    opacity: 1

@keyframes blink
  50%
    opacity: 0.35
</style>
