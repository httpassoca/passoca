import { writable, type Writable } from "svelte/store";
import { io, type Socket } from "socket.io-client";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import {
  DEFAULT_TIERLIST,
  DEFAULT_WHEEL,
  type HistoryEntry,
  type Identity,
  type MediaPick,
  type Presence,
  type TierPlacement,
  type TierlistSnapshot,
  type TierlistState,
  type WheelState,
} from "./types";

const IDEAS_DOC = "ideas";

export interface RouletteClient {
  connected: Writable<boolean>;
  wheel: Writable<WheelState>;
  history: Writable<HistoryEntry[]>;
  presence: Writable<Presence[]>;
  /** This user's private notes — the server only sends them to their name. */
  personal: Writable<string>;
  /** Last identify ack; `admin` is only true after a password-verified join. */
  identity: Writable<Identity | null>;
  /** Aggregated + per-user tierlists (server does the scoring math). */
  tierlist: Writable<TierlistState>;
  /** General-tierlist timeline frames, oldest first (incl. hidden ones). */
  tierlistSnapshots: Writable<TierlistSnapshot[]>;
  /** Shared Yjs doc + provider for the collaborative ideas editor (lazy). */
  readonly doc: Y.Doc;
  readonly provider: SocketIOProvider;

  identify(name: string, color: string | null, password?: string): void;
  addOption(author: string, text: string, color: string | null, media?: MediaPick | null): void;
  removeOption(id: string): void;
  setMaxPicks(value: number): void;
  spin(turns?: number): void;
  clearSpin(): void;
  /** Admin-only: veto the winner AND retract the spin's history entry. */
  deny(): void;
  editHistory(id: string, title: string, drawnAt: string): void;
  removeHistory(id: string): void;
  setPersonal(content: string): void;
  setTierlist(placements: TierPlacement[]): void;
  /** Admin-only: wipe another user's tierlist (multi-account abuse). */
  removeTierlist(name: string): void;
  /** Admin-only: delete a user's notes; `wipe` also drops picks + tierlist. */
  removeUser(name: string, wipe: boolean): void;
  /** Admin-only: hide a timeline frame from playback, or restore it. */
  setSnapshotHidden(id: string, hidden: boolean): void;

  onError(cb: (message: string) => void): () => void;
  destroy(): void;
}

/** Normalises the API base (strip trailing slash). */
export function normalizeBase(url: string): string {
  return url.replace(/\/+$/, "");
}

export function createRouletteClient(apiUrl: string): RouletteClient {
  const base = normalizeBase(apiUrl);

  const connected = writable(false);
  const wheel = writable<WheelState>({ ...DEFAULT_WHEEL });
  const history = writable<HistoryEntry[]>([]);
  const presence = writable<Presence[]>([]);
  const personal = writable<string>("");
  const identity = writable<Identity | null>(null);
  const tierlist = writable<TierlistState>({ ...DEFAULT_TIERLIST });
  const tierlistSnapshots = writable<TierlistSnapshot[]>([]);
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
  socket.on("identified", (id: Identity) => identity.set(id ?? null));
  socket.on("tierlist", (t: TierlistState) => tierlist.set({ ...DEFAULT_TIERLIST, ...t }));
  socket.on("tierlist:snapshots", (s: TierlistSnapshot[]) =>
    tierlistSnapshots.set(Array.isArray(s) ? s : [])
  );
  socket.on("roulette:error", (m: string) => errorCbs.forEach((cb) => cb(m)));

  // Collaborative ideas document — created lazily so pages that never render
  // the ideas editor (e.g. the tierlist) don't open a Yjs provider socket.
  let ideas: { doc: Y.Doc; provider: SocketIOProvider } | null = null;
  const ensureIdeas = () => {
    if (!ideas) {
      const doc = new Y.Doc();
      ideas = { doc, provider: new SocketIOProvider(base, IDEAS_DOC, doc, {}) };
    }
    return ideas;
  };

  return {
    connected,
    wheel,
    history,
    presence,
    personal,
    identity,
    tierlist,
    tierlistSnapshots,
    get doc() {
      return ensureIdeas().doc;
    },
    get provider() {
      return ensureIdeas().provider;
    },

    identify: (name, color, password) =>
      socket.emit("identify", { name, color, password }),
    addOption: (author, text, color, media) =>
      socket.emit("option:add", { author, text, color, media: media ?? undefined }),
    removeOption: (id) => socket.emit("option:remove", { id }),
    setMaxPicks: (value) => socket.emit("wheel:set_max", { value }),
    spin: (turns) => socket.emit("wheel:spin", { turns }),
    clearSpin: () => socket.emit("wheel:clear_spin"),
    deny: () => socket.emit("wheel:deny"),
    editHistory: (id, title, drawn_at) =>
      socket.emit("history:edit", { id, title, drawn_at }),
    removeHistory: (id) => socket.emit("history:remove", { id }),
    setPersonal: (content) => socket.emit("personal:set", { content }),
    setTierlist: (placements) => socket.emit("tierlist:set", { placements }),
    removeTierlist: (name) => socket.emit("tierlist:remove", { name }),
    removeUser: (name, wipe) => socket.emit("user:remove", { name, wipe }),
    setSnapshotHidden: (id, hidden) => socket.emit("tierlist:snapshot_hide", { id, hidden }),

    onError: (cb) => {
      errorCbs.add(cb);
      return () => errorCbs.delete(cb);
    },
    destroy: () => {
      errorCbs.clear();
      if (ideas) {
        try {
          ideas.provider.destroy();
        } catch {
          /* ignore */
        }
        ideas.doc.destroy();
      }
      socket.disconnect();
    },
  };
}
