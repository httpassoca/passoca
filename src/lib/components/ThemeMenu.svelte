<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { theme } from "$lib/stores/theme.store";
  import type { Theme } from "$lib/stores/theme.store";
  import SVG from "./Base/AppSVG.svelte";

  const themes: { id: Theme; label: string; swatch?: string; themeColor?: string }[] = [
    { id: "dark", label: "Dark", swatch: "#0b1220", themeColor: "#0b1220" },
    { id: "light", label: "Light", swatch: "#ffffff", themeColor: "#ffffff" },
    { id: "coffee", label: "Coffee", swatch: "#f9dec9", themeColor: "#f9dec9" },
    { id: "dracula", label: "Dracula", swatch: "#282a36", themeColor: "#282a36" },
    { id: "tokyo-night", label: "Tokyo Night", swatch: "#1a1b26", themeColor: "#1a1b26" },
  ];

  let open = false;
  let root: HTMLElement | undefined;

  function setTheme(t: Theme) {
    theme.set(t);
    open = false;
  }

  function onDocPointerDown(e: PointerEvent) {
    if (!open) return;
    if (!root) return;
    const target = e.target as Node;
    if (!root.contains(target)) open = false;
  }

  onMount(() => {
    if (!browser) return;

    const localTheme = localStorage.getItem("theme") as Theme | null;
    if (localTheme && themes.some((t) => t.id === localTheme)) theme.set(localTheme);

    document.addEventListener("pointerdown", onDocPointerDown);
  });

  onDestroy(() => {
    if (!browser) return;
    document.removeEventListener("pointerdown", onDocPointerDown);
  });

  $: current = themes.find((t) => t.id === $theme);
</script>

<svelte:head>
  {#if current?.themeColor}
    <meta name="theme-color" content={current.themeColor} />
  {/if}
</svelte:head>

<div class="menu" bind:this={root}>
  <button
    class="trigger"
    aria-label="Theme"
    aria-haspopup="menu"
    aria-expanded={open}
    on:click={() => (open = !open)}
  >

    <SVG
      name="colorswatch"
      width="24"
      height="24"
      fill='var(--app-color-text)'
    />
  </button>

  <div
    class="popover"
    class:open
    role="menu"
    aria-label="Theme options"
    aria-hidden={!open}
  >
      {#each themes as t}
        <button
          role="menuitemradio"
          aria-checked={t.id === $theme}
          class:active={t.id === $theme}
          on:click={() => setTheme(t.id)}
        >
          <span class="left">
            <span class="swatch" style={t.swatch ? `background:${t.swatch}` : ''}></span>
            <span class="label">{t.label}</span>
          </span>
          {#if t.id === $theme}
            <span class="check">✓</span>
          {/if}
        </button>
      {/each}
  </div>
</div>

<style lang="sass">
  .menu
    position: relative

  button.trigger
    display: inline-flex
    align-items: center
    justify-content: center
    gap: 4px
    width: 52px
    height: 36px
    border-radius: 12px
    border: 1px solid rgba(255, 255, 255, 0.12)
    background: transparent
    color: var(--app-color-text)
    opacity: 0.9

  button.trigger:hover
    opacity: 1
    border-color: rgba(255, 255, 255, 0.22)
    background: rgba(255, 255, 255, 0.04)

  .popover
    position: absolute
    right: 0
    top: calc(100% + 10px)
    min-width: 180px
    padding: 8px
    border-radius: 14px
    background: var(--app-color-background)
    border: 1px solid rgba(255, 255, 255, 0.12)
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35)

    // animation
    opacity: 0
    transform: translateY(-6px) scale(0.98)
    visibility: hidden
    pointer-events: none
    transform-origin: top right
    transition: opacity .35s cubic-bezier(0.215,0.61,0.355,1), transform .35s cubic-bezier(0.215,0.61,0.355,1), visibility 0s linear .35s

  .popover.open
    opacity: 1
    transform: translateY(0) scale(1)
    visibility: visible
    pointer-events: auto
    transition: opacity .35s cubic-bezier(0.215,0.61,0.355,1), transform .35s cubic-bezier(0.215,0.61,0.355,1), visibility 0s linear 0s

  .popover button
    width: 100%
    display: flex
    align-items: center
    justify-content: space-between
    padding: 10px 10px
    border-radius: 10px
    background: transparent
    color: var(--app-color-text)
    opacity: 0.9

  .popover button:hover
    background: rgba(255, 255, 255, 0.06)

  .popover button.active
    opacity: 1
    color: var(--app-color-primary)
    background: rgba(255, 255, 255, 0.06)

  .left
    display: flex
    align-items: center
    gap: 10px

  .swatch
    width: 12px
    height: 12px
    border-radius: 999px
    border: 1px solid rgba(255, 255, 255, 0.16)

  .check
    font-size: 12px

  .label
    font-size: 13px
</style>
