import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      // Ensure TypeScript can type-check `import { m } from "$lib/paraglide/messages"`
      emitTsDeclarations: true,
      // Only localize when the URL is localized (no surprise redirects via cookie)
      strategy: ["url", "baseLocale"],
    }),
  ],
};

export default config;
