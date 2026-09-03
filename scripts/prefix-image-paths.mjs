// One-time: prefix existing Markdown image paths with the /blog base so they
// resolve on GitHub Pages (served under /blog). Idempotent — running twice does
// not double-prefix.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
let changed = 0;
for (const file of files) {
  const path = join(BLOG_DIR, file);
  const before = await readFile(path, "utf8");
  // Match ](/blog-images/...) but NOT already-prefixed ](/blog/blog-images/...)
  const after = before.replace(/\]\(\/blog-images\//g, "](/blog/blog-images/");
  if (after !== before) {
    await writeFile(path, after, "utf8");
    changed += 1;
  }
}
console.log(`Prefixed image paths in ${changed} file(s).`);
