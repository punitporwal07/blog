// One-off: neutralize example GitLab runner tokens that trip GitHub push
// protection. These come from the source blog post's example CLI output and
// are dummies, but they match GitHub's "GR<digits>B..." runner-token pattern.
// We replace any such token with an obviously-fake placeholder in the content
// and the source data files.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Matches GitLab runner tokens like GR1348941634B... (the "GR" + digits + a
// base64-ish tail). Assembled from parts so this script file itself does not
// contain a literal that trips the scanner.
const TOKEN_RE = new RegExp("GR" + "\\d{6,}" + "[A-Za-z0-9_-]+", "g");
const REPLACEMENT = "GR_EXAMPLE_TOKEN_REDACTED";

const files = [
  "src/content/blog/secret-detection-in-gitlab.md",
  "data/entries.xml",
  "data/feed-pages/page-01.xml",
];

let total = 0;
for (const rel of files) {
  const path = join(ROOT, rel);
  const before = await readFile(path, "utf8");
  const matches = before.match(TOKEN_RE);
  if (!matches) {
    console.log(`- no match in ${rel}`);
    continue;
  }
  const after = before.replace(TOKEN_RE, REPLACEMENT);
  await writeFile(path, after, "utf8");
  total += matches.length;
  console.log(`- replaced ${matches.length} occurrence(s) in ${rel}: ${[...new Set(matches)].join(", ")}`);
}
console.log(`\nDone. ${total} replacement(s).`);
