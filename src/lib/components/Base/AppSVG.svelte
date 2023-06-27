<script lang="ts">
  import { icons } from "$lib/data/svgs";
  import type { SVGNames } from "$lib/data/svgs";

  export let name: SVGNames;
  export let width: number | string;
  export let height: number | string;
  export let fill: string;
  let displayIcon = icons.find((e) => e.name === name);
</script>

<svg
  class={$$props.class}
  width={width || displayIcon.width}
  height={height || displayIcon.height}
  fill={fill || displayIcon.fill}
  viewBox={displayIcon.viewBox}
>
  {@html displayIcon.path}
</svg>
