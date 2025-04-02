import { getSlug } from '$lib/helpers/helpers';
import { error } from '@sveltejs/kit';
import type { PageData } from './$types';
export const prerender = 'auto';

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

  const posts = Object.entries(
    import.meta.glob<GlobEntry>('/src/lib/blog/*.md', { eager: true })
  )
    .map(([filepath, globEntry]) => {
      return {
        metadata: globEntry.metadata,
        content: globEntry.default,
        slug: getSlug(filepath),
      };
    })

  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    error(404, 'Post not found');
  }

  return {
    page: post.content,
    metadata: post.metadata,
  };

}) satisfies PageData;