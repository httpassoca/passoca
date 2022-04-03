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
  @apply my-2 flex items-center gap-2 rounded
  color: var(--app-color-contrast-text)
  background-color: var(--app-color-primary)
</style>
