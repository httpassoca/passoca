<script lang="ts">
  import "../app.css";
  import "../sass/global.sass";
  import Header from "$lib/components/Header.svelte";
  import { theme } from "$lib/stores/theme.store";
</script>

<svelte:head>
  <link rel="icon" href="/favicons/{$theme}-logo.svg" />
</svelte:head>

<main class="content">
  <Header />
  <slot />
</main>
