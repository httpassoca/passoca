import { description, url, title } from "$lib/meta";
import posts, {Post} from '$lib/posts';

export async function get() {
	return {
		headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml'
    },
		body: xml(posts),
	};
}

const xml = (posts: Post[]) => `
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${title}</title>
    <link>${url}</link>
    <description>${description}</description>
    ${posts
      .map(
        post => `
        <item>
          <title>${post.title}</title>
          <description>${post.description}</description>
          <link>${url}/${post.slug}/</link>
          <pubDate>${new Date(post.date).toISOString()}</pubDate>
          ${
            post.tags ?
            post.tags.map(
              tag => `<category term="${tag}" />`
            ).join('') : ''
          }
          <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${url}/images/posts/${post.slug}/cover.jpg"/>
          <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${url}/images/posts/${post.slug}/cover.jpg"/>
        </item>
      `).join('')}
  </channel>
</rss>`
