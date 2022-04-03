<script>
  export let value = "";
  export let placeholder = "";
</script>

<input type="text" {placeholder} bind:value />

<style lang="sass">
input
  padding: 12px 24px
  width: 100%

  @apply my-2 rounded
  &::placeholder
    font-style: italic
</style>
