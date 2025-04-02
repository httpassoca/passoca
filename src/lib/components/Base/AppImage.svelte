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
  import "photoswipe/style.css";
  import { onMount } from "svelte";
  import AppLoader from "./AppLoader.svelte";

  import { viewportWidth } from "$lib/stores/window.store";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  export let post: string;
  export let img: string;
  export let alt: string;
  export let maxHeight: number = 0;
  export let maxWidth: number = 0;

  let imageHeight: number = 120;

  let images: TImagesRes = {
    imgs: [],
  };

  const fetchImages = async (): Promise<TImagesRes> => {
    try {
      images = await fetch(
        `${import.meta.env.VITE_API_URL}/img/${post}/${img}`,
      ).then((res) => res.json());
      return images;
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const calculateHeight = (maxH: number, maxW: number): number => {
    if (!maxH) return 120;

    let imageWidth = 0;
    let imageH = 0;
    let aspectRatio = maxW / maxH;

    // Calculate image width based on aspect ratio and viewport width (added container padding)
    imageWidth = Math.min(maxW, $viewportWidth - 32);
    // Calculate image height based on aspect ratio and calculated image width
    imageH = imageWidth / aspectRatio;

    // Ensure the calculated image height does not exceed the maximum height
    if (imageH > maxH) {
      imageH = maxH;
      imageWidth = imageH * aspectRatio;
    }
    return imageH;
  };

  // This should calculate the height of the image before it loads
  $: if (!images.imgs?.length && $viewportWidth) {
    imageHeight = calculateHeight(maxHeight, maxWidth);
  }
  viewportWidth.subscribe(() => {
    imageHeight = calculateHeight(maxHeight, maxWidth);
  });

  onMount(async () => {
    images = await fetchImages();

    // Image visualizer
    let lightbox = new PhotoSwipeLightbox({
      gallery: `#${img}`,
      children: "a",
      showHideAnimationType: "zoom",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  });
</script>

<div class="pswp-gallery" id={img} style={`height: ${imageHeight + "px"}`}>
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
      <AppLoader height={imageHeight} />
    </div>
  {/if}
</div>
