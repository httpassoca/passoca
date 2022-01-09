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

<h1>{metadata.title}</h1>
<div class="info">{formatDate(metadata.date)}</div>
<!-- Here we'll load the component of the blog post page itself -->
<svelte:component this={page} />
