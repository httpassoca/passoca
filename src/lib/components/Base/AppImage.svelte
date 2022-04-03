<script lang="ts">
  interface Image {
    url: string;
    width: number;
  }
  import { theme } from "$lib/stores/theme.store";
  import { onMount } from "svelte";

  export let post: string;
  export let img: string;
  export let alt: string;

  let images: Image[] = [];

  onMount(async () => {
    images = await fetch(
      `${import.meta.env.VITE_API_URL}/img/${post}/${img}`
    ).then((res) => res.json());
  });
</script>

{#if images.length}
  <picture>
    {#each images as image}
      <source media={`min-width:${image.width}px`} srcset={image.url} />
    {/each}
    <img src={images[0].url} {alt} loading="lazy" />
  </picture>
{:else}
  <lottie-player
    src={`/lottie/${$theme === "coffee" ? "coffee" : "dark"}.json`}
    style="width: 100%; height: 120px"
    loop
    autoplay
  />
{/if}
