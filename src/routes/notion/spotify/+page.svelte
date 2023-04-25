<script>
  import SpotifyMusic from "$lib/components/SpotifyMusic.svelte";
  export let music = null;
</script>

{#if music}
  <SpotifyMusic {music} />
{/if}
