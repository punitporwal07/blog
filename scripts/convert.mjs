// Converts the fetched Blogger entries (data/entries.xml) into clean Markdown
// files with front matter, ready for a static site generator (Astro).
//
// Pipeline per post:
//   1. Parse the raw <entry> XML block.
//   2. Extract metadata: title, published/updated dates, tags, original URL.
//   3. HTML-decode the <content> body (Blogger double-escapes it).
//   4. Clean the HTML: flatten nested code blocks, strip inline styles/noise,
//      normalize images and embeds.
//   5. Convert cleaned HTML -> Markdown with Turndown (+ GFM tables).
//   6. Write src/content/blog/<slug>.md with YAML front matter.
//
// Usage:
//   node --use-system-ca scripts/convert.mjs            (convert all)
//   node --use-system-ca scripts/convert.mjs --limit=3  (first N, for testing)
//   node --use-system-ca scripts/convert.mjs --slug=understanding-istio-as-service-mesh

import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_FILE = join(ROOT, "data", "entries.xml");
const OUT_DIR = join(ROOT, "src", "content", "blog");

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}
const LIMIT = arg("limit") ? Number.parseInt(arg("limit"), 10) : Infinity;
const ONLY_SLUG = arg("slug", null);

// --- XML/HTML entity decoding -------------------------------------------------

const NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

// Decode one layer of entities. Blogger content is escaped twice: once as XML
// (the feed) and once as the stored HTML. We decode the feed layer first (to get
// the HTML string), then the cleaner works on real HTML. We keep &amp; handling
// careful so we do not corrupt real ampersands in code.
function decodeEntities(str) {
  return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, code) => {
    if (code[0] === "#") {
      const hex = code[1] === "x" || code[1] === "X";
      const num = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      if (Number.isNaN(num)) return m;
      try {
        return String.fromCodePoint(num);
      } catch {
        return m;
      }
    }
    return NAMED[code] ?? m;
  });
}

// --- Entry parsing ------------------------------------------------------------

function firstTag(xml, tag) {
  // Matches <tag ...>...</tag> capturing inner content (non-greedy).
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1] : null;
}

function allAttrs(xml, tag, attr) {
  const re = new RegExp(`<${tag}\\b[^>]*\\b${attr}=(?:"([^"]*)"|'([^']*)')[^>]*/?>`, "gi");
  const out = [];
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1] ?? m[2]);
  return out;
}

