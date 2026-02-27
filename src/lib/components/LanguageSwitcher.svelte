<script lang="ts">
  import { page } from "$app/stores";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
</script>

<nav class="lang" aria-label={m.i18n_switch()}>
  {#each locales as l}
    <a
      href={localizeHref($page.url.pathname, { locale: l })}
      data-sveltekit-reload
      class:active={$page.url.pathname.startsWith(`/${l}`)}
      >{l === "pt-BR" ? "PT" : l.toUpperCase()}</a
    >
  {/each}
</nav>

<style lang="sass">
  nav.lang
    display: flex
    gap: 6px

  nav.lang a
    border: 1px solid rgba(255, 255, 255, 0.12)
    border-radius: 8px
    padding: 4px 8px
    font-size: 12px
    line-height: 14px
    opacity: 0.85

  nav.lang a.active
    opacity: 1
    border-color: var(--app-color-primary)
</style>
