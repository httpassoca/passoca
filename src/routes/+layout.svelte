<script lang="ts">
  import "../app.css";
  import "../sass/global.sass";
  import Header from "$lib/components/Header.svelte";
  import FloatNavButton from "$lib/components/FloatNavButton.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { theme } from "$lib/stores/theme.store";
  import { page } from "$app/stores";
</script>

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
  <main class="content">
    <Header />
    <PageTransition key={$page.url.pathname} duration={2000}>
      <slot />
    </PageTransition>
    <FloatNavButton />
  </main>
{:else}
  <slot />
{/if}
