import type { Reroute } from "@sveltejs/kit";
import { deLocalizeUrl } from "$lib/paraglide/runtime";

// Make SvelteKit route matching work with locale-prefixed URLs.
export const reroute: Reroute = (request) => {
  return deLocalizeUrl(request.url).pathname;
};
