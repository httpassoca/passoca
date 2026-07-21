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
  const LABEL_R = 58;

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
    return { ...polar(mid, LABEL_R), angle: mid };
  }

  function truncate(text: string, max = 12) {
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
        text-anchor="middle"
        dominant-baseline="middle"
        fill="var(--ss-bg)"
      >
        {truncate(segment.label)}
      </text>
    {/each}
    <circle cx={C} cy={C} r="11" fill="var(--ss-bg)" stroke="var(--ss-line-strong)" />
  </g>
  <polygon class="pointer" points="91,0 109,0 100,17" />
</svg>

<style lang="sass">
svg
  width: min(320px, 78vw)
  height: auto
  display: block

.wheel
  transform-origin: 100px 100px

text
  font-family: var(--ss-font-mono, monospace)
  font-size: 8.5px
  font-weight: 600
  user-select: none

.pointer
  fill: var(--ss-fg, currentColor)
  stroke: var(--ss-bg)
  stroke-width: 2
</style>
