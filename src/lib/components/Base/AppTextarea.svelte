<script>
  export let value = "";
  export let placeholder = "";
</script>

<textarea {placeholder} bind:value {...$$restProps}></textarea>

<style lang="sass">
textarea
  display: block
  width: 100%
  padding: 12px
  margin: 0.5rem 0

  &::placeholder
    font-style: italic
</style>
