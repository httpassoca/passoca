<script lang="ts">
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { Menu, X } from "svelte-hero-icons";
  import { page } from "$app/stores";
  let open = false;
</script>

<div class="floatnav md:hidden">
  <nav class:active={open}>
    <a class:actual={$page.url.pathname === "/about"} href="/about">about</a>
    <a class:actual={$page.url.pathname === "/career"} href="/career">career</a>
    <a class:actual={$page.url.pathname === "/projects"} href="/projects"
      >projects</a
    >
    <a class:actual={$page.url.pathname === "/blog"} href="/blog">blog</a>
    <a class:actual={$page.url.pathname === "/notes"} href="/notes">notes</a>
  </nav>
  <button class:active={open} on:click={() => (open = !open)}>
    <Icon src={open ? X : Menu} size="24" />
  </button>
</div>

<style lang="sass">
.floatnav
  position: fixed
  bottom: 20px
  right: 20px

  button
    padding: 15px
    background-color: var(--app-color-lighter-background)
    border-radius: 50%
    color: var(--app-color-primary)
    float: right
    &.active
      opacity: .65
  nav
    flex-direction: column
    display: flex
    align-items: flex-end
    max-height: 0
    overflow: hidden
    gap: 12px
    margin-bottom: 0
    transition: max-height .5s ease, margin-bottom .5s ease-in-out
    a
      background-color: var(--app-color-background)
      padding: 2px 6px
      border-radius: 4px
    &.active
      margin-bottom: 30px
      max-height: 100vh
</style>
