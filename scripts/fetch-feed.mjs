// Fetches the full Blogger Atom feed for cloudnetes, paging through all posts.
// Uses only Node built-ins (Node 18+ global fetch). Saves each page and a
// combined list of raw <entry> XML blocks to data/.
//
// Usage: node scripts/fetch-feed.mjs [--max-results=25] [--blog=cloudnetes]

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "data");
const PAGES_DIR = join(DATA_DIR, "feed-pages");

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}

const BLOG = arg("blog", "cloudnetes");
const MAX = Number.parseInt(arg("max-results", "25"), 10);
const BASE = `https://${BLOG}.blogspot.com/feeds/posts/default`;

// A desktop UA reduces the chance of being served a stripped mobile page.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/atom+xml, application/xml, text/xml, */*",
};

function readTotalResults(xml) {
  const m = xml.match(/<openSearch:totalResults>(\d+)<\/openSearch:totalResults>/);
  return m ? Number.parseInt(m[1], 10) : null;
}

// Extract each <entry>...</entry> block as a raw string. We keep them raw so the
// converter can parse them independently and we never lose data in transit.
function extractEntries(xml) {
  const entries = [];
  const re = /<entry\b[\s\S]*?<\/entry>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    entries.push(match[0]);
  }
  return entries;
}

async function fetchPage(startIndex) {
  const url = `${BASE}?start-index=${startIndex}&max-results=${MAX}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return await res.text();
}

async function main() {
  await mkdir(PAGES_DIR, { recursive: true });

  const firstXml = await fetchPage(1);
  const total = readTotalResults(firstXml) ?? 0;
  console.log(`Total posts reported by feed: ${total}`);

  const allEntries = [];
  let pageNum = 1;
  let startIndex = 1;
  let xml = firstXml;

  while (true) {
    const pagePath = join(PAGES_DIR, `page-${String(pageNum).padStart(2, "0")}.xml`);
    await writeFile(pagePath, xml, "utf8");

    const entries = extractEntries(xml);
    allEntries.push(...entries);
    console.log(
      `Page ${pageNum} (start-index=${startIndex}): ${entries.length} entries, running total ${allEntries.length}`
    );

    startIndex += MAX;
    if (startIndex > total || entries.length === 0) break;

    pageNum += 1;
    xml = await fetchPage(startIndex);
  }

  // Write a manifest of the raw entries. We wrap them so the file is valid XML
  // and easy for the converter to iterate.
  const combined =
    `<?xml version="1.0" encoding="UTF-8"?>\n<entries total="${total}" fetched="${allEntries.length}">\n` +
    allEntries.join("\n") +
    `\n</entries>\n`;
  await writeFile(join(DATA_DIR, "entries.xml"), combined, "utf8");

  console.log(`\nDone. Fetched ${allEntries.length} of ${total} entries.`);
  console.log(`Raw pages: ${PAGES_DIR}`);
  console.log(`Combined:  ${join(DATA_DIR, "entries.xml")}`);
  if (allEntries.length < total) {
    console.warn(
      `WARNING: fetched fewer entries (${allEntries.length}) than reported total (${total}).`
    );
  }
}

main().catch((err) => {
  console.error("Feed fetch failed:", err);
  process.exit(1);
});
