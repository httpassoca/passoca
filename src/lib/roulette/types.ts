export type MediaType = "movie" | "tv";

/** TMDB metadata carried by an option and copied into history on spin. */
export type MediaRef = {
  media_type: MediaType | null;
  tmdb_id: number | null;
  original_title: string | null;
  media_year: string | null;
  poster_path: string | null;
};

/** Enough to open a details view for an option or history entry. */
export type MediaKey = { media_type: MediaType; tmdb_id: number };

/** What the client sends with option:add — the server re-fetches the rest. */
export type MediaPick = {
  media_type: MediaType;
  tmdb_id: number;
  lang: string;
};

/** A TMDB search result row from the API proxy. */
export type MediaSummary = {
  tmdb_id: number;
  media_type: MediaType;
  title: string;
  original_title: string;
  year: string | null;
  poster_path: string | null;
};

/** Full on-demand details from the API proxy. */
export type MediaDetailsData = MediaSummary & {
  overview: string;
  vote_average: number | null;
  runtime: number | null;
  seasons: number | null;
  episodes: number | null;
  genres: string[];
};

export type Option = MediaRef & {
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

export type HistoryEntry = MediaRef & {
  id: string;
  title: string;
  author: string | null;
  drawn_at: string;
  created_at: string;
};

export type Presence = { name: string; color: string | null };

/** Server acknowledgement of an identify attempt. */
export type Identity = { ok: boolean; name: string; admin: boolean };

export type TierName = "S" | "A" | "B" | "C" | "D";

/** A rankable film, deduped from history (rewatches share a TMDB key). */
export type TierItem = {
  key: string;
  title: string;
  media_type: MediaType | null;
  tmdb_id: number | null;
  media_year: string | null;
  poster_path: string | null;
};

export type TierPlacement = { key: string; tier: TierName; position: number };

/** Server tierlist snapshot: items + aggregated general + everyone's lists. */
export type TierlistState = {
  items: TierItem[];
  general: Record<TierName, string[]>;
  submissions: Record<string, TierPlacement[]>;
};

/** One frame of the general-tierlist timeline: who changed it, into what. */
export type TierlistSnapshot = {
  id: string;
  author: string;
  general: Record<TierName, string[]>;
  created_at: string;
  hidden: boolean;
};

export const DEFAULT_TIERLIST: TierlistState = {
  items: [],
  general: { S: [], A: [], B: [], C: [], D: [] },
  submissions: {},
};

export const DEFAULT_WHEEL: WheelState = {
  options: [],
  max_picks: 1,
  winner_id: null,
  spin_turns: null,
  spun_at: null,
};
