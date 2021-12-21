<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function click() {
    dispatch("click");
  }
</script>

<button on:click={click}>
  <slot />
</button>

<style lang="sass">
button
  padding: 12px 24px
  clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)
  @apply bg-accent text-darkBackground my-2 flex items-center gap-2
</style>
