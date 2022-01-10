<script context="module">
  export const load = async ({ page }) => ({
    props: {
      key: page.path,
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
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://passoca.dev/" />
  <meta property="og:title" content="Rafael Passoca | Frontend Engineer" />
  <meta
    property="og:description"
    content="Currently developing apps with Typescript"
  />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://passoca.dev/" />
  <meta property="twitter:title" content="Rafael Passoca | Frontend Engineer" />
  <meta
    property="twitter:description"
    content="Currently developing apps with Typescript"
  />
</svelte:head>

<main class="content">
  <Header />
  <PageTransition refresh={key}>
    <slot />
  </PageTransition>
</main>
