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
  function playFlush() {
    const url = "https://cdn.pixabay.com/audio/2021/08/09/audio_e2a6340055.mp3";
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play();
  }

  function flush(
    node: Element,
    { delay = 0, duration = 300, easing = cubicIn }: Params = {},
    { direction = "both" }: Options = {}
  ): TransitionConfig {
    direction === "out" && playFlush();

    return {
      delay,
      duration,
      easing,
      css: (t) => `
        scale: ${t};
        rotate: ${t}turn;
      `,
    };
  }
</script>

{#key key}
  <div in:flush={{ duration, delay: duration }} out:flush={{ duration }}>
    <slot />
  </div>
{/key}
