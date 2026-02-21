import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const hasValidUrl =
  typeof supabaseUrl === "string" && /^https?:\/\//.test(supabaseUrl);
const hasKey = typeof supabaseKey === "string" && supabaseKey.length > 0;

export const supabase =
  hasValidUrl && hasKey ? createClient(supabaseUrl, supabaseKey) : null;
