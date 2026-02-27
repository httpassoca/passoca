<script lang="ts">
  import { page } from "$app/stores";
  import MobileBottomNav from "$lib/components/MobileBottomNav.svelte";
  import Header from "$lib/components/Header.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { theme } from "$lib/stores/theme.store";
  import { viewportWidth } from "$lib/stores/window.store";
  import { onMount } from "svelte";
  import "../app.css";
  import "../sass/global.sass";

  onMount(() => {
    viewportWidth.set(window.innerWidth);
  });
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
  <main class="content pb-24 md:pb-0">
    <Header />
    <PageTransition key={$page.url.pathname}>
      <slot />
    </PageTransition>
    <MobileBottomNav />
  </main>
{:else}
  <slot />
{/if}
