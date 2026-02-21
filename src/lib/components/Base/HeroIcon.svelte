<script lang="ts">
  // Renders a hero icon JSON from `svelte-hero-icons`.
  // Example: import { Moon } from 'svelte-hero-icons';
  // <HeroIcon src={Moon} size={20} label="Moon" />

  export let src: any;
  export let size: number | string = 20;
  export let className: string = "";
  export let label: string | null = null;
</script>

<svg
  width={size}
  height={size}
  viewBox={src?.viewBox || '0 0 24 24'}
  class={className}
  role={label ? 'img' : 'presentation'}
  aria-label={label || undefined}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
  xmlns="http://www.w3.org/2000/svg"
>
  {@html src?.body || ''}
</svg>
