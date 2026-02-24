import type { PageData } from "./$types";
import { fetchJson } from "$lib/helpers/http";

type NowPlayingResponse =
  | { isPlaying: true; music: any }
  | { isPlaying: false }
  | { isPlaying?: boolean; music?: any };

export const load = (async ({ fetch }) => {
  const api = import.meta.env.VITE_API_URL;
  if (!api) return { music: null };

  try {
    const res = await fetchJson<NowPlayingResponse>(
      fetch,
      `${api}/now-playing`,
      {
        timeoutMs: 4000,
      }
    );

    return { music: res && (res as any).isPlaying ? (res as any).music : null };
  } catch {
    // Non-critical UI feature: fail closed.
    return { music: null };
  }
}) satisfies PageData;
