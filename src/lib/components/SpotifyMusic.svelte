<script lang="ts">
  import { onMount } from "svelte";
  import { msToTime } from "$lib/helpers/formatTime";
  import { m } from "$lib/paraglide/messages";
  import type { TrackObjectFull } from "$lib/types/spotify";
  export let music: TrackObjectFull;
  export let naked = false;

  const updatePercentage = () =>
    (musicPercentage = Math.floor(
      (music.progress_ms / music.duration_ms) * 100
    ));
  let musicPercentage = Math.floor(
    (music.progress_ms / music.duration_ms) * 100
  );

  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  async function getMusic() {
    const api = import.meta.env.VITE_API_URL;
    if (!api) return;

    try {
      const res = await fetch(`${api}/now-playing`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      if (!json) return;

      if (json.isPlaying) {
        music = json.music;
        updatePercentage();
      } else {
        music = null;
      }
    } catch {
      // ignore (non-critical)
    }
  }

  onMount(() => {
    // keep the progress bar moving locally, but refresh track when the song ends.
    refreshTimer = setInterval(() => {
      if (!music) return;
      music.progress_ms += 2000;
      updatePercentage();
      if (musicPercentage >= 101) {
        getMusic();
      }
    }, 2000);

    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  });
</script>

{#if music}
  {#if !naked}
    <p class="mt-2">{m.spotify_now_listening()}</p>
  {/if}
  <div class="flex items-center gap-3 mt-2">
    <div class="img">
      <img
        src={music.album.images[1].url}
        class="rounded-full"
        height="80"
        width="80"
        alt={`${music.name} album cover`}
      />
    </div>
    <div>
      <a
        class="font-bold"
        href={music.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
      >
        {music.name}
      </a>
      <br />
      <span class="italic">
        {music.artists[0].name}
      </span>
      <br />
      <div class="flex gap-1 items-center text-sm">
        <div class="progress--container">
          <div style="width: {musicPercentage * 2}px;"></div>
        </div>
        {msToTime(music.duration_ms)}
      </div>
    </div>
  </div>
{/if}

<style lang="sass">
.img
  animation: spin 16s linear infinite
  position: relative
  &:after
    content: ''
    display: block
    height: 12px
    width: 12px
    border-radius: 50%
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
    background-color: var(--app-color-background)

@keyframes spin
  100%
    transform: rotate(360deg)

.progress--container
  margin-top: 4px
  position: relative
  width: 200px
  height: 3px
  background-color: var(--app-color-gray-text)
  overflow: hidden
  > div
    transition: width 1.8s
    height: 3px
    position: absolute
    top: 0
    left: 0
    background-color: var(--app-color-primary)
</style>
