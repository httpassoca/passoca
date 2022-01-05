<script lang="ts">
  export let to: string;
  export let blank = true;
</script>

<a href={to} target={blank && "_blank"} rel="noopener noreferrer">
  <slot />
</a>

<style lang="sass">
a
  text-decoration: none
  font-weight: 600
  position: relative
  &:before
    content: ''
    background-color: var(--app-color-primary)
    width: 100%
    position: absolute
    left: 0
    bottom: 1px
    height: 1px
    transition: all .35s cubic-bezier(0.215,0.61,0.355,1)
  &:hover
    &:before
      box-shadow: 0px -9.6px 18px var(--app-color-title-2), 0px -26.4px 32.8px var(--app-color-title-3), 0px -63.6px 65.2px var(--app-color-title-4), 0px -211px 137px var(--app-color-title-5)
      background-color: var(--app-color-primary)
      height: 2px
</style>
