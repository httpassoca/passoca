import { error as kitError } from "@sveltejs/kit";
import { supabase } from "$lib/supabase";
import type { PageData } from "./$types";

export const load = (async () => {
  if (!supabase) {
    return { quote: null };
  }

  const { data: quote, error } = await supabase.rpc("random_quote");
  if (error) {
    throw kitError(503, `Quotes temporarily unavailable: ${error.message}`);
  }

  return { quote: quote?.[0] ?? null };
}) satisfies PageData;
