<script lang="ts">
  import { tick } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { getLocale, localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import { searchOpen, closeSearch, toggleSearch } from "$lib/stores/search.store";
  import type { SearchApi, SearchDocType, SearchResult } from "$lib/search";
  import type { Locale } from "$lib/posts";

  type Item = Omit<SearchResult, "snippet"> & Partial<Pick<SearchResult, "snippet">>;

  let inputEl: HTMLInputElement | null = null;
  let listEl: HTMLElement | null = null;
  let engine: SearchApi | null = null;
  let loading = false;
  let query = "";
  let selected = 0;
  let previousFocus: HTMLElement | null = null;

  // The engine (minisearch + all post bodies) only loads on first open.
  async function loadEngine() {
    if (engine || loading) return;
    loading = true;
    try {
      const mod = await import("$lib/search");
      engine = mod.getSearch(getLocale() as Locale);
    } finally {
      loading = false;
    }
  }

  let wasOpen = false;
  $: syncOpenState($searchOpen);
  function syncOpenState(open: boolean) {
    if (open && !wasOpen) {
      wasOpen = true;
      onOpen();
    } else if (!open && wasOpen) {
      wasOpen = false;
      onClose();
    }
  }

  async function onOpen() {
    previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    await tick();
    inputEl?.focus();
    loadEngine();
  }

  // Single close path for Esc / backdrop / Enter / link click / navigation.
  function onClose() {
    document.body.style.overflow = "";
    query = "";
    selected = 0;
    previousFocus?.focus?.();
    previousFocus = null;
  }

  afterNavigate(() => {
    if ($searchOpen) closeSearch();
  });

  function onWindowKeydown(e: KeyboardEvent) {
    if (e.isComposing) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      // Ctrl+K is the browser's address-bar/search shortcut
      e.preventDefault();
      toggleSearch();
      return;
    }
    if ($searchOpen && e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  }

  function onInputKeydown(e: KeyboardEvent) {
    if (e.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[selected];
      if (item) {
        // Real navigation via the option's <a>, so SvelteKit handles it the
        // same way for Enter and click; afterNavigate closes the palette.
        optionAnchor(selected)?.click();
      }
    } else if (e.key === "Tab") {
      // Focus stays on the input while the palette is open
      e.preventDefault();
    }
  }

  function optionAnchor(index: number): HTMLAnchorElement | null {
    return listEl?.querySelector(`#search-option-${index} a`) ?? null;
  }

  async function move(delta: number) {
    if (!items.length) return;
    selected = (selected + delta + items.length) % items.length;
    await tick();
    listEl
      ?.querySelector(`#search-option-${selected}`)
      ?.scrollIntoView({ block: "nearest" });
  }

  $: results = engine && query.trim() ? engine.query(query) : [];
  $: quickJumps = engine
    ? engine.pages.map(
        (p): Item => ({ id: p.id, type: p.type, title: p.title, href: p.href })
      )
    : [];
  $: items = (query.trim() ? results : quickJumps) as Item[];
  $: groups = groupItems(items);

  const groupOrder: SearchDocType[] = ["page", "post", "project"];
  $: groupLabels = {
    page: m.search_group_pages(),
    post: m.search_group_posts(),
    project: m.search_group_projects(),
  } as Record<SearchDocType, string>;

  // Items arrive already grouped page → post → project, so per-type grouping
  // preserves the flat order used by keyboard selection.
  function groupItems(list: Item[]) {
    let index = 0;
    return groupOrder
      .map((type) => ({
        type,
        items: list.filter((i) => i.type === type).map((item) => ({ item, index: index++ })),
      }))
      .filter((g) => g.items.length);
  }

  function onQueryInput() {
    selected = 0;
  }
</script>

<svelte:window on:keydown={onWindowKeydown} />

{#if $searchOpen}
  <div class="overlay">
    <button
      class="backdrop"
      tabindex="-1"
      aria-label={m.search_title()}
      on:click={() => closeSearch()}
    ></button>
    <div class="panel" role="dialog" aria-modal="true" aria-label={m.search_title()}>
      <input
        bind:this={inputEl}
        bind:value={query}
        on:input={onQueryInput}
        on:keydown={onInputKeydown}
        type="text"
        placeholder={m.search_placeholder()}
        spellcheck="false"
        autocomplete="off"
        role="combobox"
        aria-expanded={items.length > 0}
        aria-controls="search-listbox"
        aria-activedescendant={items.length ? `search-option-${selected}` : undefined}
      />

      <div class="results" bind:this={listEl}>
        {#if loading && !engine}
          <p class="state">…</p>
        {:else if query.trim() && !items.length}
          <p class="state">{m.search_no_results()} “{query.trim()}”</p>
        {:else}
          <ul id="search-listbox" role="listbox" aria-label={m.search_title()}>
            {#each groups as group (group.type)}
              <li class="group" role="presentation">
                <span class="group-label">{groupLabels[group.type]}</span>
                <ul role="presentation">
                  {#each group.items as { item, index } (item.id)}
                    <li
                      id="search-option-{index}"
                      role="option"
                      aria-selected={index === selected}
                    >
                      <a
                        href={localizeHref(item.href)}
                        class:selected={index === selected}
                        tabindex="-1"
                        on:mousemove={() => (selected = index)}
                        on:click={() => closeSearch()}
                      >
                        <span class="title">{item.title}</span>
                        {#if item.snippet?.length}
                          <span class="snippet">
                            {#each item.snippet as part, i (i)}{#if part.hit}<mark
                                >{part.text}</mark
                              >{:else}{part.text}{/if}{/each}
                          </span>
                        {/if}
                      </a>
                    </li>
                  {/each}
                </ul>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <footer>{m.search_hint()}</footer>
    </div>
  </div>
{/if}

<style lang="sass">
.overlay
  position: fixed
  inset: 0
  // above dssoca Topbar (10/20), BottomNav (30) and Menu (50)
  z-index: 100
  font-family: var(--ss-font-mono)

.backdrop
  position: absolute
  inset: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.6)
  border: none
  padding: 0
  cursor: default

.panel
  position: relative
  margin: 15vh auto 0
  width: min(640px, calc(100vw - 32px))
  display: flex
  flex-direction: column
  background: var(--ss-bg-elev)
  border: 1px solid var(--ss-line-strong)
  border-radius: 0

input
  width: 100%
  padding: 14px 16px
  background: transparent
  border: none
  border-bottom: 1px solid var(--ss-line)
  color: var(--ss-fg)
  font-family: inherit
  font-size: 15px
  &:focus
    outline: none
    border-bottom-color: var(--ss-primary)
  &::placeholder
    color: var(--ss-fg-muted)

.results
  overflow-y: auto
  max-height: 60vh
  overscroll-behavior: contain

ul
  list-style: none
  margin: 0
  padding: 0

.state
  padding: 16px
  font-size: 13px
  color: var(--ss-fg-muted)

.group-label
  display: block
  padding: 10px 16px 4px
  font-size: 11px
  text-transform: uppercase
  letter-spacing: 0.08em
  color: var(--ss-fg-muted)

a
  display: block
  padding: 8px 16px 8px 14px
  border-left: 2px solid transparent
  color: var(--ss-fg)
  text-decoration: none
  &.selected
    background: var(--ss-primary-soft)
    border-left-color: var(--ss-primary)

.title
  display: block
  font-size: 14px
  line-height: 20px

.snippet
  display: block
  margin-top: 2px
  font-size: 12px
  line-height: 16px
  color: var(--ss-fg-muted)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  mark
    background: var(--ss-primary-soft)
    color: var(--ss-primary)

footer
  padding: 8px 16px
  border-top: 1px solid var(--ss-line)
  font-size: 11px
  color: var(--ss-fg-muted)

@media (max-width: 767px)
  .panel
    margin: 0
    width: 100vw
    // dvh: keep the input visible when the mobile keyboard opens
    height: 100dvh
  .results
    flex: 1
    max-height: none
</style>
