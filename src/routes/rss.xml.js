import posts from '$lib/posts';
console.log(posts)
export async function get() {
  const body = xml(posts);
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml'
  };
  return {
    headers,
    body
  };
}

const xml = posts => `
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>Passoca</title>
    <link>passoca.com.br</link>
    ${posts
      .map(
        post => `
        <item>
          <title>${post.title}</title>
          <description>${post.description}</description>
          <link>passoca.com.br/blog/${post.slug}/</link>
          <pubDate>${new Date(post.date).toISOString()}</pubDate>
          ${
            post.tags ?
            post.tags.map(
              tag => `<category term="${tag}" />`
            ).join('') : ''
          }
          <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="passoca.com.br/images/posts/${post.slug}/cover.jpg"/>
          <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="passoca.com.br/images/posts/${post.slug}/cover.jpg"/>
        </item>
      `).join('')}
  </channel>
</rss>`
