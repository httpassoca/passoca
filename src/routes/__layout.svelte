<script context="module">
  export const load = async ({ url }) => ({
    props: {
      key: url.pathname,
    },
  });
</script>

<script lang="ts">
  import PageTransition from "$lib/components/PageTransition.svelte";
  import "../app.css";
  import "../sass/global.sass";
  import Header from "$lib/components/Header.svelte";
  import { theme } from "$lib/stores/theme.store";
  export let key: string;
</script>

<svelte:head>
  <link rel="icon" href="/favicons/{$theme}-logo.svg" />
  {#if !key.includes("blog")}
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
</main>
