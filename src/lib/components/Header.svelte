<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { theme } from "$lib/stores/theme.store";
  import type { Theme } from "$lib/stores/theme.store";
  import SVG from "./Base/AppSVG.svelte";
  import { Menu, Spinner, Topbar } from "dssoca";
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
    swatch: t.themeColor,
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
  // Locale switching needs a full page reload (paraglide URL strategy), hence
  // window.location instead of an href item.
  $: langItems = locales.map((l) => {
    const info = localeInfo[l] ?? { id: l, label: l, flag: "🏳️" };
    return {
      id: l as string,
      label: info.label,
      emoji: info.flag,
      selected: l === activeLocale,
      onSelect: () => {
        window.location.href = localizeHref(pathname, { locale: l });
      },
    };
  });

  // Link tabs (dssoca DS-0080): real <a href> with aria-current, matched by id.
  const navTabs = [
    { id: "home", path: "/" },
    { id: "career", path: "/career" },
    { id: "projects", path: "/projects" },
    { id: "blog", path: "/blog" },
  ];
  $: tabLabels = {
    home: m.nav_home(),
    career: m.nav_career(),
    projects: m.nav_projects(),
    blog: m.nav_blog(),
  } as Record<string, string>;
  $: tabs = navTabs.map((t) => ({
    id: t.id,
    label: tabLabels[t.id],
    href: localizeHref(t.path),
  }));
  $: activeTab = navTabs.find((t) => pathname === t.path)?.id;
</script>

<svelte:head>
  {#if current?.themeColor}
    <meta name="theme-color" content={current.themeColor} />
  {/if}
</svelte:head>

<Topbar {tabs} active={activeTab} stats={[]} services={false} clock={false}>
  {#snippet brand()}
    <a
      href={localizeHref("/")}
      class="logo"
      on:mouseenter={() => (animation = true)}
      on:mouseleave={() => (animation = false)}
    >
      {#if animation}
        <Spinner variant="squareCorners" />
      {:else}
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
      {/if}
    </a>
  {/snippet}

  {#snippet userMenu()}
    <div class="icons">
      <a href="/github" target="_blank" aria-label="GitHub">
        <SVG
          name="github"
          width="23"
          height="23"
          fill='var(--app-color-text)'
        />
      </a>
      <Menu items={langItems} align="end" label={m.i18n_switch()}>
        <span class="flag">{activeLocaleInfo.flag}</span>
        <SVG
          name="language"
          width="24"
          height="24"
          fill='var(--app-color-text)'
        />
      </Menu>
      <Menu items={themeItems} align="end" label="Theme options">
        <SVG
          name="colorswatch"
          width="24"
          height="24"
          fill='var(--app-color-text)'
        />
      </Menu>
    </div>
  {/snippet}
</Topbar>

<style lang="sass">
.logo
  display: block
  color: var(--app-color-primary)
  height: 35px
  width: 35px

.icons
  display: flex
  align-items: center
  gap: 8px

.flag
  font-size: 14px
  line-height: 14px

// Mobile navigation lives in the BottomNav; the Topbar is desktop-only
// (responsive tabs tracked as dssoca DS-0082)
@media (max-width: 767px)
  :global(.ss-topbar)
    display: none
</style>
