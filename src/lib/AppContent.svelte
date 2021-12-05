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
  &.page
    justify-content: center
    align-items: center
    min-height: calc(100vh - 85px)
</style>
