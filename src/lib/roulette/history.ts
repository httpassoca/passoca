import { normalizeBase } from "./client";
import type { HistoryAddInput } from "./types";

/**
 * Admin-only REST insert of a past roulette into the history. The server
 * re-fetches TMDB metadata for `media`, keeps an explicit `title` over the
 * canonical one, and stores `drawn_at: null` as the "date unknown" marker.
 * Every connected client gets the new list via the `history` broadcast.
 */
export async function addHistoryEntry(
  apiUrl: string,
  auth: { name: string; password: string },
  input: HistoryAddInput
): Promise<void> {
  const res = await fetch(`${normalizeBase(apiUrl)}/roulette/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: auth.name,
      password: auth.password,
      title: input.title,
      author: input.author ?? undefined,
      drawn_at: input.drawn_at,
      media: input.media ?? undefined,
    }),
  });
  if (!res.ok) {
    const text = (await res.text().catch(() => "")).trim();
    throw new Error(text || `history add failed (${res.status})`);
  }
}
