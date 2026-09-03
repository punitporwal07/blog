// Downloads remote Blogger-hosted images referenced in the Markdown posts into
// public/blog-images/, then rewrites the Markdown to point at the local copies.
//
// - Idempotent: existing files are not re-downloaded; the URL->filename map is
//   cached in data/image-map.json so reruns are cheap and stable.
// - Network calls need the corporate system CA. Run with:
//     node --use-system-ca scripts/download-images.mjs
// - Options:
//     --dry-run   list what would be downloaded/rewritten, change nothing
//     --limit=N   only process the first N distinct images (testing)

import {
  mkdir,
  readFile,
  writeFile,
  readdir,
  stat,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "src", "content", "blog");
const IMG_DIR = join(ROOT, "public", "blog-images");
const MAP_FILE = join(ROOT, "data", "image-map.json");
// Includes the Astro base path ("/blog") because this site is deployed to
// GitHub Pages under that subpath. If you move to a root-served host, change
// this to "/blog-images" and rebuild.
const PUBLIC_PREFIX = "/blog/blog-images";

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = (() => {
  const a = process.argv.find((x) => x.startsWith("--limit="));
  return a ? Number.parseInt(a.split("=")[1], 10) : Infinity;
})();

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
};

// Hosts whose images we localize.
const IMAGE_HOST = /(googleusercontent\.com|\.bp\.blogspot\.com)/;

const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/avif": "avif",
};

function extFromUrl(url) {
  // Blogger URLs sometimes end in /s320/name.jpg or .../foo.PNG=w640-h204.
  const clean = url.split("=")[0];
  const m = clean.match(/\.([a-zA-Z]{3,4})$/);
  if (m) {
    const e = m[1].toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"].includes(e)) {
      return e === "jpeg" ? "jpg" : e;
    }
  }
  return null;
}

function filenameFor(url, ext) {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  // Try to keep a human-friendly hint from the URL tail.
  const clean = url.split("=")[0];
  const tail = clean.split("/").pop() || "";
  const base = tail
    .replace(/\.[a-zA-Z]{3,4}$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const hint = base && base.length > 2 ? `${base}-` : "";
  return `${hint}${hash}.${ext}`;
}

// Extract all Blogger image URLs used in Markdown image syntax across all posts.
async function collectUrls() {
  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
  const urls = new Set();
  const imgRe = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
  for (const file of files) {
    const md = await readFile(join(BLOG_DIR, file), "utf8");
    let m;
    while ((m = imgRe.exec(md)) !== null) {
      if (IMAGE_HOST.test(m[1])) urls.add(m[1]);
    }
  }
  return [...urls];
}

async function loadMap() {
  if (existsSync(MAP_FILE)) {
    try {
      return JSON.parse(await readFile(MAP_FILE, "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

async function download(url) {
  const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const mime = (res.headers.get("content-type") || "").split(";")[0].trim();
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, mime };
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  const map = await loadMap();

  const urls = await collectUrls();
  console.log(`Found ${urls.length} distinct Blogger image URLs.`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  let processed = 0;
  for (const url of urls) {
    if (processed >= LIMIT) break;
    processed += 1;

    // Already mapped and file present -> skip.
    if (map[url] && existsSync(join(IMG_DIR, map[url]))) {
      skipped += 1;
      continue;
    }

    if (DRY_RUN) {
      console.log(`would download: ${url}`);
      continue;
    }

    try {
      const { buf, mime } = await download(url);
      const ext = EXT_BY_MIME[mime] || extFromUrl(url) || "png";
      const filename = filenameFor(url, ext);
      await writeFile(join(IMG_DIR, filename), buf);
      map[url] = filename;
      downloaded += 1;
      if (downloaded % 20 === 0) {
        console.log(`  downloaded ${downloaded}...`);
        await writeFile(MAP_FILE, JSON.stringify(map, null, 2), "utf8");
      }
    } catch (err) {
      failed += 1;
      failures.push({ url, error: err.message });
      console.warn(`  ! failed: ${url} (${err.message})`);
    }
  }

  if (!DRY_RUN) {
    await writeFile(MAP_FILE, JSON.stringify(map, null, 2), "utf8");
  }

  console.log(
    `\nDownload summary: ${downloaded} downloaded, ${skipped} already present, ${failed} failed.`
  );

  // Rewrite Markdown to local paths for everything we have a mapping for.
  if (!DRY_RUN) {
    const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
    let rewritten = 0;
    for (const file of files) {
      const path = join(BLOG_DIR, file);
      let md = await readFile(path, "utf8");
      let changed = false;
      for (const [url, filename] of Object.entries(map)) {
        if (md.includes(url)) {
          md = md.split(url).join(`${PUBLIC_PREFIX}/${filename}`);
          changed = true;
        }
      }
      if (changed) {
        await writeFile(path, md, "utf8");
        rewritten += 1;
      }
    }
    console.log(`Rewrote image links in ${rewritten} post(s).`);
  }

  if (failures.length) {
    console.log(`\nFailures (${failures.length}) left pointing at remote URLs:`);
    for (const f of failures.slice(0, 20)) console.log(`  - ${f.url}`);
    if (failures.length > 20) console.log(`  ... and ${failures.length - 20} more`);
  }

  // Report total size on disk.
  if (!DRY_RUN && existsSync(IMG_DIR)) {
    const imgs = await readdir(IMG_DIR);
    let bytes = 0;
    for (const f of imgs) bytes += (await stat(join(IMG_DIR, f))).size;
    console.log(
      `\nLocal images: ${imgs.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB in ${IMG_DIR}`
    );
  }
}

main().catch((err) => {
  console.error("Image download failed:", err);
  process.exit(1);
});
