<script lang="ts">
  import { Button } from "dssoca";
  import confetti from "canvas-confetti";
  import { m } from "$lib/paraglide/messages";
  import Wheel from "./Wheel.svelte";
  import MediaPoster from "./MediaPoster.svelte";
  import type { MediaKey, Option, SpinController } from "$lib/roulette";

  let {
    segments,
    spin,
    winner,
    optionCount,
    onspin,
    onclear,
    ondetails,
  }: {
    segments: { id: string; label: string }[];
    spin: SpinController;
    winner: Option | null;
    optionCount: number;
    onspin: () => void;
    onclear: () => void;
    ondetails: (media: MediaKey) => void;
  } = $props();

  const overlayVisible = $derived(
    spin.spinning || (!!winner && !spin.overlayDismissed)
  );

  let confettiFiredFor: string | null = null;

  function fireConfetti() {
    const base = { zIndex: 1001, spread: 75, ticks: 240 };
    confetti({ ...base, particleCount: 140, origin: { x: 0.5, y: 0.55 } });
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
  onkeydown={(e) => {
    if (e.key === "Escape" && overlayVisible && !spin.spinning) spin.overlayDismissed = true;
  }}
/>

<!-- The same node expands to a fixed fullscreen takeover during a
     witnessed spin, so the CSS rotation transition never restarts. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
     (backdrop click is a pointer shortcut; keyboard users have Escape and the Close button) -->
<div
  class="wheel-area"
  class:takeover={overlayVisible}
  onclick={(e) => {
    if (overlayVisible && !spin.spinning && e.target === e.currentTarget)
      spin.overlayDismissed = true;
  }}
>
  <Wheel {segments} rotation={spin.rotation} duration={spin.spinDuration} />

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
    </div>
  {:else if spin.spinning}
    <p class="spinning-label">{m.roulette_spinning()}</p>
  {/if}

  <div class="row center">
    {#if overlayVisible}
      {#if winner && !spin.spinning}
        {#if winner.tmdb_id && winner.media_type}
          <Button
            variant="ghost"
            onclick={() =>
              ondetails({ media_type: winner.media_type!, tmdb_id: winner.tmdb_id! })}
          >
            {m.roulette_media_details()}
          </Button>
        {/if}
        <Button onclick={() => (spin.overlayDismissed = true)}>
          {m.roulette_close()}
        </Button>
      {/if}
    {:else}
      <Button onclick={onspin} disabled={optionCount < 2 || spin.spinning}>
        {m.roulette_spin()}
      </Button>
      {#if winner && !spin.spinning}
        <Button variant="ghost" onclick={onclear}>
          {m.roulette_clear_result()}
        </Button>
      {/if}
    {/if}
  </div>
  {#if optionCount < 2 && !overlayVisible}
    <p class="hint">{m.roulette_need_two()}</p>
  {/if}
</div>

<style lang="sass">
.hint
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)
  margin: 8px 0 16px

.row
  display: flex
  align-items: flex-start
  gap: var(--ss-gap, 10px)
  &.center
    justify-content: center
    margin-top: 14px
    :global(button)
      margin-top: 0

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
      font-size: var(--ss-size-body)
    .winner-orig
      font-size: var(--ss-size-body)
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

.winner-year
  color: var(--ss-fg-muted)
  font-family: var(--ss-font-mono)
  font-size: 0.6em

.winner-orig
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

.winner-by
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

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
