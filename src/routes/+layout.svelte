<script lang="ts">
  import { page } from "$app/stores";
  import { BottomNav } from "dssoca";
  import Header from "$lib/components/Header.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { theme } from "$lib/stores/theme.store";
  import { viewportWidth } from "$lib/stores/window.store";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import { onMount } from "svelte";
  import "dssoca/tokens.css";
  import "../app.css";
  import "../sass/global.sass";

  onMount(() => {
    viewportWidth.set(window.innerWidth);
  });

  $: isMobile = typeof $viewportWidth === "number" && $viewportWidth < 768;

  $: navItems = [
    { id: "home", label: m.nav_home(), icon: "home" as const, href: localizeHref("/") },
    { id: "career", label: m.nav_career(), icon: "briefcase" as const, href: localizeHref("/career") },
    { id: "projects", label: m.nav_projects(), icon: "folder" as const, href: localizeHref("/projects") },
    { id: "blog", label: m.nav_blog(), icon: "note" as const, href: localizeHref("/blog") },
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
