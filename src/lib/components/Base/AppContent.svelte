<script lang="ts">
  export let page = false;
</script>

<section class="px-4 md:container md:px-0" class:page>
  <div class={`w-full ${$$props.class}`}>
    <slot />
  </div>
</section>

<style lang="sass">
section
  margin: 0 auto
  display: flex
  max-width: 875px !important
  &.page
    justify-content: center
    min-height: 100vh
    padding-top: 250px
</style>
