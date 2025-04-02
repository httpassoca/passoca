<script lang="ts">
  import { cubicIn } from "svelte/easing";
  import type { EasingFunction, TransitionConfig } from "svelte/transition";

  export let key: string;
  export let duration = 300;

  type Params = {
    delay?: number;
    duration?: number;
    easing?: EasingFunction;
  };
  type Options = {
    direction?: "in" | "out" | "both";
  };

  function flush(
    node: Element,
    { delay = 300, duration = 300, easing = cubicIn }: Params = {},
    { direction = "both" }: Options = {}
  ): TransitionConfig {
    return {
      delay,
      duration,
      easing,
      css: (t, u) => `
        opacity: ${direction === "in" ? t : u};
      `,
    };
  }
</script>

{#key key}
  <div in:flush|global={{ duration, delay: duration }} out:flush|global={{ duration }}>
    <slot />
  </div>
{/key}