function parseEntry(entryXml) {
  const title = decodeEntities(firstTag(entryXml, "title") ?? "").trim();
  const published = (firstTag(entryXml, "published") ?? "").trim();
  const updated = (firstTag(entryXml, "updated") ?? "").trim();

  // Tags: <category scheme="...atom/ns#" term="tag"/>. The blog-level feed also
  // has category tags without a scheme; entry-level ones carry the ns# scheme.
  const tags = allAttrs(entryXml, "category", "term")
    .map((t) => decodeEntities(t).trim())
    .filter(Boolean);

  // Original public URL: <link rel='alternate' type='text/html' href='...'/>
  let originalUrl = null;
  const linkRe = /<link\b[^>]*rel=['"]alternate['"][^>]*href=['"]([^'"]+)['"][^>]*>/i;
  const linkMatch = entryXml.match(linkRe);
  if (linkMatch) originalUrl = decodeEntities(linkMatch[1]);

  // Raw (still-escaped) HTML body.
  const rawContent = firstTag(entryXml, "content") ?? "";
  const html = decodeEntities(rawContent);

  return { title, published, updated, tags, originalUrl, html };
}

// slug is derived from the original Blogger URL filename, e.g.
// https://cloudnetes.blogspot.com/2021/05/understanding-istio-as-service-mesh.html
function slugFromUrl(url, title) {
  if (url) {
    const m = url.match(/\/([^/]+)\.html$/);
    if (m) return m[1];
  }
  return (title || "post")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export { parseEntry, decodeEntities, slugFromUrl };
// Exported for debugging/tests.
export function cleanHtmlExport(html) {
  return cleanHtml(html);
}

// --- HTML cleaning (jsdom-based) ---------------------------------------------
//
// jsdom gives us a spec-compliant DOM, which fixes two problems with lighter
// parsers: (1) <pre> content parses into real child nodes (so we can extract
// clean text), and (2) turndown / turndown-plugin-gfm work because they expect
// a real DOM (nodes have parentNode, ownerDocument, etc).

const MONO_HINT = /inconsolata|menlo|monaco|consolas|courier|source code pro|monospace/i;

// Extract plain text from a node, turning <br> and block boundaries into
// newlines. Used to flatten Blogger's nested <pre>/<span> code into plain text.
function textWithBreaks(node) {
  let out = "";
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      out += child.textContent;
    } else if (child.nodeType === 1) {
      const tag = child.tagName.toLowerCase();
      if (tag === "br") out += "\n";
      else if (tag === "div" || tag === "p") out += textWithBreaks(child) + "\n";
      else out += textWithBreaks(child);
    }
  }
  return out;
}

function cleanCodeText(raw) {
  let t = raw.replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.replace(/^\n+/, "").replace(/\n+$/, "");
}

function hasMono(el) {
  const style = (el.getAttribute("style") || "").toLowerCase();
  const face = (el.getAttribute("face") || "").toLowerCase();
  return MONO_HINT.test(style) || MONO_HINT.test(face);
}

// Replace Blogger code <pre> blocks with clean <pre><code>, and inline
// monospace spans with <code>, so Turndown emits proper fenced/inline code.
function normalizeCode(doc, root) {
  for (const pre of root.querySelectorAll("pre")) {
    const text = cleanCodeText(textWithBreaks(pre));
    if (text.trim() === "") {
      pre.remove();
      continue;
    }
    const newPre = doc.createElement("pre");
    const code = doc.createElement("code");
    code.textContent = text;
    newPre.appendChild(code);
    pre.replaceWith(newPre);
  }

  // Inline monospace spans NOT inside a <pre>/<code>. Single-line only; multi-
  // line monospace is left as prose (rare, and usually not real code).
  for (const span of root.querySelectorAll("span,font")) {
    if (span.closest("pre") || span.closest("code")) continue;
    if (!hasMono(span)) continue;
    const text = span.textContent;
    if (!text.trim() || text.includes("\n")) continue;
    const code = doc.createElement("code");
    code.textContent = text;
    span.replaceWith(code);
  }
}

// Strip width/height/style noise from images, keep src+alt, and unwrap links
// that just wrap the same Blogger-hosted image.
function normalizeImages(root) {
  for (const img of root.querySelectorAll("img")) {
    const src = img.getAttribute("src") || img.getAttribute("data-original") || "";
    const alt = img.getAttribute("alt") || "";
    for (const attr of [...img.attributes]) img.removeAttribute(attr.name);
    img.setAttribute("src", src);
    if (alt) img.setAttribute("alt", alt);

    const parentA = img.closest("a");
    if (parentA) {
      const href = parentA.getAttribute("href") || "";
      if (/googleusercontent\.com|blogger\.com/.test(href)) {
        parentA.replaceWith(img);
      }
    }
  }
}

// Turn iframes (YouTube/Blogger video) into a plain link, since raw iframes do
// not belong in Markdown content.
function normalizeEmbeds(doc, root) {
  for (const iframe of root.querySelectorAll("iframe")) {
    const src = iframe.getAttribute("src") || "";
    let url = src.startsWith("//") ? "https:" + src : src;
    const yt = src.match(/youtube\.com\/embed\/([\w-]+)/);
    if (yt) url = `https://www.youtube.com/watch?v=${yt[1]}`;
    const p = doc.createElement("p");
    if (url) {
      const a = doc.createElement("a");
      a.setAttribute("href", url);
      a.textContent = url;
      p.append("Video: ", a);
    }
    iframe.replaceWith(p);
  }
}

// turndown-plugin-gfm crashes on tables whose rows are not wrapped in a
// section (thead/tbody) because it walks row.parentNode.parentNode. It also
// mishandles cells that contain block elements. We rebuild each table into a
// minimal, well-formed structure: a single tbody of tr>td with plain-text
// cells. The first row is treated as the header (matching the source blogs,
// which use a bold/styled first row).
function normalizeTables(doc, root) {
  for (const table of root.querySelectorAll("table")) {
    // Blogger often uses <table class="tr-caption-container"> purely to center
    // an image/caption. Those have no real tabular data: unwrap them.
    const rows = [...table.querySelectorAll("tr")];
    const looksLikeData =
      rows.length > 1 && rows.some((r) => r.querySelectorAll("td,th").length > 1);
    if (!looksLikeData) {
      // Replace the whole table with its inner content (images, captions).
      const wrapper = doc.createElement("div");
      wrapper.append(...table.childNodes);
      // Pull cells' children up so images/text survive.
      for (const cell of wrapper.querySelectorAll("td,th,tr,tbody,thead")) {
        cell.replaceWith(...cell.childNodes);
      }
      table.replaceWith(wrapper);
      continue;
    }

    const newTable = doc.createElement("table");
    const thead = doc.createElement("thead");
    const tbody = doc.createElement("tbody");
    rows.forEach((row, idx) => {
      const cells = [...row.querySelectorAll("td,th")];
      if (cells.length === 0) return;
      const tr = doc.createElement("tr");
      for (const cell of cells) {
        const out = doc.createElement(idx === 0 ? "th" : "td");
        // Flatten cell content to single-line text (tables can't hold blocks
        // in Markdown). Preserve <br> as spaces.
        out.textContent = cell.textContent.replace(/\s+/g, " ").trim();
        tr.appendChild(out);
      }
      if (idx === 0) thead.appendChild(tr);
      else tbody.appendChild(tr);
    });
    newTable.appendChild(thead);
    newTable.appendChild(tbody);
    table.replaceWith(newTable);
  }
}

// Remove editor cruft: Google Docs/Gmail widgets, styling/tracking attributes.
function stripNoise(root) {
  // Remove whole subtrees that are pure UI chrome.
  for (const el of root.querySelectorAll("svg,button,style,script,meta,link")) {
    el.remove();
  }
  // Unwrap wt-ignore wrappers (Grammarly/WebTune leftovers), keeping their text.
  for (const el of root.querySelectorAll("wt-ignore")) {
    el.replaceWith(...el.childNodes);
  }
  // Strip presentational/tracking attributes from everything that remains.
  for (const el of root.querySelectorAll("*")) {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const keep =
        (el.tagName === "A" && name === "href") ||
        (el.tagName === "IMG" && (name === "src" || name === "alt")) ||
        ((el.tagName === "OL" || el.tagName === "UL") && name === "start");
      if (!keep) el.removeAttribute(attr.name);
    }
  }
}

