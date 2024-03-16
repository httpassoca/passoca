import { json } from '@sveltejs/kit';
import matter from 'gray-matter';

const patterns: Record<string, RegExp> = {
  frontmatter: /---.*?---/gs,
  code: /```.*?```/gs, // Ensure proper end of the code block
  inline: /`([^`]*)`/g,
  heading: /^#{1,6}\s.*$/gm,
  link: /\[([^\]]+)\]\(([^)]+)\)/g,
  image: /\!\[.*?\]\(.*?\)/g,
  blockquote: /> /gm,
  bold: /\*\*(.*?)\*\*/g, // Capture the content between bold markers
  italic: /\b_([^_]+)_(?!\w)/g,
  special: /{%.*?%}/g,
  tags: /<[^>]*>/g, // Match any HTML tags more effectively
};

const htmlEntities: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
};

function stripMarkdown(markdown: string): string {
  // Process each pattern
  for (const pattern in patterns) {
    markdown = markdown.replace(patterns[pattern], (match, group1, group2) => {
      switch (pattern) {
        case 'inline':
          return group1; // Replace with the content inside backticks
        case 'link':
          return group2; // Replace with the link URL
        case 'italic':
          return group1; // Replace with the content inside underscores
        case 'tags':
          return htmlEntities[match] || match; // Replace HTML tags with entities
        default:
          return ''; // Remove matched patterns
      }
    });
  }

  return markdown;
}

export async function GET() {
  const paths = import.meta.glob('../../lib/blog/*.md', { as: 'raw', eager: true });
  const posts = Object.entries(paths)
    .map(([_, content]) => {
      const frontmatter = matter(content);

      if (frontmatter.data.draft) {
        return null;
      }

      console.log(content);
      return {
        title: frontmatter.data.title,
        slug: frontmatter.data.slug,
        content: stripMarkdown(content),
      };
    })
    .filter(Boolean);

  return json(posts);
}

export const prerender = true
