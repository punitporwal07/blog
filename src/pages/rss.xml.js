import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" or "/blog"

  return rss({
    title: "cloudnetes",
    description: "Cloud Native, Kubernetes & DevOps notes.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.pubDate,
      link: `${base}/blog/${post.slug}/`,
    })),
  });
}
