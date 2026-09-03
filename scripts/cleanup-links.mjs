// Removes leftover empty Markdown links from the converted posts.
//
// Blogger frequently wrapped images in <a> tags; when the inner image was a
// placeholder/empty, the converter produced empty links like `[](url)` (some
// wrapped in bold: `**[](url)**`). These render as nothing useful. This script
// strips them and tidies the resulting blank lines.
//
// Usage: node scripts/cleanup-links.mjs [--dry-run]

import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");
const DRY_RUN = process.argv.includes("--dry-run");

function clean(md) {
  let out = md;
  // IMPORTANT: only remove empty *links* `[](url)`, never images `![](url)`.
  // The negative lookbehind (?<!!) ensures we don't match the `[]()` that is
  // part of an image `![]()`.
  //
  // Bold-wrapped empty links: **[](url)** -> removed.
  out = out.replace(/\*\*(?<!!)\[\]\([^)]*\)\*\*/g, "");
  // Bare empty links (not images): [](url) -> removed.
  out = out.replace(/(?<!!)\[\s*\]\([^)]*\)/g, "");
  // Collapse 3+ blank lines left behind.
  out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
let changed = 0;
for (const file of files) {
  const path = join(BLOG_DIR, file);
  const before = await readFile(path, "utf8");
  const after = clean(before);
  if (after !== before) {
    changed += 1;
    if (DRY_RUN) {
      console.log(`would clean: ${file}`);
    } else {
      await writeFile(path, after, "utf8");
      console.log(`cleaned: ${file}`);
    }
  }
}
console.log(`\n${DRY_RUN ? "Would change" : "Changed"} ${changed} file(s).`);
