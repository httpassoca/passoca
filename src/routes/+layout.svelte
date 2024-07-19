<script lang="ts">
  import "../app.css";
  import "../sass/global.sass";
  import Header from "$lib/components/Header.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { page } from "$app/stores";
</script>

<svelte:head>
  <link rel="icon" href="/favicons/logo.svg" />
</svelte:head>

<main class="content">
  <Header />
  <PageTransition key={$page.url.pathname}>
    <slot />
  </PageTransition>
</main>
