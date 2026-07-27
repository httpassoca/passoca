import { writable, type Writable } from "svelte/store";
import { io, type Socket } from "socket.io-client";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { CHART_PALETTE } from "dssoca";

export const ADMIN_NAME = "passoca";
const IDEAS_DOC = "ideas";

export type Option = {
  id: string;
  author: string;
  color: string | null;
  text: string;
  created_at: string;
};

export type WheelState = {
  options: Option[];
  max_picks: number;
  winner_id: string | null;
  spin_turns: number | null;
  spun_at: string | null;
};

export type HistoryEntry = {
  id: string;
  title: string;
  author: string | null;
  drawn_at: string;
  created_at: string;
};

export type Presence = { name: string; color: string | null };

export const DEFAULT_WHEEL: WheelState = {
  options: [],
  max_picks: 1,
  winner_id: null,
  spin_turns: null,
  spun_at: null,
};

/** Stable, readable colour derived from a name so identity is consistent. */
export function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const palette = CHART_PALETTE as readonly string[];
  return palette[Math.abs(hash) % palette.length];
}

export function isAdmin(name: string): boolean {
  return name.trim() === ADMIN_NAME;
}

export interface RouletteClient {
  connected: Writable<boolean>;
  wheel: Writable<WheelState>;
  history: Writable<HistoryEntry[]>;
  presence: Writable<Presence[]>;
  /** This user's private notes — the server only sends them to their name. */
  personal: Writable<string>;
  /** Shared Yjs doc + provider for the collaborative ideas editor. */
  doc: Y.Doc;
  provider: SocketIOProvider;

  identify(name: string, color: string | null): void;
  addOption(author: string, text: string, color: string | null): void;
  removeOption(id: string): void;
  setMaxPicks(value: number): void;
  spin(turns?: number): void;
  clearSpin(): void;
  editHistory(id: string, title: string, drawnAt: string): void;
  removeHistory(id: string): void;
  setPersonal(content: string): void;

  onError(cb: (message: string) => void): () => void;
  destroy(): void;
}

/** Normalises the API base (strip trailing slash). */
function normalizeBase(url: string): string {
  return url.replace(/\/+$/, "");
}

export function createRouletteClient(apiUrl: string): RouletteClient {
  const base = normalizeBase(apiUrl);

  const connected = writable(false);
  const wheel = writable<WheelState>({ ...DEFAULT_WHEEL });
  const history = writable<HistoryEntry[]>([]);
  const presence = writable<Presence[]>([]);
  const personal = writable<string>("");
  const errorCbs = new Set<(m: string) => void>();

  // Default transports (polling first, then upgrade to websocket): starting
  // with websocket hangs forever when the reverse proxy drops the Upgrade
  // handshake, since socket.io never falls back from a pinned transport.
  const socket: Socket = io(`${base}/roulette`);

  socket.on("connect", () => connected.set(true));
  socket.on("disconnect", () => connected.set(false));
  socket.on("wheel", (w: WheelState) => wheel.set({ ...DEFAULT_WHEEL, ...w }));
  socket.on("history", (h: HistoryEntry[]) => history.set(h ?? []));
  socket.on("presence", (p: Presence[]) => presence.set(p ?? []));
  socket.on("personal", (c: string) => personal.set(typeof c === "string" ? c : ""));
  socket.on("roulette:error", (m: string) => errorCbs.forEach((cb) => cb(m)));

  // Collaborative ideas document.
  const doc = new Y.Doc();
  const provider = new SocketIOProvider(base, IDEAS_DOC, doc, {});

  return {
    connected,
    wheel,
    history,
    presence,
    personal,
    doc,
    provider,

    identify: (name, color) => socket.emit("identify", { name, color }),
    addOption: (author, text, color) =>
      socket.emit("option:add", { author, text, color }),
    removeOption: (id) => socket.emit("option:remove", { id }),
    setMaxPicks: (value) => socket.emit("wheel:set_max", { value }),
    spin: (turns) => socket.emit("wheel:spin", { turns }),
    clearSpin: () => socket.emit("wheel:clear_spin"),
    editHistory: (id, title, drawn_at) =>
      socket.emit("history:edit", { id, title, drawn_at }),
    removeHistory: (id) => socket.emit("history:remove", { id }),
    setPersonal: (content) => socket.emit("personal:set", { content }),

    onError: (cb) => {
      errorCbs.add(cb);
      return () => errorCbs.delete(cb);
    },
    destroy: () => {
      errorCbs.clear();
      try {
        provider.destroy();
      } catch {
        /* ignore */
      }
      doc.destroy();
      socket.disconnect();
    },
  };
}
