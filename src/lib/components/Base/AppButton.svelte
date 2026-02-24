<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let disabled = false;
  export let type: "button" | "submit" | "reset" = "button";

  function click() {
    if (disabled) return;
    dispatch("click");
  }
</script>

<button {type} {disabled} on:click={click}>
  <slot />
</button>

<style lang="sass">
button
  padding: 12px 24px
  @apply my-2 flex items-center gap-2 rounded
  color: var(--app-color-contrast-text)
  background-color: var(--app-color-primary)

  &:disabled
    opacity: 0.65
    cursor: not-allowed
</style>
