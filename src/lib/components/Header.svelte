<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Loader from "$lib/components/Base/AppLoader.svelte";
  import { theme } from "$lib/stores/theme.store";
  import type { Theme } from "$lib/stores/theme.store";
  import SVG from "./Base/AppSVG.svelte";
  import { Menu } from "dssoca";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  let animation = false;

  const themes: { id: Theme; label: string; themeColor?: string }[] = [
    { id: "dark", label: "Dark", themeColor: "#0b1220" },
    { id: "light", label: "Light", themeColor: "#ffffff" },
    { id: "coffee", label: "Coffee", themeColor: "#f9dec9" },
    { id: "dracula", label: "Dracula", themeColor: "#282a36" },
    { id: "tokyo-night", label: "Tokyo Night", themeColor: "#1a1b26" },
  ];

  onMount(() => {
    if (!browser) return;
    const localTheme = localStorage.getItem("theme") as Theme | null;
    if (localTheme && themes.some((t) => t.id === localTheme)) theme.set(localTheme);
  });

  $: current = themes.find((t) => t.id === $theme);
  $: themeItems = themes.map((t) => ({
    id: t.id as string,
    label: t.label,
    selected: t.id === $theme,
    onSelect: () => theme.set(t.id),
  }));

  type LocaleInfo = { id: string; label: string; flag: string };

  const localeInfo: Record<string, LocaleInfo> = {
    en: { id: "en", label: "English", flag: "🇺🇸" },
    "pt-BR": { id: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  };

  function getActiveLocale(pathname: string) {
    const found = locales.find((l) => pathname.startsWith(`/${l}`));
    return found ?? (locales[0] as any);
  }

  $: pathname = $page.url.pathname;
  $: activeLocale = getActiveLocale(pathname);
  $: activeLocaleInfo = localeInfo[activeLocale] ?? {
    id: activeLocale,
    label: activeLocale,
    flag: "🏳️",
  };
  // Menu items only take dssoca icon names, so the flag is folded into the label.
  // Locale switching needs a full page reload (paraglide URL strategy), hence
  // window.location instead of an href item.
  $: langItems = locales.map((l) => {
    const info = localeInfo[l] ?? { id: l, label: l, flag: "🏳️" };
    return {
      id: l as string,
      label: `${info.flag} ${info.label}`,
      selected: l === activeLocale,
      onSelect: () => {
        window.location.href = localizeHref(pathname, { locale: l });
      },
    };
  });
</script>

<svelte:head>
  {#if current?.themeColor}
    <meta name="theme-color" content={current.themeColor} />
  {/if}
</svelte:head>

<header class="px-4 md:px-0">
  <div class="md:container md:px-0">
    <a
      href={localizeHref("/")}
      class="logo"
      on:mouseenter={() => (animation = true)}
      on:mouseleave={() => (animation = false)}
    >
      {#if animation}
        <Loader />
      {:else}
        <span>
          <svg
            viewBox="0 0 103 89"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M51.5 0L0 89H103L51.5 0ZM23.8643 80.151H87.6468L71.6884 52.5724L23.8643 80.151ZM65.5911 42.0354L60.7383 33.649L46.1956 42.0354H65.5911ZM56.14 25.7024L51.5 17.6837L42.2125 33.7339L56.14 25.7024ZM32.0977 51.2138L20.2949 71.6111L55.6656 51.2138H32.0977Z"
              fill="currentColor"
            />
          </svg>
        </span>
      {/if}
    </a>
    <nav class="hidden md:flex">
      <a class:actual={$page.url.pathname === "/"} href={localizeHref("/")}
        >{m.nav_home()}</a
      >
      <a class:actual={$page.url.pathname === "/career"} href={localizeHref("/career")}
        >{m.nav_career()}</a
      >
      <a class:actual={$page.url.pathname === "/projects"} href={localizeHref("/projects")}
        >{m.nav_projects()}</a
      >
      <a class:actual={$page.url.pathname === "/blog"} href={localizeHref("/blog")}
        >{m.nav_blog()}</a
      >
      <!-- <a class:actual={$page.url.pathname === "/notes"} href="/notes">notes</a> -->
      <!-- <a class:actual={$page.url.pathname === "/contact"} href="/contact">contact</a> -->
    </nav>
    <div class="icons">
      <a href="/linkedin" target="_blank">
        <SVG
          name="linkedin"
          width="23"
          height="23"
          fill='var(--app-color-text)'
        />
      </a>
      <a href="/github" target="_blank">
        <SVG
          name="github"
          width="23"
          height="23"
          fill='var(--app-color-text)'
        />
      </a>
      <div>
        <Menu items={langItems} align="end" label={m.i18n_switch()}>
          <span class="flag">{activeLocaleInfo.flag}</span>
          <SVG
            name="language"
            width="24"
            height="24"
            fill='var(--app-color-text)'
          />
        </Menu>
      </div>
      <div>
        <Menu items={themeItems} align="end" label="Theme options">
          <SVG
            name="colorswatch"
            width="24"
            height="24"
            fill='var(--app-color-text)'
          />
        </Menu>
      </div>
    </div>
  </div>
</header>

<style lang="sass">
header
  @apply fixed z-10
  width: 100vw
  left: 50%
  top: 0
  transform: translateX(-50%)
  background-color: var(--app-color-background)
  box-shadow: 0px 0px 30px 20px var(--app-color-background)
  & > div
    @apply flex justify-between py-4 mx-auto
  a.logo
    color: var(--app-color-primary)
    height: 35px
    width: 35px
  nav
    align-items: center
    gap: 16px
    a
      transition: all .35s
      font-size: .8rem
    .actual
      color: var(--app-color-primary)

.icons
  @apply flex h-full items-center my-auto gap-2
  > *
    line-height: 24px
    display: block
    position: relative
    margin-right: 14px
    &::after
      content: ''
      height: 4px
      width: 4px
      display: block
      position: absolute
      right: -14px
      border-left: 3px solid transparent
      border-right: 3px solid transparent
      border-bottom: 5px solid var(--app-color-primary)
      top: 53%
      transform: translateY(-50%)

.flag
  font-size: 14px
  line-height: 14px
</style>
