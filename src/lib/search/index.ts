// Search palette engine. This module is heavy — minisearch plus the raw
// markdown of every post — and must only ever be loaded via dynamic
// `import("$lib/search")` from the palette. The globs are eager so Vite
// bundles all posts into this one lazy chunk instead of one request each.
import MiniSearch from "minisearch";
import { getSlug } from "$lib/helpers/helpers";
import { getPosts, type Locale } from "$lib/posts";
import { projects } from "$lib/data/projects";
import { m } from "$lib/paraglide/messages";
import { buildSnippet, fold, stripMarkdown, type SnippetPart } from "./text";

const rawBodies: Record<Locale, Record<string, string>> = {
  en: import.meta.glob("../blog/en/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>,
  "pt-BR": import.meta.glob("../blog/pt-BR/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>,
};

export type SearchDocType = "page" | "post" | "project";

export type SearchDoc = {
  id: string;
  type: SearchDocType;
  title: string;
  description: string;
  body: string;
  tags: string[];
  /** Unlocalized path — pass through `localizeHref` at render/goto time. */
  href: string;
};

/**
 * What the palette renders: a matched doc plus a highlighted excerpt.
 * Snippets are precomputed here so the palette never imports the text
 * utilities into the always-loaded bundle.
 */
export type SearchResult = {
  id: string;
  type: SearchDocType;
  title: string;
  href: string;
  snippet: SnippetPart[];
};

export type SearchApi = {
  query: (q: string) => SearchResult[];
  /** Static page docs, used as quick-jumps for the empty query. */
  pages: SearchDoc[];
};

function buildPageDocs(locale: Locale): SearchDoc[] {
  const opts = { locale };
  const pages: { title: string; href: string }[] = [
    { title: m.nav_home({}, opts), href: "/" },
    { title: m.nav_career({}, opts), href: "/career" },
    { title: m.nav_projects({}, opts), href: "/projects" },
    { title: m.nav_blog({}, opts), href: "/blog" },
    { title: m.nav_contact({}, opts), href: "/contact" },
  ];
  return pages.map((p) => ({
    id: `page:${p.href}`,
    type: "page" as const,
    title: p.title,
    description: "",
    body: "",
    tags: [],
    href: p.href,
  }));
}

function buildPostDocs(locale: Locale): SearchDoc[] {
  // Metadata comes from getPosts() (already filters `hidden` and sorts);
  // raw markdown is joined by slug so filtered posts are never indexed.
  const bySlug: Record<string, string> = {};
  for (const [filepath, raw] of Object.entries(rawBodies[locale])) {
    bySlug[getSlug(filepath)] = raw;
  }
  return getPosts(locale).map((post) => ({
    id: `post:${post.slug}`,
    type: "post" as const,
    title: post.title,
    description: post.description ?? "",
    body: stripMarkdown(bySlug[post.slug] ?? ""),
    tags: post.tags ?? [],
    href: `/blog/${post.slug}`,
  }));
}

// Project content is English-only; indexed as-is in both locales.
const projectDocs: SearchDoc[] = projects.map((p) => ({
  id: `project:${p.name}`,
  type: "project" as const,
  title: p.name,
  description: p.description,
  body: p.features.join(". "),
  tags: [],
  href: "/projects",
}));

const POST_LIMIT = 8;
const GROUP_ORDER: Record<SearchDocType, number> = {
  page: 0,
  post: 1,
  project: 2,
};

const cache = new Map<Locale, SearchApi>();

export function getSearch(locale: Locale): SearchApi {
  const cached = cache.get(locale);
  if (cached) return cached;

  const docs = [
    ...buildPageDocs(locale),
    ...buildPostDocs(locale),
    ...projectDocs,
  ];

  const mini = new MiniSearch<SearchDoc>({
    fields: ["title", "tags", "description", "body"],
    storeFields: ["type", "title", "description", "body", "tags", "href"],
    extractField: (doc, field) =>
      field === "tags" ? doc.tags.join(" ") : (doc as any)[field],
    processTerm: (term) => fold(term),
    searchOptions: {
      boost: { title: 4, tags: 3, description: 2, body: 1 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: "AND",
    },
  });
  mini.addAll(docs);

  const api: SearchApi = {
    pages: docs.filter((d) => d.type === "page"),
    query(q: string): SearchResult[] {
      const trimmed = q.trim();
      if (!trimmed) return [];
      const hits = mini.search(trimmed).map(
        (hit): SearchResult => ({
          id: hit.id,
          type: hit.type,
          title: hit.title,
          href: hit.href,
          snippet:
            hit.type === "page"
              ? []
              : buildSnippet(hit.body, hit.terms, hit.description),
        })
      );
      // Stable-group by type (pages → posts → projects), score order within.
      const grouped = hits
        .slice()
        .sort((a, b) => GROUP_ORDER[a.type] - GROUP_ORDER[b.type]);
      let posts = 0;
      return grouped.filter((r) =>
        r.type === "post" ? ++posts <= POST_LIMIT : true
      );
    },
  };
  cache.set(locale, api);
  return api;
}
