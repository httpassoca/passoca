<script lang="ts">
  export let page = false;
</script>

<section class="px-4 md:container md:px-0 md:mt-4" class:page>
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
    padding-top: 130px
    @include screen-md
      padding-top: 200px
</style>
