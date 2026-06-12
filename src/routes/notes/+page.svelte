<script lang="ts">
  import { marked } from "marked";
  import prism from "prismjs";
  import "prism-svelte";
  import { supabase } from "$lib/supabase";
  import type { PageData } from "./$types";
  import { Accordion, Container, Heading, Spinner } from "dssoca";
  import AppError from "$lib/components/Base/AppError.svelte";
  import { m } from "$lib/paraglide/messages";

  export let data: PageData;
  export let { notes } = data;

  // Highlight the code
  marked.setOptions({
    highlight: function (code, lang) {
      if (prism.languages[lang]) {
        return prism.highlight(code, prism.languages[lang], lang);
      } else {
        return code;
      }
    },
  });

  $: items = notes.map((note) => ({ id: note.slug, label: note.title }));

  // Lazy-load each note's markdown the first time its panel opens.
  let promises: Record<string, Promise<string | undefined>> = {};
  function handleChange(value: string | string[] | undefined) {
    const open = Array.isArray(value) ? value : value ? [value] : [];
    for (const slug of open) {
      if (!promises[slug]) {
        promises = { ...promises, [slug]: getNote(slug) };
      }
    }
  }

  const getNote = async (slug: string) => {
    if (!supabase) {
      return;
    }
    const md = await supabase.storage
      .from("passoca")
      .download(`notes/${slug}.md`);
    const text = await md.data.text();
    const markdownText = marked.parse(text);

    notes.filter((note) => note.slug === slug)[0].text = markdownText;
    return markdownText;
  };
</script>

<Container page>
  <Heading>{m.notes_title()}</Heading>
  <Accordion {items} multiple onChange={handleChange}>
    {#snippet panel(item)}
      {#if promises[item.id]}
        {#await promises[item.id]}
          <div class="flex justify-center mt-4">
            <Spinner variant="squareCorners" />
          </div>
        {:then text}
          <div class="note">
            {@html text}
          </div>
        {:catch}
          <AppError />
        {/await}
      {/if}
    {/snippet}
  </Accordion>
  {#if !notes.length}
    <AppError />
  {/if}
</Container>

<style lang="sass">
.note :global
  padding-bottom: 2px
  code, pre
    font-size: 15px
  pre code
    font-size: 15px
  a
    border-bottom: 1px solid var(--app-color-primary)
  img
    margin: 1em auto
    box-shadow:  0px 0px 8px 0px #0000009e
    max-width: calc(100% - 14px)
</style>
