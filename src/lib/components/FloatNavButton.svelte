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
    background-color: var(--app-color-background)
    border-bottom-left-radius: 50%
    border-bottom-right-radius: 50%
    border-top-left-radius: 50%
    border-top-right-radius: 50%
    color: var(--app-color-primary)
    float: right
    transition: opacity .3s ease-in-out, border-top-right-radius .3s ease-in-out
    &.active
      opacity: .85
      border-top-right-radius: 6px
  nav
    flex-direction: column
    display: flex
    align-items: flex-end
    max-height: 0
    overflow: hidden
    gap: 12px
    margin-bottom: 0
    background-color: var(--app-color-background)
    border-radius: 6px
    width: 120px
    padding: 0
    transition: all .5s ease-in-out
    a
      padding: 2px 6px
      border-radius: 4px
      &.actual
        color: var(--app-color-primary)
    &.active
      margin-bottom: 16px
      max-height: 100vh
      padding: 12px 8px
      width: 120px

</style>
