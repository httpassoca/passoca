<div class="blog--container px-4 md:container md:px-0 mx-auto">
  <div class="blog font-pt">
    <slot />
  </div>
</div>

<style lang="sass">
@import '../../sass/breakpoints'

.blog--container
  margin-top: 80px

.blog
  margin: 0 auto
  width: 100%
  @include screen-md
    width: 720px
  :global
    .info
      color: var(--app-color-gray-text)
    h1, h2
      font-weight: bold
      margin-top: 20px
    h1
      font-size: 2rem
      text-align: center
    h2
      font-size: 1.6rem
    p
      margin-top: 20px
    a
      font-weight: bold
      border-bottom: 2px solid var(--app-color-primary)
</style>
