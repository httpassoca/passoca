<script lang="ts">
  import SVG from "./Base/AppSVG.svelte";
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { Moon, Sun } from "svelte-hero-icons";
  import { onMount } from "svelte";
  import { theme } from "../stores/theme.store";
  import type { Theme } from "../stores/theme.store";

  // List of themes
  const themes: Theme[] = ["dark", "light", "coffee","dracula", "tokyo-night"];
  let currentThemeIndex = 0;

  function nextTheme() {
    const { length } = themes;

    currentThemeIndex = (currentThemeIndex + 1) % length;
  }

  onMount(() => {
    // Initialize with localstorage
    const localTheme = localStorage.getItem("theme");
    currentThemeIndex = !localTheme ? 1 : themes.indexOf(localTheme as any);
  });
  $: $theme = themes[currentThemeIndex];
</script>

<svelte:head>
  <meta
    name="theme-color"
    content={["white", "#f9dec9", "#222428"][currentThemeIndex]}
  />
</svelte:head>

<button aria-label={themes[currentThemeIndex]} on:click={nextTheme}>
{themes[currentThemeIndex]}
</button>

