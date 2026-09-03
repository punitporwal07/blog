import { getCollection } from "astro:content";

// Static JSON search index built at compile time. Each entry carries enough
// text (title, description, tags, and a trimmed plain-text body) for a simple
// client-side substring/token search on the /search page.
export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const index = posts
    .map((post) => {
      // Strip markdown/HTML noise to a rough plain-text blob, then cap length
      // so the index stays small.
      const body = (post.body || "")
        .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
        .replace(/`[^`]*`/g, " ") // inline code
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
        .replace(/[#>*_~|-]+/g, " ") // md symbols
        .replace(/<[^>]+>/g, " ") // stray html tags
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1200);

      return {
        slug: post.slug,
        title: post.data.title,
        description: post.data.description || "",
        tags: post.data.tags || [],
        pubDate: post.data.pubDate.toISOString(),
        body,
      };
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}
