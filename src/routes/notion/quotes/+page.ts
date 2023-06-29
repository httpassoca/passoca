import { supabase } from "$lib/supabase";
import type { PageData } from "./$types";

export const load = (async () => {
  if (!supabase) {
    return {};
  }

  const { data: quote, error } = await supabase.rpc('random_quote')
  if (error) {
    throw new Error(`Error fetching random row: ${error.message}`);
  }

  return { quote: quote[0] };
}) satisfies PageData;