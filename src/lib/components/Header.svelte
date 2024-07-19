<script lang="ts">
  import { page } from "$app/stores";
  import AppSvg from "./Base/AppSVG.svelte";
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
      <lottie-player
        src={`/lottie/about.json`}
        loop
        autoplay
        style="transform: scale(2.2)"
      />
    </a>
    <nav class="hidden md:flex">
      <a class:actual={$page.url.pathname === "/projects"} href="/projects"
        >Projetos</a
      >
      <a class:actual={$page.url.pathname === "/about"} href="/about">Sobre</a>
      <a class:actual={$page.url.pathname === "/contact"} href="/contact"
        >Contato</a
      >
      <AppSvg
        name={"instagram"}
        alt={`instagram icon`}
        fill={"white"}
        height="23"
        width="23"
      />
    </nav>
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
  box-shadow: 0px 0px 30px 20px var(--app-color-background)
  & > div
    @apply flex justify-between py-4 mx-auto
  a.logo
    color: var(--app-color-primary)
    height: 35px
    width: 35px
  nav
    align-items: center
    gap: 48px
    a
      transition: all .35s
      font-size: .8rem
    .actual
      color: var(--app-color-primary)
</style>
