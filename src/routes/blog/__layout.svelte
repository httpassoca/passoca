<div class="blog--container px-4 md:container md:px-0 mx-auto">
  <div class="blog font-pt">
    <slot />
    <hr />
    <div class="thanks">Thanks for reading!</div>
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
  padding-bottom: 24px

.blog
  margin: 0 auto
  width: 100%

  @include screen-md
    width: 720px

.blog :global
  pre
    margin: 20px 0
    code
      font-family: 'Caskaydia Cove'
      line-height: 1
  code
    font-size: .8rem

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
    margin-top: 14px
  a:not([href^='#'])
    font-weight: bold
    border-bottom: 1px solid rgba(var(--app-color-primary-rgb), .6)
    position: relative
  a[target='_blank']
    &:before
      content: unset
    &:after
      content: ''
      display: inline-block
      height: 15px
      width: 16px
      mask: url('/icons/external_link.svg')
      background-color: var(--app-color-gray-text)
      top: 5px
      margin-left: 4px
      transition: background-color .35s ease
    &:hover:after
      background-color: var(--app-color-primary)

  .info
    color: var(--app-color-gray-text)
    margin-top: 12px
    font-size: .875rem
  .heading-link
    margin-right: 8px
    opacity: .5
    border-bottom: 2px solid transparent
    transition: all .3s ease
    &:hover
      opacity: 1
      border-bottom: 2px solid var(--app-color-primary)
  .fonts
    li
      margin: 6px 0
      &:before
        content: ''
        display: inline-block
        height: 4px
        width: 4px
        margin-right: 6px
        margin-bottom: 4px
        border-left: 3px solid transparent
        border-right: 3px solid transparent
        border-bottom: 5px solid var(--app-color-primary)
        transform: rotate(90deg)

    a
      border-bottom: 0px solid var(--app-color-primary)
      font-style: italic
      font-weight: normal


</style>
