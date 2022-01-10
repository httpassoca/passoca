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
  {#if !key.includes("blog")}
    <meta property="og:url" content="https://passoca.dev/" />
    <meta property="og:title" content="Rafael Passoca | Frontend Engineer" />
    <meta property="twitter:url" content="https://passoca.dev/" />
    <meta
      property="twitter:title"
      content="Rafael Passoca | Frontend Engineer"
    />
    <meta
      property="twitter:description"
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
