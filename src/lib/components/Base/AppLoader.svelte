<script lang="ts">
  export let height: number = 35;
</script>

<div>
  <lottie-player
    src={`/lottie/logo.json`}
    style="width: 40px; height: {height}px; transform: scale(2.2)"
    loop
    autoplay
  />
</div>
