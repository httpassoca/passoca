<div class="blog--container px-4 md:container md:px-0 mx-auto">
  <div class="blog font-pt">
    <slot />
    <hr />
    <span class="thanks"> Thanks for reading! </span>
  </div>
</div>

<style lang="sass">
@import '../../sass/breakpoints'

.blog--container
  padding-top: 120px
  min-height: 100vh

hr
  width: 100%
  background-color: var(--app-color-gray-text)
  height: 1px
  margin: 40px 0 10px 0
  border: 0

.thanks
  font-size: .875rem
  color: var(--app-color-gray-text)
  margin-bottom: 12px

.blog
  margin: 0 auto
  width: 100%

  @include screen-md
    width: 720px
  :global
    pre
      margin: 20px 0
      code
        font-family: 'Caskaydia Cove'
        line-height: 1
    code
      font-size: .8rem
    .info
      color: var(--app-color-gray-text)
      margin-top: 12px
      font-size: .875rem
    .heading-link
      margin-right: 8px
      border-bottom: 2px solid transparent
      transition: all .3s ease
      &:hover
        border-bottom: 2px solid var(--app-color-primary)
    h1, h2
      font-weight: bold
      margin-top: 18px
      position: relative
    h1
      font-size: 2rem
      text-align: center
    h2
      font-size: 1.6rem
    p
      margin-top: 18px
    a:not([href^='#'])
      font-weight: bold
      border-bottom: 1px solid var(--app-color-primary)
</style>
