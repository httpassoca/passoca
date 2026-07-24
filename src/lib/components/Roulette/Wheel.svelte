<script lang="ts" module>
  export type WheelSegment = { id: string; label: string };
</script>

<script lang="ts">
  import { CHART_PALETTE } from "dssoca";

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
  // Labels run radially from just outside the hub out toward the rim, so long
  // titles get the full length of the wedge instead of a cramped tangent.
  const LABEL_INNER = 24;
  const LABEL_OUTER = 88;

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

  // Radial label: reads outward from the inner circle. On the left half it is
  // flipped and right-anchored so the text stays upright and legible.
  function label(i: number, n: number) {
    const mid = (i + 0.5) * (360 / n);
    const flip = mid > 90 && mid < 270;
    const p = flip ? polar(mid, LABEL_OUTER) : polar(mid, LABEL_INNER);
    return {
      x: p.x,
      y: p.y,
      angle: flip ? mid + 90 : mid - 90,
      anchor: flip ? "end" : "start",
    };
  }

  function maxChars(n: number) {
    // Fewer segments -> wider wedge -> room for more characters.
    return n <= 6 ? 16 : n <= 8 ? 14 : 12;
  }

  function truncate(text: string, max: number) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  const color = (i: number) => CHART_PALETTE[i % CHART_PALETTE.length];
</script>

<svg viewBox="0 0 200 200" role="img" aria-label="Roulette wheel">
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
        transform="rotate({pos.angle} {pos.x} {pos.y})"
        text-anchor={pos.anchor}
        dominant-baseline="middle"
        fill="var(--ss-bg)"
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

.pointer
  fill: var(--ss-fg, currentColor)
  stroke: var(--ss-bg)
  stroke-width: 2
</style>
