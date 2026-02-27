import type { PageLoad } from "./$types";
import { getLocale } from "$lib/paraglide/runtime";
import { getPosts } from "$lib/posts";

export const load: PageLoad = async () => {
  const locale = getLocale() as any;
  return {
    posts: getPosts(locale),
  };
};
