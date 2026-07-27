<script lang="ts" module>
  export type WheelSegment = { id: string; label: string };
</script>

<script lang="ts">
  import { CHART_PALETTE } from "dssoca";
  import { m } from "$lib/paraglide/messages";

  let {
    segments,
    rotation = 0,
    duration = 0,
  }: {
    segments: WheelSegment[];
    /** Cumulative clockwise rotation in degrees. */
    rotation?: number;
    /** Transition length in seconds; 0 snaps instantly. */
    duration?: number;
  } = $props();

  const C = 100;
  const R = 92;
  // Labels sit horizontally at the centroid of each wedge; they are
  // counter-rotated against the wheel so they stay upright at any rotation.
  const LABEL_R = 56;
  const CHAR_W = 4.9; // ~width of one 8px monospace character

  // Angles measured clockwise from the pointer (top).
  function polar(angleDeg: number, radius: number) {
    const a = (angleDeg * Math.PI) / 180;
    return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) };
  }

  function arcPath(i: number, n: number) {
    const seg = 360 / n;
    const start = polar(i * seg, R);
    const end = polar((i + 1) * seg, R);
    const largeArc = seg > 180 ? 1 : 0;
    return `M ${C} ${C} L ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  function label(i: number, n: number) {
    const mid = (i + 0.5) * (360 / n);
    return polar(mid, n === 1 ? 0 : LABEL_R);
  }

  function maxChars(n: number) {
    if (n <= 1) return 18;
    // A horizontal label must fit the wedge chord at the label radius.
    const chord = 2 * LABEL_R * Math.sin(Math.PI / n);
    return Math.min(18, Math.max(4, Math.floor(chord / CHAR_W)));
  }

  function truncate(text: string, max: number) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  const color = (i: number) => CHART_PALETTE[i % CHART_PALETTE.length];
</script>

<svg viewBox="0 0 200 200" role="img" aria-label={m.roulette_wheel_aria()}>
  <g
    class="wheel"
    style:transform="rotate({rotation}deg)"
    style:transition={duration > 0
      ? `transform ${duration}s cubic-bezier(0.12, 0.64, 0.08, 1)`
      : "none"}
  >
    {#if segments.length === 1}
      <circle cx={C} cy={C} r={R} fill={color(0)} />
    {:else}
      {#each segments as segment, i (segment.id)}
        <path
          d={arcPath(i, segments.length)}
          fill={color(i)}
          stroke="var(--ss-bg)"
          stroke-width="1.5"
        />
      {/each}
    {/if}
    {#each segments as segment, i (segment.id)}
      {@const pos = label(i, segments.length)}
      <text
        x={pos.x}
        y={pos.y}
        text-anchor="middle"
        dominant-baseline="middle"
        fill="var(--ss-bg)"
        style:transform="rotate({-rotation}deg)"
        style:transform-origin="{pos.x}px {pos.y}px"
        style:transition={duration > 0
          ? `transform ${duration}s cubic-bezier(0.12, 0.64, 0.08, 1)`
          : "none"}
      >
        {truncate(segment.label, maxChars(segments.length))}
      </text>
    {/each}
    <circle cx={C} cy={C} r="11" fill="var(--ss-bg)" stroke="var(--ss-line-strong)" />
  </g>
  <polygon class="pointer" points="91,0 109,0 100,17" />
</svg>

<style lang="sass">
svg
  width: min(360px, 100%)
  height: auto
  display: block

.wheel
  transform-origin: 100px 100px

text
  font-family: var(--ss-font-mono, monospace)
  font-size: 8px
  font-weight: 600
  user-select: none
  transform-box: view-box

.pointer
  fill: var(--ss-fg, currentColor)
  stroke: var(--ss-bg)
  stroke-width: 2
</style>
