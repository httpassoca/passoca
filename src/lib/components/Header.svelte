<script lang="ts">
  import ChangeTheme from "./ChangeTheme.svelte";
  import { theme } from "$lib/stores/theme.store";
  import Loader from "$lib/components/Base/AppLoader.svelte";
  import { page } from "$app/stores";
  import SVG from "./Base/AppSVG.svelte";
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
        <span>
          <svg
            viewBox="0 0 103 89"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M51.5 0L0 89H103L51.5 0ZM23.8643 80.151H87.6468L71.6884 52.5724L23.8643 80.151ZM65.5911 42.0354L60.7383 33.649L46.1956 42.0354H65.5911ZM56.14 25.7024L51.5 17.6837L42.2125 33.7339L56.14 25.7024ZM32.0977 51.2138L20.2949 71.6111L55.6656 51.2138H32.0977Z"
              fill="currentColor"
            />
          </svg>
        </span>
      {/if}
    </a>
    <nav class="hidden md:flex">
      <a class:actual={$page.url.pathname === "/career"} href="/career"
        >career</a
      >
      <a class:actual={$page.url.pathname === "/projects"} href="/projects"
        >projects</a
      >
      <a class:actual={$page.url.pathname === "/blog"} href="/blog">blog</a>
      <a class:actual={$page.url.pathname === "/notes"} href="/notes">notes</a>
      <!-- <a class:actual={$page.url.pathname === "/contact"} href="/contact">contact</a> -->
    </nav>
    <div class="icons">
      <a href="/linkedin" target="_blank">
        <SVG
          name="linkedin"
          width="23"
          height="23"
          fill={$theme === "dark" ? "#e0e0e0" : "black"}
        />
      </a>
      <a href="/github" target="_blank">
        <SVG
          name="github"
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
    height: 35px
    width: 35px
  nav
    align-items: center
    gap: 16px
    a
      transition: all .35s
      font-size: .8rem
    .actual
      color: var(--app-color-primary)
  &::after
    content: ''
    display: block
    position: absolute
    top: 100%
    height: 80px
    width: 100%
    background-image: linear-gradient(to bottom, var(--app-color-background), transparent)
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
