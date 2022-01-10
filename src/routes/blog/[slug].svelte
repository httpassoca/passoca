<script context="module" lang="ts">
  // https://fantinel.dev/blog-development-sveltekit/ <3
  const imports = import.meta.globEager("../../lib/blog/*");

  type PostType = {
    post: Record<
      string,
      {
        [key: string]: any;
      }
    >;
    slug: string;
  };

  const posts: PostType[] = [];

  for (let path in imports) {
    const post = imports[path];
    const slug = post.metadata.slug;
    const p = { post, slug };
    posts.push(p);
  }

  export function load({ page }) {
    const { slug } = page.params;
    // Find the post with the slug
    const filteredPost = posts.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );

    return {
      props: {
        page: filteredPost.post.default,
        metadata: filteredPost.post.metadata,
      },
    };
  }
</script>

<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";

  type Metadata = {
    title: string;
    slug: string;
    date: string;
    description: string;
    tags: string[];
  };
  export let page: Pick<PostType, "post">;
  export let metadata: Metadata;
</script>

<svelte:head>
  <title>{metadata.title} | Passoca</title>
  <meta name="title" content={`${metadata.title} | Passoca"`} />
  <meta name="description" content={metadata.description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content={`https://passoca.dev/blog/${metadata.slug}`}
  />
  <meta property="og:title" content={`${metadata.title} | Passoca"`} />
  <meta property="og:description" content={metadata.description} />
  <meta
    property="og:image"
    content={`https://passoca.dev/blog/${metadata.slug}.webp`}
  />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta
    property="twitter:url"
    content={`https://passoca.dev/blog/${metadata.slug}`}
  />
  <meta property="twitter:title" content={`${metadata.title} | Passoca"`} />
  <meta
    property="twitter:description"
    content="Currently developing apps with Typescript"
  />
  <meta
    property="twitter:image"
    content={`https://passoca.dev/blog/${metadata.slug}.webp`}
  />
</svelte:head>

<h1>{metadata.title}</h1>
<div class="info">{formatDate(metadata.date)}</div>
<!-- Here we'll load the component of the blog post page itself -->
<svelte:component this={page} />
