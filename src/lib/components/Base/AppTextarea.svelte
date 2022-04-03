<script>
  export let value = "";
  export let placeholder = "";
</script>

<textarea {placeholder} bind:value />

<style lang="sass">
textarea
  display: block
  width: 100%
  padding: 12px
  @apply my-2 rounded
  &::placeholder
    font-style: italic
</style>
