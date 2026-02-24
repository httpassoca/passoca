<script lang="ts">
  import { cubicIn } from "svelte/easing";
  import type { EasingFunction, TransitionConfig } from "svelte/transition";

  export let key: string;
  export let duration = 300;

  type Params = {
    delay?: number;
    duration?: number;
    easing?: EasingFunction;
    direction?: "in" | "out";
  };

  // Simple fade. (The previous implementation accidentally used `u`,
  // which inverted the fade on intro/outro.)
  function flush(
    node: Element,
    { delay = 0, duration = 300, easing = cubicIn, direction = "in" }: Params = {}
  ): TransitionConfig {
    // `t` always represents the progress of *this* transition.
    // For intro: 0 -> 1
    // For outro: 1 -> 0
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t};`,
    };
  }
</script>

{#key key}
  <div
    in:flush|global={{ duration, delay: 0, direction: "in" }}
  >
    <slot />
  </div>
{/key}
