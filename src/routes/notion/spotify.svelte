<script context="module" lang="ts">
  export async function load() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/now-playing`)
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });
    if (!res) return {};
    let music = null;
    if (res.isPlaying) music = res.music;
    return { props: { music } };
  }
</script>

<script>
  import SpotifyMusic from "$lib/components/SpotifyMusic.svelte";
  export let music = null;
</script>

{#if music}
  <SpotifyMusic {music} />
{/if}
