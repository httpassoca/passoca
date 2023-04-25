import { capitalize } from "$lib/helpers/helpers";

export async function load() {
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
}
