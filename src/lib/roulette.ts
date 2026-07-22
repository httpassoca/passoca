export type RouletteOption = { id: string; author: string; text: string };
export type Pad = { text: string; t: number };
export type WheelState = {
  options: RouletteOption[];
  max_picks: number;
  winner_id: string | null;
  spin_turns: number | null;
  spun_at: string | null;
};
export type RouletteDoc = { pads: Record<string, Pad>; wheel: WheelState };

export const DEFAULT_WHEEL: WheelState = {
  options: [],
  max_picks: 1,
  winner_id: null,
  spin_turns: null,
  spun_at: null,
};

export interface RouletteBackend {
  /** true = synced through /roulette/api; false = this browser only. */
  shared: boolean;
  load(): Promise<RouletteDoc>;
  savePad(author: string, text: string): Promise<RouletteDoc>;
  addOption(author: string, text: string): Promise<RouletteDoc>;
  removeOption(id: string): Promise<RouletteDoc>;
  setMaxPicks(value: number): Promise<RouletteDoc>;
  spin(winnerId: string, turns: number): Promise<RouletteDoc>;
  clearSpin(): Promise<RouletteDoc>;
  /** Fires when the data may have changed elsewhere. Returns an unsubscribe fn. */
  subscribe(onChange: () => void): () => void;
}

const API = "/roulette/api";
const POLL_MS = 2500;

function apiBackend(): RouletteBackend {
  const request = async (init?: RequestInit): Promise<RouletteDoc> => {
    const res = await fetch(API, init);
    if (!res.ok) throw new Error(`api ${res.status}`);
    const data = await res.json();
    return { pads: data.pads ?? {}, wheel: { ...DEFAULT_WHEEL, ...data.wheel } };
  };

  const post = (payload: Record<string, unknown>) =>
    request({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  return {
    shared: true,
    load: () => request(),
    savePad: (author, text) => post({ action: "pad", author, text }),
    addOption: (author, text) => post({ action: "add_option", author, text }),
    removeOption: (id) => post({ action: "remove_option", id }),
    setMaxPicks: (value) => post({ action: "set_max", value }),
    spin: (winner_id, turns) => post({ action: "spin", winner_id, turns }),
    clearSpin: () => post({ action: "clear_spin" }),
    subscribe(onChange) {
      const poll = setInterval(onChange, POLL_MS);
      return () => clearInterval(poll);
    },
  };
}

/**
 * localStorage fallback so the page still works when the API has no storage
 * configured (local dev). Multi-tab only, not multi-person.
 */
function localBackend(): RouletteBackend {
  const KEY = "passoca:roulette";

  const read = (): RouletteDoc => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const doc = JSON.parse(raw) as RouletteDoc;
        return {
          pads: doc.pads ?? {},
          wheel: { ...DEFAULT_WHEEL, ...doc.wheel },
        };
      }
    } catch {
      // corrupt payload; start fresh
    }
    return { pads: {}, wheel: { ...DEFAULT_WHEEL } };
  };

  const mutate = async (fn: (doc: RouletteDoc) => void): Promise<RouletteDoc> => {
    const doc = read();
    fn(doc);
    localStorage.setItem(KEY, JSON.stringify(doc));
    return doc;
  };

  return {
    shared: false,
    load: async () => read(),

    savePad: (author, text) =>
      mutate((doc) => {
        doc.pads[author] = { text, t: Date.now() };
      }),

    addOption: (author, text) =>
      mutate((doc) => {
        doc.wheel.options.push({ id: crypto.randomUUID(), author, text });
      }),

    removeOption: (id) =>
      mutate((doc) => {
        doc.wheel.options = doc.wheel.options.filter((o) => o.id !== id);
        if (doc.wheel.winner_id === id) doc.wheel.winner_id = null;
      }),

    setMaxPicks: (value) =>
      mutate((doc) => {
        doc.wheel.max_picks = value;
      }),

    spin: (winner_id, spin_turns) =>
      mutate((doc) => {
        doc.wheel.winner_id = winner_id;
        doc.wheel.spin_turns = spin_turns;
        doc.wheel.spun_at = new Date().toISOString();
      }),

    clearSpin: () =>
      mutate((doc) => {
        doc.wheel.winner_id = null;
        doc.wheel.spin_turns = null;
        doc.wheel.spun_at = null;
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

/** Probes the API once: shared backend when storage is configured, else local. */
export async function createRouletteBackend(): Promise<RouletteBackend> {
  try {
    const res = await fetch(API);
    if (res.ok && (await res.json()).configured) return apiBackend();
  } catch {
    // API unreachable; fall through to local
  }
  return localBackend();
}