function cleanHtml(html) {
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`);
  const doc = dom.window.document;
  const root = doc.body;
  normalizeCode(doc, root);
  normalizeImages(root);
  normalizeEmbeds(doc, root);
  normalizeTables(doc, root);
  stripNoise(root);
  return root.innerHTML;
}

// --- Markdown conversion ------------------------------------------------------

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    fence: "```",
    bulletListMarker: "-",
    emDelimiter: "_",
    strongDelimiter: "**",
    hr: "---",
    linkStyle: "inlined",
  });
  td.use(gfm);
  // Turndown's built-in fenced-code rule handles our normalized <pre><code>
  // correctly (verified), so no custom pre rule is needed.
  return td;
}

function toMarkdown(td, html) {
  let md = td.turndown(html);

  // Tidy pass.
  md = md
    // Trim trailing whitespace on each line.
    .replace(/[ \t]+$/gm, "")
    // Remove empty ATX headings left over from Google Docs heading wrappers.
    .replace(/^#{1,6}\s*$/gm, "")
    // Collapse nested/duplicated bold markers (****x**** -> **x**).
    .replace(/\*{3,}/g, "**");

  // Merge adjacent fenced code blocks separated only by blank lines. Blogger
  // frequently splits one logical snippet across several <pre> tags.
  md = md.replace(/```\n\n+```\n/g, "");

  md = md
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return md + "\n";
}

// --- Front matter -------------------------------------------------------------

function yamlString(s) {
  // Quote and escape for safe single-line YAML.
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function firstParagraphText(md) {
  const lines = md.split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("#") || t.startsWith("!") || t.startsWith("```") || t.startsWith(">"))
      continue;
    // Strip markdown emphasis/link syntax for a plain description.
    return t
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`>#]/g, "")
      .trim();
  }
  return "";
}

function buildFrontMatter({ title, published, updated, tags, originalUrl, description }) {
  const lines = ["---"];
  lines.push(`title: ${yamlString(title)}`);
  if (description) lines.push(`description: ${yamlString(description.slice(0, 200))}`);
  if (published) lines.push(`pubDate: ${published}`);
  if (updated && updated !== published) lines.push(`updatedDate: ${updated}`);
  if (tags.length) {
    lines.push("tags:");
    for (const t of tags) lines.push(`  - ${yamlString(t)}`);
  }
  if (originalUrl) lines.push(`originalUrl: ${yamlString(originalUrl)}`);
  lines.push("---");
  return lines.join("\n") + "\n\n";
}

// --- Main ---------------------------------------------------------------------

function splitEntries(xml) {
  const re = /<entry\b[\s\S]*?<\/entry>/g;
  return xml.match(re) || [];
}

async function main() {
  const xml = await readFile(DATA_FILE, "utf8");
  const entries = splitEntries(xml);
  console.log(`Found ${entries.length} entries in ${DATA_FILE}`);

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const td = makeTurndown();
  const seen = new Map();
  const report = [];
  const failures = [];
  let count = 0;

  for (const entryXml of entries) {
    if (count >= LIMIT) break;
    const meta = parseEntry(entryXml);
    let slug = slugFromUrl(meta.originalUrl, meta.title);

    if (ONLY_SLUG && slug !== ONLY_SLUG) continue;

    // De-dupe slugs.
    if (seen.has(slug)) {
      const n = seen.get(slug) + 1;
      seen.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      seen.set(slug, 1);
    }

    try {
      const cleaned = cleanHtml(meta.html);
      const body = toMarkdown(td, cleaned);
      const description = firstParagraphText(body);
      const fm = buildFrontMatter({ ...meta, description });
      const file = join(OUT_DIR, `${slug}.md`);
      await writeFile(file, fm + body, "utf8");
      report.push({ slug, title: meta.title, tags: meta.tags.length, bytes: body.length });
    } catch (err) {
      failures.push({ slug, title: meta.title, error: err.message });
      console.warn(`  ! FAILED ${slug}: ${err.message}`);
    }
    count += 1;
  }

  console.log(`\nWrote ${report.length} Markdown files to ${OUT_DIR}`);
  if (failures.length) {
    console.log(`\n${failures.length} post(s) failed to convert:`);
    for (const f of failures) console.log(`  - ${f.slug}: ${f.error}`);
  }
  console.log("");
  for (const r of report.slice(0, 20)) {
    console.log(`  ${r.slug}  (${r.tags} tags, ${r.bytes}b)`);
  }
  if (report.length > 20) console.log(`  ... and ${report.length - 20} more`);
}

// Only run when invoked directly (not when imported by debug/other scripts).
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("convert.mjs")) {
  main().catch((err) => {
    console.error("Conversion failed:", err);
    process.exit(1);
  });
}
