export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Prefix an internal path with the site base path (e.g. "/blog") so links work
// whether the site is served from root or a subpath. Pass root-relative paths
// like "/", "/tags", "/blog/my-post".
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" or "/blog"
  if (path === "/") return base ? base + "/" : "/";
  return base + (path.startsWith("/") ? path : "/" + path);
}
