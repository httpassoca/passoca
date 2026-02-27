import { getSlug } from "./helpers/helpers";

export type Post = {
  post: Record<string, Record<string, any>>;
  title: string;
  slug: string;
  date: string;
  description: string;
  hidden?: boolean;
  tags: string[];
};

// Used by notes pages (Supabase notes loader)
export type Note = {
  title: string;
  slug: string;
  text?: any;
  date?: string;
  promise?: any;
};

type GlobEntry = {
  metadata: any;
  default: any;
};

const importsEn = import.meta.glob<GlobEntry>("./blog/en/*.md", { eager: true });
const importsPt = import.meta.glob<GlobEntry>("./blog/pt-BR/*.md", { eager: true });

function buildPosts(imports: Record<string, GlobEntry>): Post[] {
  const entries = Object.entries(imports).map(([filepath, globEntry]) => ({
    metadata: globEntry.metadata,
    content: globEntry.default,
    slug: getSlug(filepath),
  }));

  const posts: Post[] = [];
  for (const e of entries) {
    posts.push({
      ...e.metadata,
      ...e.content,
    });
  }

  return posts
    .filter((post) => !post.hidden)
    .sort((a, b) =>
      new Date(a.date).getTime() > new Date(b.date).getTime()
        ? -1
        : new Date(a.date).getTime() < new Date(b.date).getTime()
        ? 1
        : 0
    );
}

const cached = {
  en: buildPosts(importsEn),
  "pt-BR": buildPosts(importsPt),
};

export type Locale = "en" | "pt-BR";

export function getPosts(locale: Locale): Post[] {
  return cached[locale] ?? cached.en;
}

// Backwards-compatible default export (used by older code paths like RSS).
export default getPosts("en");
