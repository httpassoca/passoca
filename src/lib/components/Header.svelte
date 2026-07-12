<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { theme, themeEntry, THEMES } from "$lib/stores/theme.store";
  import SVG from "./Base/AppSVG.svelte";
  import { Menu, Spinner, Topbar, Kbd, ariaKeyshortcuts, shortcuts } from "dssoca";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import { openSearch } from "$lib/stores/search.store";
  let animation = false;

  onMount(() => {
    if (!browser) return;
    // Digit keys 1–4 jump to the matching Topbar tab (the tabs are already
    // numbered visually). Modifier-less on purpose: mod/ctrl+digit is browser
    // tab switching and alt+digit collides with menus/accesskey — the registry
    // already skips inputs and honors the character-key kill switch.
    const disposers = navTabs.map((t, i) =>
      shortcuts.add({
        id: `app:nav-${t.id}`,
        label: shortcutLabels[t.id],
        keys: String(i + 1),
        group: m.shortcuts_group_nav(),
        onPress: () => goto(localizeHref(t.path)),
      })
    );
    // L / T cycle language and theme — same actions as the Topbar menus.
    disposers.push(
      shortcuts.add({
        id: "app:language",
        label: m.shortcuts_language(),
        keys: "l",
        group: m.shortcuts_group_prefs(),
        onPress: () => {
          const next = locales[(locales.indexOf(activeLocale) + 1) % locales.length];
          // Full reload, like the language menu (paraglide URL strategy).
          window.location.href = localizeHref(pathname, { locale: next });
        },
      }),
      shortcuts.add({
        id: "app:theme",
        label: m.shortcuts_theme(),
        keys: "t",
        group: m.shortcuts_group_prefs(),
        onPress: () => {
          const i = THEMES.findIndex((t) => t.id === $theme);
          theme.set(THEMES[(i + 1) % THEMES.length].id);
        },
      })
    );
    return () => disposers.forEach((dispose) => dispose());
  });

  $: themeItems = THEMES.map((t) => ({
    id: t.id as string,
    label: t.label,
    swatch: t.swatch,
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
  // Shortcut labels for ShortcutsHelp; locale changes reload the page, so
  // registering them once in onMount is safe.
  const shortcutLabels: Record<string, string> = {
    home: m.shortcuts_go_home(),
    career: m.shortcuts_go_career(),
    projects: m.shortcuts_go_projects(),
    blog: m.shortcuts_go_blog(),
  };
  $: tabs = navTabs.map((t) => ({
    id: t.id,
    label: tabLabels[t.id],
    href: localizeHref(t.path),
  }));
  $: activeTab = navTabs.find((t) => pathname === t.path)?.id;
</script>

<svelte:head>
  <meta name="theme-color" content={$themeEntry.themeColor} />
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
      <button
        class="search-button"
        on:click={openSearch}
        aria-label={m.search_title()}
        aria-keyshortcuts={ariaKeyshortcuts("mod+k")}
      >
        <SVG
          name="search"
          width="22"
          height="22"
          fill='var(--app-color-text)'
        />
        <Kbd keys="mod+k" />
      </button>
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

.search-button
  display: flex
  align-items: center
  gap: 6px
  padding: 0
  background: none
  border: none
  color: var(--app-color-text)
  cursor: pointer

.flag
  font-size: 14px
  line-height: 14px

// Mobile navigation lives in the BottomNav; the Topbar is desktop-only
// (responsive tabs tracked as dssoca DS-0082)
@media (max-width: 767px)
  :global(.ss-topbar)
    display: none
</style>
