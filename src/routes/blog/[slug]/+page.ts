import { getSlug } from "$lib/helpers/helpers";
import { getLocale } from "$lib/paraglide/runtime";
import { error } from "@sveltejs/kit";
import type { PageData } from "./$types";
export const prerender = "auto";

type GlobEntry = {
  metadata: PostType;
  default: unknown;
};

type PostType = {
  post: Record<
    string,
    {
      [key: string]: any;
    }
  >;
  slug: string;
};

export const load = (({ params }) => {
  const { slug } = params;

  const locale = getLocale();

  const importsEn = import.meta.glob<GlobEntry>("/src/lib/blog/en/*.md", { eager: true });
  const importsPt = import.meta.glob<GlobEntry>("/src/lib/blog/pt-BR/*.md", { eager: true });
  const imports = locale === "pt-BR" ? importsPt : importsEn;

  const posts = Object.entries(imports).map(([filepath, globEntry]) => {
    return {
      metadata: globEntry.metadata,
      content: globEntry.default,
      slug: getSlug(filepath),
    };
  });

  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    error(404, "Post not found");
  }

  return {
    page: post.content,
    metadata: post.metadata,
  };
}) satisfies PageData;
