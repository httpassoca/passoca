<script lang="ts">
  import "../app.css";
  import "../sass/global.sass";
  import Header from "$lib/components/Base/AppHeader.svelte";
</script>

<main class="content pb-32">
  <Header />
  <slot />
</main>
