import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		}),
    mdsvex({
			extensions: ['.svelte', '.md', '.svx'],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolink, { // Adds hyperlinks to the headings, requires rehypeSlug
            behavior: 'prepend',
            content: {
              type: 'element',
              tagName: 'span',
              properties: {className:['heading-link']},
              children: [{type: 'text', value: '#'}]
            }
          }
        ],
      ],
      smartypants: true,
		})
	],
  extensions: ['.svelte', '.md', '.svx'],
  kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
	}
};

export default config;
