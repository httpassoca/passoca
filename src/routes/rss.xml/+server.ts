import { capitalize } from "$lib/helpers/helpers";
import { description, url, title } from "$lib/meta";
import posts, { type Post, type Note } from "$lib/posts";
import { supabase } from "$lib/supabase";

export const prerender = true;

export async function GET() {
  // During builds or local dev without env vars, supabase may be disabled.
  // In that case we still return RSS for blog posts (without notes).
  let data: any[] = [];
  if (supabase) {
    const res = await supabase.storage.from("passoca").list("notes");
    if (!res.error) {
      data = res.data || [];
    }
  }

  let notes: Note[] = [];
  data.map((note) => {
    let title = note.name.slice(0, -3).replace(/-/g, " ");
    title = capitalize(title);
    notes = [
      ...notes,
      {
        title,
        date: note.updated_at,
        slug: note.name.slice(0, -3),
      },
    ];
  });
  return new Response(xml([...posts, ...notes]), {
    headers: {
      "Cache-Control": "max-age=0, s-maxage=3600",
      "Content-Type": "application/xml",
    },
  });
}

const xml = (posts: (Post | Note)[]) => `
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${title}</title>
    <link>${url}</link>
    <description>${description}</description>
    ${posts
      .map((post) =>
        "description" in post
          ? `
        <item>
          <title>${post.title}</title>
          <description>${post.description}</description>
          <link>${url}/${post.slug}/</link>
          <pubDate>${new Date(post.date).toISOString()}</pubDate>
          ${
            post.tags
              ? post.tags.map((tag) => `<category term="${tag}" />`).join("")
              : ""
          }
          <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${url}/blog/${
              post.slug
            }.webp"/>
          <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${url}/blog/${
              post.slug
            }.webp"/>
        </item>
      `
          : `
      <item>
          <title>${post.title}</title>
          <description>${post.slug}</description>
          <link>${url}/notes/#${post.slug}/</link>
          <pubDate>${new Date(post.date).toISOString()}</pubDate>
        </item>`
      )
      .join("")}
  </channel>
</rss>`;
