<script lang="ts">
  type TImage = {
    url: string;
    width: number;
    height: number;
  };
  type TImagesRes = {
    imgs: TImage[];
    originalImage?: TImage;
  };
  import { onMount } from "svelte";
  import AppLoader from "./AppLoader.svelte";
  import "photoswipe/style.css";

  import PhotoSwipeLightbox from "photoswipe/lightbox";

  export let post: string;
  export let img: string;
  export let alt: string;

  let images: TImagesRes = {
    imgs: [],
  };

  onMount(async () => {
    images = await fetch(
      `${import.meta.env.VITE_API_URL}/img/${post}/${img}`,
    ).then((res) => res.json());

    // Image visualizer
    let lightbox = new PhotoSwipeLightbox({
      gallery: `#${alt.split(" ").join("-")}`,
      children: "a",
      showHideAnimationType: "zoom",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  });
</script>

<div class="pswp-gallery" id={alt.split(" ").join("-")}>
  {#if images.imgs?.length}
    <a
      href={images.originalImage.url}
      data-pswp-width={images.originalImage.width}
      data-pswp-height={images.originalImage.height}
      rel="noreferrer"
    >
      <picture>
        {#each images.imgs as image}
          <source media={`min-width:${image.width}px`} srcset={image.url} />
        {/each}
        <img src={images.imgs[0].url} {alt} loading="lazy" />
      </picture>
    </a>
  {:else}
    <div class="flex justify-center">
      <AppLoader height={120} />
    </div>
  {/if}
</div>
