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
</svelte:head>

<main class="content">
  <Header />
  <PageTransition refresh={key}>
    <slot />
  </PageTransition>
</main>
