import { supabase } from "$lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export type RouletteOption = {
  id: string;
  created_at: string;
  author: string;
  text: string;
  picked: boolean;
};

export type RouletteState = {
  max_picks: number;
  winner_id: string | null;
  spin_turns: number | null;
  spun_at: string | null;
};

export type RouletteData = { options: RouletteOption[]; state: RouletteState };

export const DEFAULT_STATE: RouletteState = {
  max_picks: 1,
  winner_id: null,
  spin_turns: null,
  spun_at: null,
};

export interface RouletteBackend {
  /** true = Supabase (shared with friends); false = this browser only. */
  shared: boolean;
  load(): Promise<RouletteData>;
  addOption(author: string, text: string): Promise<void>;
  removeOption(id: string): Promise<void>;
  setPicked(id: string, picked: boolean): Promise<void>;
  setMaxPicks(maxPicks: number): Promise<void>;
  spin(winnerId: string, turns: number): Promise<void>;
  clearSpin(): Promise<void>;
  /** Fires when the data changed somewhere else. Returns an unsubscribe fn. */
  subscribe(onChange: () => void): () => void;
}

function supabaseBackend(client: SupabaseClient): RouletteBackend {
  const state = async (patch: Partial<RouletteState>) => {
    const { error } = await client
      .from("roulette_state")
      .update(patch)
      .eq("id", 1);
    if (error) throw error;
  };

  return {
    shared: true,

    async load() {
      const [options, st] = await Promise.all([
        client
          .from("roulette_options")
          .select("*")
          .order("created_at", { ascending: true }),
        client.from("roulette_state").select("*").eq("id", 1).maybeSingle(),
      ]);
      if (options.error) throw options.error;
      if (st.error) throw st.error;
      return {
        options: (options.data ?? []) as RouletteOption[],
        state: (st.data as RouletteState | null) ?? { ...DEFAULT_STATE },
      };
    },

    async addOption(author, text) {
      const { error } = await client
        .from("roulette_options")
        .insert({ author, text });
      if (error) throw error;
    },

    async removeOption(id) {
      const { error } = await client
        .from("roulette_options")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },

    async setPicked(id, picked) {
      const { error } = await client
        .from("roulette_options")
        .update({ picked })
        .eq("id", id);
      if (error) throw error;
    },

    setMaxPicks: (max_picks) => state({ max_picks }),

    spin: (winner_id, spin_turns) =>
      state({ winner_id, spin_turns, spun_at: new Date().toISOString() }),

    clearSpin: () =>
      state({ winner_id: null, spin_turns: null, spun_at: null }),

    subscribe(onChange) {
      const channel = client
        .channel("roulette")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "roulette_options" },
          onChange
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "roulette_state" },
          onChange
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    },
  };
}

/**
 * localStorage fallback so the page still works without Supabase env vars
 * (dev, or a clone of the repo). Multi-tab only, not multi-person.
 */
function localBackend(): RouletteBackend {
  const KEY = "passoca:roulette";

  const read = (): RouletteData => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) as RouletteData;
    } catch {
      // corrupt payload; start fresh
    }
    return { options: [], state: { ...DEFAULT_STATE } };
  };

  const write = (db: RouletteData) =>
    localStorage.setItem(KEY, JSON.stringify(db));

  const mutate = async (fn: (db: RouletteData) => void) => {
    const db = read();
    fn(db);
    write(db);
  };

  return {
    shared: false,

    load: async () => read(),

    addOption: (author, text) =>
      mutate((db) => {
        db.options.push({
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          author,
          text,
          picked: false,
        });
      }),

    removeOption: (id) =>
      mutate((db) => {
        db.options = db.options.filter((o) => o.id !== id);
        if (db.state.winner_id === id) db.state.winner_id = null;
      }),

    setPicked: (id, picked) =>
      mutate((db) => {
        const option = db.options.find((o) => o.id === id);
        if (option) option.picked = picked;
      }),

    setMaxPicks: (max_picks) =>
      mutate((db) => {
        db.state.max_picks = max_picks;
      }),

    spin: (winner_id, spin_turns) =>
      mutate((db) => {
        db.state.winner_id = winner_id;
        db.state.spin_turns = spin_turns;
        db.state.spun_at = new Date().toISOString();
      }),

    clearSpin: () =>
      mutate((db) => {
        db.state.winner_id = null;
        db.state.spin_turns = null;
        db.state.spun_at = null;
      }),

    subscribe(onChange) {
      const handler = (e: StorageEvent) => {
        if (e.key === KEY) onChange();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
  };
}

export function getRouletteBackend(): RouletteBackend {
  return supabase ? supabaseBackend(supabase) : localBackend();
}
