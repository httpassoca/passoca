<script lang="ts">
  import type { TrackObjectFull } from "$lib/types/spotify";
  export let music: TrackObjectFull;
</script>

<div class="flex items-center gap-3 mt-2">
  <img
    src={music.album.images[1].url}
    class="rounded-full"
    height="80"
    width="80"
    alt="actual_music_cover"
  />
  <div>
    <b>
      {music.name}
    </b>
    <br />
    <span class="italic">
      {music.artists[0].name}
    </span>
  </div>
</div>
