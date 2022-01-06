<script lang="ts">
  import { blur } from "svelte/transition";

  export let to: string;
  export let blank = true;
  export let button = false;
</script>

<a
  href={to}
  class:button
  target={blank ? "_blank" : "_self"}
  rel="noopener noreferrer"
  transition:blur
>
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

  &.button
    padding: 12px 24px
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)
    @apply my-2 flex items-center gap-2
    color: var(--app-color-contrast-text)
    background-color: var(--app-color-primary)
    &:before
      display: none
</style>
