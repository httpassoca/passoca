<script lang="ts">
  import { page } from "$app/stores";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import HeroIcon from "$lib/components/Base/HeroIcon.svelte";
  import { Home, Briefcase, Folder, Newspaper } from "svelte-hero-icons";

  type Item = {
    href: string;
    label: string;
    icon: any;
    match: (pathname: string) => boolean;
  };

  const items: Item[] = [
    {
      href: "/",
      label: m.nav_home(),
      icon: Home,
      match: (p) => p === "/" || p === "",
    },
    {
      href: "/career",
      label: m.nav_career(),
      icon: Briefcase,
      match: (p) => p.startsWith("/career"),
    },
    {
      href: "/projects",
      label: m.nav_projects(),
      icon: Folder,
      match: (p) => p.startsWith("/projects"),
    },
    {
      href: "/blog",
      label: m.nav_blog(),
      icon: Newspaper,
      match: (p) => p.startsWith("/blog"),
    },
  ];

  $: pathname = $page.url.pathname;
</script>

<nav class="bottom-nav md:hidden" aria-label="Mobile navigation">
  {#each items as item}
    <a
      href={localizeHref(item.href)}
      class:active={item.match(pathname)}
      aria-current={item.match(pathname) ? "page" : undefined}
    >
      <HeroIcon src={item.icon} size="20" />
      <span>{item.label}</span>
    </a>
  {/each}
</nav>

<style lang="sass">
  nav.bottom-nav
    position: fixed
    left: 0
    right: 0
    bottom: 0
    z-index: 30
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom))
    display: grid
    grid-template-columns: repeat(4, 1fr)
    gap: 8px

    background: color-mix(in srgb, var(--app-color-background) 92%, transparent)
    backdrop-filter: blur(14px)
    border-top: 1px solid rgba(255, 255, 255, 0.10)

  nav.bottom-nav a
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 4px

    padding: 8px 6px
    border-radius: 12px
    color: var(--app-color-text)
    opacity: 0.82

  nav.bottom-nav a span
    font-size: 11px
    line-height: 12px

  nav.bottom-nav a.active
    opacity: 1
    color: var(--app-color-primary)
    background: rgba(255, 255, 255, 0.06)
</style>
