<script context="module" lang="ts">
  import { capitalize } from "$lib/helpers/helpers";

  export async function load() {
    const { data } = await supabase.storage
      .from("passoca")
      .list("notes", { sortBy: { column: "updated_at", order: "desc" } });
    let notes: Note[] = [];
    data.map((note) => {
      let title = note.name.slice(0, -3).replace(/-/g, " ");
      title = capitalize(title);
      notes = [
        ...notes,
        {
          title,
          slug: note.name.slice(0, -3),
        },
      ];
    });

    return {
      props: {
        notes,
      },
    };
  }
</script>

<script lang="ts">
  import { marked } from "marked";
  import prism from "prismjs";
  import "prism-svelte";
  import { supabase } from "$lib/supabase";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Loader from "$lib/components/Base/AppLoader.svelte";
  import Extension from "$lib/components/Base/AppExtension.svelte";
  import type { Note } from "$lib/posts";

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
    const md = await supabase.storage
      .from("passoca")
      .download(`notes/${slug}.md`);
    const text = await md.data.text();
    const markdownText = marked.parse(text);

    notes.filter((note) => note.slug === slug)[0].text = markdownText;
    return markdownText;
  };

  export let notes: Note[] = [];
</script>

<Content page>
  <Title centered>Quick code notes ⚡</Title>
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
        <b>Error 🙃</b> <br />
        <span class="text-red-500"
          >This was not supposed to happen 😢 If you are reading this send a
          message to me@passoca.dev
        </span>
      {/await}
    </Extension>
  {/each}
</Content>

<style lang="sass">
.note :global
  code, pre
    font-size: 15px
  pre code
    font-size: 15px
  a
    border-bottom: 1px solid var(--app-color-primary)
</style>
