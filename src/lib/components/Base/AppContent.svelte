<script lang="ts">
  export let page = false;
</script>

<section class="md:container md:px-0 md:mt-4" class:page>
  <div class={`w-full ${$$props.class}`}>
    <slot />
  </div>
</section>

<style lang="sass">
@import '../../../sass/breakpoints'

section
  margin: 0 auto
  display: flex
  max-width: 875px !important
  &.page
    justify-content: center
    min-height: 100vh
    padding: 130px 16px
    @include screen-md
      padding: 200px 0 80px 0
</style>
