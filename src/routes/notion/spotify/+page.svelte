<script lang="ts">
  import type { PageData } from "./$types";
  import SpotifyMusic from "$lib/components/SpotifyMusic.svelte";
  export let data: PageData;
  export let { music } = data;
</script>

{#if music}
  <SpotifyMusic {music} />
{/if}
