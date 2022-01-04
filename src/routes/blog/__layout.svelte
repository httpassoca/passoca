<div class="container p-0 mx-auto">
  <div class="blog font-pt">
    <slot />
  </div>
</div>

<style lang="sass">
@import '../../sass/breakpoints'

.container
  margin-top: 80px
  max-width: 100vw

.blog
  width: 100%
  @include screen-md
    width: 61.8%
  :global
    p
      margin-top: 20px
</style>
