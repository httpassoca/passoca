<script lang="ts">
  import { SearchPalette, type SearchPaletteItem } from "dssoca";
  import { getLocale, localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
  import { searchOpen } from "$lib/stores/search.store";
  import type { SearchApi, SearchDocType } from "$lib/search";
  import type { SnippetPart } from "$lib/search/text";
  import type { Locale } from "$lib/posts";

  type Item = SearchPaletteItem & { snippet?: SnippetPart[] };

  let engine = $state<SearchApi | null>(null);
  let query = $state("");

  // The engine (minisearch + all post bodies) only loads on first open.
  async function loadEngine() {
    if (engine) return;
    const mod = await import("$lib/search");
    engine = mod.getSearch(getLocale() as Locale);
  }

  const groupLabels: Record<SearchDocType, () => string> = {
    page: m.search_group_pages,
    post: m.search_group_posts,
    project: m.search_group_projects,
  };

  // Empty query shows the static pages as quick-jumps. Results arrive already
  // grouped page → post → project, and dssoca renders groups in
  // first-appearance order, so no extra sorting is needed.
  const items: Item[] = $derived.by(() => {
    if (!engine) return [];
    const docs = query.trim() ? engine.query(query) : engine.pages;
    return docs.map(
      (doc): Item => ({
        id: doc.id,
        label: doc.title,
        href: localizeHref(doc.href),
        group: groupLabels[doc.type](),
        snippet: "snippet" in doc ? doc.snippet : undefined,
      })
    );
  });
</script>

<SearchPalette
  bind:open={$searchOpen}
  bind:query
  {items}
  filter={false}
  placeholder={m.search_placeholder()}
  aria-label={m.search_title()}
  footerText={m.search_hint()}
  onopen={loadEngine}
>
  {#snippet item(it, { active: _active })}
    {it.label}
    {#if it.snippet?.length}
      <span class="snippet">
        {#each it.snippet as part, i (i)}{#if part.hit}<mark
            >{part.text}</mark
          >{:else}{part.text}{/if}{/each}
      </span>
    {/if}
  {/snippet}

  {#snippet empty(q)}
    {#if engine}
      {m.search_no_results()} “{q.trim()}”
    {:else}
      …
    {/if}
  {/snippet}
</SearchPalette>

<style lang="sass">
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
</style>
