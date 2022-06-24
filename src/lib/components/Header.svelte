<script lang="ts">
  import SVG from "svelte-inline-svg";
  import ChangeTheme from "./ChangeTheme.svelte";
  import { theme } from "$lib/stores/theme.store";
  import Loader from "$lib/components/Base/AppLoader.svelte";
  import { page } from "$app/stores";
  let animation = false;
</script>

<header class="px-4 md:px-0">
  <div class="md:container md:px-0">
    <a
      href="/"
      class="logo"
      on:mouseenter={() => (animation = true)}
      on:mouseleave={() => (animation = false)}
    >
      {#if animation}
        <Loader />
      {:else}
        <SVG src="/logo.svg" height="35" />
      {/if}
    </a>
    <nav>
      <a class:actual={$page.path === "/about"} href="/about">about</a>
      <a class:actual={$page.path === "/career"} href="/career">career</a>
      <a class:actual={$page.path === "/projects"} href="/projects">projects</a>
      <a class:actual={$page.path === "/blog"} href="/blog">blog</a>
      <a class:actual={$page.path === "/notes"} href="/notes">notes</a>
      <!-- <a class:actual={$page.path === "/contact"} href="/contact">contact</a> -->
    </nav>
    <div class="icons">
      <a href="/linkedin" target="_blank">
        <SVG
          src="/icons/linkedin.svg"
          width="23"
          height="23"
          fill={$theme === "dark" ? "#e0e0e0" : "black"}
        />
      </a>
      <a href="/github" target="_blank">
        <SVG
          src="/icons/github.svg"
          width="23"
          height="23"
          fill={$theme === "dark" ? "#e0e0e0" : "black"}
        />
      </a>
      <ChangeTheme />
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
  background-color: var(--app-color-background)
  & > div
    @apply flex justify-between py-4 mx-auto
  a.logo
    color: var(--app-color-primary)
  nav
    display: flex
    align-items: center
    gap: 16px
    a
      transition: all .35s
      font-size: .8rem
    .actual
      color: var(--app-color-primary)
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
      border-bottom: 5px solid var(--app-color-primary)
      top: 53%
      transform: translateY(-50%)

</style>
