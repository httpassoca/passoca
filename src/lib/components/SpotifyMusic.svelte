<script lang="ts">
  import { onMount } from "svelte";
  import type { TrackObjectFull } from "$lib/types/spotify";
  export let music: TrackObjectFull;
  let musicPercentage = Math.round(
    (music.progress_ms / music.duration_ms) * 100
  );

  async function getMusic() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/now-playing`).then(
      (res) => res.json()
    );
    if (res.isPlaying) {
      music = res.music;
      musicPercentage = Math.round(
        (music.progress_ms / music.duration_ms) * 100
      );
    } else music = null;
  }

  onMount(async () => {
    setInterval(() => {
      music.progress_ms += 2000;
      musicPercentage = Math.round(
        (music.progress_ms / music.duration_ms) * 100
      );
      if (musicPercentage >= 100) {
        getMusic();
      }
    }, 2000);
  });
</script>

{#if music}
  <p class="mt-2">Right now I am listening to:</p>
  <div class="flex items-center gap-3 mt-2">
    <img
      src={music.album.images[1].url}
      class="rounded-full"
      height="80"
      width="80"
      alt="actual_music_cover"
    />
    <div>
      <a class="font-bold" href={music.external_urls.spotify} target="_blank">
        {music.name}
      </a>
      <br />
      <span class="italic">
        {music.artists[0].name}
      </span>
      <br />
      <div class="progress--container">
        <div style="width: {musicPercentage * 2}px;" />
      </div>
    </div>
  </div>
{/if}

<style lang="sass">
.progress--container
  position: relative
  width: 200px
  height: 3px
  background-color: var(--app-color-gray-text)
  overflow: hidden
  > div
    height: 3px
    position: absolute
    top: 0
    left: 0
    background-color: var(--app-color-primary)
</style>
