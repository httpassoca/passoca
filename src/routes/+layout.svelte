<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import "../app.css";
  import "../sass/global.sass";
  import Header from "$lib/components/Header.svelte";
  import FloatNavButton from "$lib/components/FloatNavButton.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { theme } from "$lib/stores/theme.store";
  export let key: string;
</script>

<svelte:head>
  <link rel="icon" href="/favicons/{$theme}-logo.svg" />
  {#if !key.includes("blog")}
    <title>{key} | Passoca</title>
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

<main class="content">
  <Header />
  <PageTransition refresh={key}>
    <slot />
  </PageTransition>
  <FloatNavButton />
</main>
