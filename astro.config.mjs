import { defineConfig } from "astro/config";

// Deployed to GitHub Pages as a project site: https://punitporwal07.github.io/blog
// so the site lives under the "/blog" base path. Internal links in .astro
// templates go through url()/BASE_URL. Markdown image paths are stored in the
// content already prefixed with the base (/blog/blog-images/...); see
// scripts/download-images.mjs PUBLIC_PREFIX.
export default defineConfig({
  site: "https://punitporwal07.github.io",
  base: "/blog",
  trailingSlash: "ignore",
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
