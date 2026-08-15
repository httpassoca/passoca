import { getLocale } from "$lib/paraglide/runtime";
import { normalizeBase } from "./client";
import type { MediaDetailsData, MediaSummary, MediaType } from "./types";

// TMDB image CDN — sizes used across the roulette UI.
const IMG_BASE = "https://image.tmdb.org/t/p/";
export type PosterSize = "w92" | "w342";

export function tmdbImg(path: string, size: PosterSize): string {
  return `${IMG_BASE}${size}${path}`;
}

/** TMDB language for the current site locale. */
export function mediaLang(): string {
  return getLocale() === "pt-BR" ? "pt-BR" : "en-US";
}

/** Whether the API has a TMDB token configured; false on any failure. */
export async function fetchMediaStatus(apiUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${normalizeBase(apiUrl)}/roulette/media/status`);
    if (!res.ok) return false;
    return Boolean((await res.json())?.enabled);
  } catch {
    return false;
  }
}

export async function searchMedia(
  apiUrl: string,
  q: string,
  signal?: AbortSignal
): Promise<MediaSummary[]> {
  const params = new URLSearchParams({ q, lang: mediaLang() });
  const res = await fetch(`${normalizeBase(apiUrl)}/roulette/media/search?${params}`, { signal });
  if (!res.ok) throw new Error("media search failed");
  return (await res.json())?.results ?? [];
}

export async function fetchMediaDetails(
  apiUrl: string,
  type: MediaType,
  id: number
): Promise<MediaDetailsData> {
  const res = await fetch(
    `${normalizeBase(apiUrl)}/roulette/media/${type}/${id}?lang=${mediaLang()}`
  );
  if (!res.ok) throw new Error("media details failed");
  return res.json();
}
