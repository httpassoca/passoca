import { capitalize } from "$lib/helpers/helpers";
import type { Note } from "$lib/posts";
import { supabase } from "$lib/supabase";
import type { PageData } from "./$types";

export const load = (async () => {
  if (!supabase) {
    return {};
  }

  const { data, error } = await supabase.storage
    .from("passoca")
    .list("notes", { sortBy: { column: "updated_at", order: "desc" } });

  if (error) {
    // Notes are optional; fail closed.
    return { notes: [] };
  }

  const safeData = data ?? [];

  let notes: Note[] = [];
  safeData.map((note) => {
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
