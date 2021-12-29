<script context="module" lang="ts">
  // https://fantinel.dev/blog-development-sveltekit/ <3
  const imports = import.meta.globEager("../../lib/blog/*.md");

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
    console.log(filteredPost);
    return {
      props: {
        page: filteredPost.post.default,
      },
    };
  }
</script>

<script>
  // Declare the page variable to use on the client
  export let page;
</script>

<!-- Here we'll load the component of the blog post page itself -->
<svelte:component this={page} />
