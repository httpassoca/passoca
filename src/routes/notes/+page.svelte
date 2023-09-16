<script lang="ts">
  import { marked } from "marked";
  import prism from "prismjs";
  import "prism-svelte";
  import { supabase } from "$lib/supabase";
  import type { PageData } from "./$types";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Loader from "$lib/components/Base/AppLoader.svelte";
  import Extension from "$lib/components/Base/AppExtension.svelte";
  import AppError from "$lib/components/Base/AppError.svelte";

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

<Content page>
  <Title>Notes</Title>
  {#each notes as note (note.slug)}
    <Extension
      id={note.slug}
      title={note.title}
      on:open={() => (note.promise = note.promise || getNote(note.slug))}
    >
      {#await note.promise}
        <div class="flex justify-center mt-4">
          <Loader />
        </div>
      {:then text}
        <div class="note">
          {@html text}
        </div>
      {:catch}
        <AppError />
      {/await}
    </Extension>
  {/each}
  {#if !notes.length}
    <AppError />
  {/if}
</Content>

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
    border-radius: 4px
</style>
