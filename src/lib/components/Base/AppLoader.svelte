<script lang="ts">
  import { theme } from "$lib/stores/theme.store";

  export let height: number = 35;
</script>

<div>
  <lottie-player
    src={`/lottie/${$theme === "coffee" ? "coffee" : "dark"}.json`}
    style="width: 40px; height: {height}px; transform: scale(2.2)"
    loop
    autoplay
  />
</div>
