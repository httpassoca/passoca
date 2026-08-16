<script lang="ts">
  import { CHART_PALETTE } from "dssoca";
  import { m } from "$lib/paraglide/messages";
  import { tmdbImg } from "$lib/roulette/media";
  import type { Option } from "$lib/roulette/types";

  let {
    options,
    rotation = 0,
    duration = 0,
    radius,
    apexHeight,
    winnerId = null,
  }: {
    options: Option[];
    /** Cumulative clockwise rotation in degrees. */
    rotation?: number;
    /** Transition length in seconds; 0 snaps instantly. */
    duration?: number;
    /** Wheel radius in px — the SVG is sized 1:1 with the viewport. */
    radius: number;
    /** Visible height of the arc at screen center; positions the labels. */
    apexHeight: number;
    winnerId?: string | null;
  } = $props();

  // Only one wheel exists per page (the takeover), so static ids are safe.
  const UID = "rwheel";
  const RIM_PAD = 10;

  const n = $derived(options.length);
  const seg = $derived(n > 0 ? 360 / n : 360);
  const size = $derived(2 * (radius + RIM_PAD));
  const C = $derived(radius + RIM_PAD);

  // Angles measured clockwise from the wheel's top (the visible apex).
  function polar(angleDeg: number, r: number) {
    const a = (angleDeg * Math.PI) / 180;
    return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
  }

  function wedgePath(i: number) {
    const start = polar(i * seg, radius);
    const end = polar((i + 1) * seg, radius);
    const largeArc = seg > 180 ? 1 : 0;
    return `M ${C} ${C} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  const mid = (i: number) => (n === 1 ? 0 : (i + 0.5) * seg);

  // Backdrop art fills the wedge's bounding box in a frame rotated to the
  // wedge midline; the clip warps it into the true pie-slice shape.
  const imgHalfWidth = $derived(n === 1 ? radius : radius * Math.sin(Math.PI / n));

  function wedgeArt(o: Option): { href: string } | null {
    if (o.backdrop_path) return { href: tmdbImg(o.backdrop_path, "w780") };
    if (o.poster_path) return { href: tmdbImg(o.poster_path, "w342") };
    return null;
  }

  // Titles ride an arc near the rim; on the visible top of the wheel that
  // reads left-to-right and upright, and it rotates with the wedges.
  const fontSize = $derived(Math.max(13, Math.min(24, radius * 0.032)));
  const labelR = $derived(
    radius - Math.max(fontSize + 10, Math.min(0.14 * radius, apexHeight * 0.42))
  );

  function labelHalfSpan(): number {
    const padDeg = ((6 / labelR) * 180) / Math.PI;
    return n === 1 ? 60 : Math.max(seg / 2 - padDeg, 4);
  }

  function labelArc(i: number) {
    const half = labelHalfSpan();
    const start = polar(mid(i) - half, labelR);
    const end = polar(mid(i) + half, labelR);
    const largeArc = half > 90 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${labelR} ${labelR} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const maxChars = $derived.by(() => {
    const arcLen = 2 * ((labelHalfSpan() * Math.PI) / 180) * labelR;
    return Math.min(28, Math.max(3, Math.floor((arcLen - 8) / (fontSize * 0.6))));
  });

  function truncate(text: string, max: number) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  const color = (i: number) => CHART_PALETTE[i % CHART_PALETTE.length];
  const winnerIndex = $derived(winnerId ? options.findIndex((o) => o.id === winnerId) : -1);
</script>

<svg
  viewBox="0 0 {size} {size}"
  width={size}
  height={size}
  role="img"
  aria-label={m.roulette_wheel_aria()}
>
  {#if n > 0}
    <defs>
      <!-- Darkens toward the rim so titles stay legible over busy art. -->
      <radialGradient id="{UID}-scrim">
        <stop offset="52%" stop-color="rgb(0 0 0 / 0)" />
        <stop offset="78%" stop-color="rgb(0 0 0 / 0.42)" />
        <stop offset="100%" stop-color="rgb(0 0 0 / 0.82)" />
      </radialGradient>
      {#each options as option, i (option.id)}
        <clipPath id="{UID}-clip-{i}">
          {#if n === 1}
            <circle cx={C} cy={C} r={radius} />
          {:else}
            <path d={wedgePath(i)} />
          {/if}
        </clipPath>
        <path id="{UID}-arc-{i}" d={labelArc(i)} fill="none" />
      {/each}
    </defs>

    <g
      class="wheel"
      style:transform="rotate({rotation}deg)"
      style:transform-origin="{C}px {C}px"
      style:transition={duration > 0
        ? `transform ${duration}s cubic-bezier(0.12, 0.64, 0.08, 1)`
        : "none"}
    >
      {#each options as option, i (option.id)}
        {@const art = wedgeArt(option)}
        {#if n === 1}
          <circle cx={C} cy={C} r={radius} fill={color(i)} />
        {:else}
          <path d={wedgePath(i)} fill={color(i)} />
        {/if}
        {#if art}
          <g clip-path="url(#{UID}-clip-{i})">
            <image
              transform="rotate({mid(i)} {C} {C})"
              x={C - imgHalfWidth}
              y={C - radius}
              width={2 * imgHalfWidth}
              height={radius}
              href={art.href}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        {/if}
      {/each}

      <circle cx={C} cy={C} r={radius} fill="url(#{UID}-scrim)" />

      {#if n > 1}
        {#each options as option, i (option.id)}
          {@const tip = polar(i * seg, radius)}
          <line class="spoke" x1={C} y1={C} x2={tip.x} y2={tip.y} />
        {/each}
      {/if}

      {#if winnerIndex >= 0 && n > 1}
        <path class="win" d={wedgePath(winnerIndex)} />
      {/if}

      {#each options as option, i (option.id)}
        <text class="label" style:font-size="{fontSize}px">
          <textPath href="#{UID}-arc-{i}" startOffset="50%" text-anchor="middle">
            {truncate(option.text, maxChars)}
          </textPath>
        </text>
      {/each}
    </g>

    <!-- Static rim — a uniform ring, so it never needs to rotate. -->
    <circle class="rim-glow" cx={C} cy={C} r={radius + 4} />
    <circle class="rim" cx={C} cy={C} r={radius + 1} />
  {/if}
</svg>

<style lang="sass">
svg
  display: block

.wheel
  transform-box: view-box

.spoke
  stroke: rgb(255 255 255 / 0.28)
  stroke-width: 2

// Over photo art the scrim/halo blacks and label whites are intentional
// constants, not theme colors.
.label
  font-family: var(--ss-font-display)
  font-weight: 600
  letter-spacing: 0.02em
  fill: #fff
  paint-order: stroke
  stroke: rgb(0 0 0 / 0.55)
  stroke-width: 3px
  stroke-linejoin: round
  user-select: none

.win
  fill: color-mix(in srgb, var(--ss-accent) 16%, transparent)
  stroke: var(--ss-accent)
  stroke-width: 3
  filter: drop-shadow(0 0 14px var(--ss-accent))
  animation: winpulse 1.6s ease-in-out infinite

.rim
  fill: none
  stroke: rgb(255 255 255 / 0.22)
  stroke-width: 3

.rim-glow
  fill: none
  stroke: rgb(0 0 0 / 0.55)
  stroke-width: 10

@keyframes winpulse
  0%, 100%
    opacity: 1
  50%
    opacity: 0.55
</style>
