<script lang="ts">
  import SVG from "svelte-inline-svg";
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { Moon, Sun } from "svelte-hero-icons";

  import { dark } from "$lib/stores/theme.store.ts";
</script>

<header class="px-4 md:px-0">
  <div class="md:container md:px-0">
    <img class="logo" src="/logo.svg" alt="logo" />
    <div class="icons">
      <a href="https://github.com/httpassoca/passoca" target="_blank">
        <SVG
          src="/icons/github.svg"
          width="23"
          height="23"
          fill={$dark ? "#e0e0e0" : "black"}
        />
      </a>
      <div on:click|preventDefault={() => dark.set(!$dark)}>
        <Icon src={$dark ? Sun : Moon} size="23" />
      </div>
    </div>
  </div>
</header>

<style lang="sass">
header
  @apply fixed z-10
  width: 100vw
  left: 50%
  top: 0
  transform: translateX(-50%)
  background-color: var(--color-background)
  & > div
    @apply flex justify-between py-4 mx-auto
.icons
  @apply flex h-full items-center my-auto gap-2
  a
    line-height: 24px
    display: block
    position: relative
    margin-right: 14px
    &::after
      content: ''
      height: 4px
      width: 4px
      display: block
      position: absolute
      right: -14px
      border-left: 3px solid transparent
      border-right: 3px solid transparent
      border-bottom: 5px solid #66ef63
      top: 53%
      transform: translateY(-50%)
img
  height: 45px
</style>
