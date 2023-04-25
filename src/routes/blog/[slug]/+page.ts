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

export function load({ params }) {
  const { slug } = params;
  // Find the post with the slug
  const filteredPost = posts.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );

  return {
  page: filteredPost.post.default,
  metadata: filteredPost.post.metadata,
};
}
