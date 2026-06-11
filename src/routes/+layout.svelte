<script lang="ts">
  import { page } from "$app/stores";
  import { BottomNav, registerIcon, type IconName } from "dssoca";
  import Header from "$lib/components/Header.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { theme } from "$lib/stores/theme.store";
  import { viewportWidth } from "$lib/stores/window.store";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import { onMount } from "svelte";
  import "../app.css";
  import "../sass/global.sass";

  // dssoca's built-in glyph set has no home/briefcase/folder; `note` covers blog.
  registerIcon("home", '<path d="M3 11l9-8 9 8"/><path d="M5 9v12h14V9"/>');
  registerIcon("briefcase", '<rect x="3" y="7" width="18" height="13"/><path d="M9 7V4h6v3M3 12h18"/>');
  registerIcon("folder", '<path d="M3 5h7l2 3h9v12H3z"/>');

  onMount(() => {
    viewportWidth.set(window.innerWidth);
  });

  $: isMobile = typeof $viewportWidth === "number" && $viewportWidth < 768;

  $: navItems = [
    { id: "home", label: m.nav_home(), icon: "home" as IconName, href: localizeHref("/") },
    { id: "career", label: m.nav_career(), icon: "briefcase" as IconName, href: localizeHref("/career") },
    { id: "projects", label: m.nav_projects(), icon: "folder" as IconName, href: localizeHref("/projects") },
    { id: "blog", label: m.nav_blog(), icon: "note" as IconName, href: localizeHref("/blog") },
  ];
  $: pathname = $page.url.pathname;
  $: activeNav =
    pathname === "/" || pathname === "" ? "home"
    : pathname.startsWith("/career") ? "career"
    : pathname.startsWith("/projects") ? "projects"
    : pathname.startsWith("/blog") ? "blog"
    : undefined;
</script>

<svelte:window bind:innerWidth={$viewportWidth} />

<svelte:head>
  <link rel="icon" href="/favicons/{$theme}-logo.svg" />
  {#if !$page.url.pathname.includes("blog/")}
    <title>Passoca</title>
    <meta name="title" content="Rafael Passoca | Frontend Engineer" />
    <meta
      name="description"
      content="Currently developing apps with Typescript"
    />
    <meta name="og:url" content="https://passoca.dev/" />
    <meta name="og:title" content="Rafael Passoca | Frontend Engineer" />
    <meta name="twitter:url" content="https://passoca.dev/" />
    <meta name="twitter:title" content="Rafael Passoca | Frontend Engineer" />
    <meta
      name="twitter:description"
      content="Currently developing apps with Typescript"
    />
  {/if}
</svelte:head>

{#if !$page.url.pathname.includes("notion/")}
  <main id="main" class="content pb-24 md:pb-0">
    <Header />
    <PageTransition key={$page.url.pathname}>
      <slot />
    </PageTransition>
    {#if isMobile}
      <BottomNav items={navItems} active={activeNav} ariaLabel="Mobile navigation" />
    {/if}
  </main>
{:else}
  <slot />
{/if}
