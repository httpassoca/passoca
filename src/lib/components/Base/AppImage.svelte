<script lang="ts">
  interface Image {
    url: string;
    width: number;
  }
  import { theme } from "$lib/stores/theme.store";
  import { onMount } from "svelte";
  import AppLoader from "./AppLoader.svelte";

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
  <div class="flex justify-center">
    <AppLoader height={120} />
  </div>
{/if}
