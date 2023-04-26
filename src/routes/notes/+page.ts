import { capitalize } from "$lib/helpers/helpers";
import type { Note } from "$lib/posts";
import { supabase } from "$lib/supabase";
import type { PageData } from "./$types";

export const load = (async () => {
  if (!supabase) {
    return {};
  }

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
    notes,
  };
}) satisfies PageData;
