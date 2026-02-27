<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import HeroIcon from "$lib/components/Base/HeroIcon.svelte";
  import { Translate } from "svelte-hero-icons";

  type LocaleInfo = { id: string; label: string; flag: string };

  const localeInfo: Record<string, LocaleInfo> = {
    en: { id: "en", label: "English", flag: "🇺🇸" },
    "pt-BR": { id: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  };

  let open = false;
  let root: HTMLElement | undefined;

  function getActiveLocale(pathname: string) {
    const found = locales.find((l) => pathname.startsWith(`/${l}`));
    return found ?? (locales[0] as any);
  }

  function onDocPointerDown(e: PointerEvent) {
    if (!open) return;
    if (!root) return;
    const target = e.target as Node;
    if (!root.contains(target)) open = false;
  }

  onMount(() => {
    if (!browser) return;
    document.addEventListener("pointerdown", onDocPointerDown);
  });

  onDestroy(() => {
    if (!browser) return;
    document.removeEventListener("pointerdown", onDocPointerDown);
  });

  $: pathname = $page.url.pathname;
  $: activeLocale = getActiveLocale(pathname);
  $: active = localeInfo[activeLocale] ?? {
    id: activeLocale,
    label: activeLocale,
    flag: "🏳️",
  };
</script>

<div class="menu" bind:this={root} aria-label={m.i18n_switch()}>
  <button
    class="trigger"
    aria-label="Language"
    aria-haspopup="menu"
    aria-expanded={open}
    on:click={() => (open = !open)}
  >
    <span class="flag">{active.flag}</span>
    <HeroIcon src={Translate} size="18" />
  </button>

  {#if open}
    <div class="popover" role="menu" aria-label="Languages">
      {#each locales as l}
        {@const info = localeInfo[l] ?? { id: l, label: l, flag: "🏳️" }}
        <a
          role="menuitemradio"
          aria-checked={l === activeLocale}
          class:active={l === activeLocale}
          href={localizeHref(pathname, { locale: l })}
          data-sveltekit-reload
          on:click={() => (open = false)}
        >
          <span class="left">
            <span class="flag">{info.flag}</span>
            <span class="label">{info.label}</span>
          </span>
          {#if l === activeLocale}
            <span class="check">✓</span>
          {/if}
        </a>
      {/each}
    </div>
  {/if}
</div>

<style lang="sass">
  .menu
    position: relative

  button.trigger
    display: inline-flex
    align-items: center
    justify-content: center
    gap: 6px
    width: 44px
    height: 36px
    border-radius: 12px
    border: 1px solid rgba(255, 255, 255, 0.12)
    background: transparent
    color: var(--app-color-text)

  .popover
    position: absolute
    right: 0
    top: calc(100% + 10px)
    min-width: 210px
    padding: 8px
    border-radius: 14px
    background: var(--app-color-background)
    border: 1px solid rgba(255, 255, 255, 0.12)
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35)

  .popover a
    width: 100%
    display: flex
    align-items: center
    justify-content: space-between
    padding: 10px 10px
    border-radius: 10px
    background: transparent
    color: var(--app-color-text)
    opacity: 0.9

  .popover a:hover
    background: rgba(255, 255, 255, 0.06)

  .popover a.active
    opacity: 1
    color: var(--app-color-primary)
    background: rgba(255, 255, 255, 0.06)

  .left
    display: inline-flex
    align-items: center
    gap: 10px

  .flag
    font-size: 14px
    line-height: 14px

  .label
    font-size: 13px

  .check
    font-size: 12px
</style>
