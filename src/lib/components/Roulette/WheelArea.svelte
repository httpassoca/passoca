<script lang="ts">
  import { Button } from "dssoca";
  import confetti from "canvas-confetti";
  import { m } from "$lib/paraglide/messages";
  import Wheel from "./Wheel.svelte";
  import MediaPoster from "./MediaPoster.svelte";
  import type { MediaKey, Option, SpinController } from "$lib/roulette";

  let {
    options,
    spin,
    winner,
    ondetails,
  }: {
    options: Option[];
    spin: SpinController;
    winner: Option | null;
    ondetails: (media: MediaKey) => void;
  } = $props();

  // The wheel lives ONLY in this fullscreen takeover (wireframe layout:
  // "syncs fullscreen on every screen"). The node stays rendered while
  // hidden so the CSS rotation transition never restarts mid-spin.
  const overlayVisible = $derived(
    spin.spinning || (!!winner && !spin.overlayDismissed)
  );

  let vw = $state(1024);
  let vh = $state(768);

  // "Peek from below" geometry: the wheel's center sits under the viewport and
  // only its top arc rises from the bottom edge. The winning wedge lands at
  // the wheel's 12 o'clock — exactly the apex of the visible arc — so the
  // SpinController's landing math is untouched.
  //
  // Framing target at rest: the apex wedge fully visible plus roughly half of
  // each neighbor, i.e. a visible half-angle ≈ one wedge angle (clamped so
  // tiny/huge wedge counts still frame sensibly).
  const RIM_PAD = 10; // matches Wheel's padding around the circle
  const wedgeDeg = $derived(360 / Math.max(options.length, 1));
  const phi = $derived((Math.min(75, Math.max(30, wedgeDeg)) * Math.PI) / 180);
  const radius = $derived(Math.round(Math.min(2600, Math.max(320, vw / (2 * Math.sin(phi))))));
  const apexHeight = $derived(
    Math.round(
      Math.min(0.42 * vh, Math.max(radius * (1 - Math.cos(phi)), Math.min(170, 0.35 * vh)))
    )
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
    if (e.key === "Escape" && overlayVisible && !spin.spinning) spin.overlayDismissed = true;
  }}
/>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
     (backdrop click is a pointer shortcut; keyboard users have Escape and the Close button) -->
<div
  class="wheel-overlay"
  class:visible={overlayVisible}
  aria-hidden={!overlayVisible}
  onclick={(e) => {
    if (overlayVisible && !spin.spinning && e.target === e.currentTarget)
      spin.overlayDismissed = true;
  }}
>
  <div
    class="wheel-holder"
    style:top="{vh - apexHeight - RIM_PAD}px"
    aria-hidden="true"
  >
    <Wheel
      {options}
      rotation={spin.rotation}
      duration={spin.spinDuration}
      {radius}
      {apexHeight}
      winnerId={spin.spinning ? null : spin.winnerId}
    />
  </div>

  <!-- Fixed marker: the wheel spins underneath, this never moves. -->
  <div class="pointer" aria-hidden="true"></div>

  <div class="stage" style:height="{vh - apexHeight}px">
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

.wheel-holder
  position: absolute
  left: 50%
  transform: translateX(-50%)
  filter: drop-shadow(0 -12px 40px rgb(0 0 0 / 0.6))

.pointer
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)
  width: 34px
  height: 30px
  clip-path: polygon(50% 0, 6% 100%, 94% 100%)
  background: var(--ss-accent)
  filter: drop-shadow(0 0 10px rgb(0 0 0 / 0.7))
  z-index: 2

// Everything above the arc. Pointer-events pass through the empty space so a
// backdrop click still lands on the overlay itself (dismiss shortcut).
.stage
  position: absolute
  top: 0
  left: 0
  right: 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 24px
  pointer-events: none

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

.spinning-label
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

@keyframes blink
  50%
    opacity: 0.35
</style>
