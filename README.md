# cloudnetes blog migration

Migrating the [cloudnetes](https://cloudnetes.blogspot.com/) Blogger blog (122
posts, 2011–2025) to a modern static site.

## Status

- [x] **Fetch** all 122 posts from the Blogger Atom feed → `data/entries.xml`
- [x] **Convert** every post to clean Markdown with front matter →
      `src/content/blog/*.md` (122/122)
- [ ] Download images locally (currently they point at
      `blogger.googleusercontent.com`)
- [ ] Scaffold the Astro site and wire up the content collection
- [ ] URL redirects for the old `/YYYY/MM/slug.html` links
- [ ] Deploy

This is "Option B": bootstrapped from the public feed while the full Blogger XML
export is pending. When the official export arrives, re-run the converter
against it for the most faithful result (the feed and export share the same
entry structure).

## Environment note (important)

This machine sits behind a corporate TLS-intercepting proxy. Node and npm must
trust the system certificate store, or network calls fail with
`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`.

- `.npmrc` sets `node-options=--use-system-ca` so `npm install` works.
- Run scripts with the flag too: `node --use-system-ca scripts/fetch-feed.mjs`
  (only the fetch step needs the network; conversion is offline).
- On this shell, invoke npm as `npm.cmd` (the `npm` PowerShell shim is blocked
  by execution policy).

## Scripts

```
npm run fetch:feed   # pull all posts from the Blogger feed into data/
npm run convert      # data/entries.xml -> src/content/blog/*.md
```

Converter options:

```
node scripts/convert.mjs --limit=3     # first N posts (testing)
node scripts/convert.mjs --slug=<slug> # a single post by slug
```

## How conversion works

`scripts/convert.mjs`:

1. Splits `data/entries.xml` into `<entry>` blocks.
2. Extracts metadata (title, dates, tags, original URL) and HTML-decodes the
   double-escaped `<content>` body.
3. Cleans the HTML with jsdom:
   - flattens Blogger's deeply nested `<pre>`/`<span>` code into clean
     `<pre><code>`; single-line monospace spans become inline `<code>`,
   - strips inline styles / tracking attributes / Google Docs & Gmail widgets,
   - normalizes images (keeps `src`+`alt`, unwraps image-only links),
   - rebuilds tables into well-formed `thead`/`tbody` (also dodges a
     turndown-plugin-gfm crash on malformed tables),
   - turns iframes (YouTube) into plain links.
4. Converts to Markdown with Turndown + GFM, then a tidy pass merges adjacent
   code fences and removes empty headings.
5. Writes `src/content/blog/<slug>.md` with YAML front matter.

## Deployment

The site builds to static files in `dist/` (`npm run build`). It is served from
the **root** of a domain — internal links are root-relative, so do not host it
at a subpath (e.g. `username.github.io/blog`) without adding an Astro `base`
and updating links + the login gate.

Before deploying, set your real domain in `astro.config.mjs` (`site: ...`).

### Option A — Cloudflare Pages (recommended)

1. Push this repo to GitHub (`punitporwal07/blog`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
   pick the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 22 (set env var `NODE_VERSION=22` if needed)
4. Deploy. Add a custom domain under the project's **Custom domains** tab.

Do NOT set `--use-system-ca` in the cloud build — that's a local-only workaround
for the corporate proxy and is intentionally kept out of `.npmrc`.

### Option B — GitHub Pages (needs a custom domain)

A workflow is included at `.github/workflows/deploy.yml`. It builds on every
push to `main` and publishes `dist/`.

1. Repo → Settings → Pages → Source = **GitHub Actions**.
2. Add a custom domain (Settings → Pages → Custom domain). This is required
   because the site is root-served; the default `username.github.io/blog`
   subpath would 404 on internal links.
3. Push to `main`; the Action builds and deploys.

### First push

```
git init
git add .
git commit -m "Initial commit: migrated cloudnetes blog (Astro)"
git branch -M main
git remote add origin https://github.com/punitporwal07/blog.git
git push -u origin main
```

## Login gate (cosmetic only)

There is a client-side "soft gate": visitors are redirected to `/login` and must
enter a shared passphrase, which sets a `sessionStorage` flag that unlocks the
rest of the site for that browser tab.

**This is NOT real security.** The site is fully static — every article's HTML
is present in the deployed files and reachable by anyone who disables
JavaScript, reads the network tab, or requests a URL directly. The passphrase is
shipped to the browser (treat it as public). It only deters casual viewing.

- Passphrase is set in `src/pages/login.astro` (`const PASSPHRASE = ...`).
- The redirect check lives in `src/layouts/BaseLayout.astro` (inline script in
  `<head>`), keyed on `sessionStorage["cn_gate_ok"]`.
- "Sign out" in the nav clears the flag and returns to `/login`.

For genuine access control, use host-level auth (Cloudflare Access, Netlify,
Vercel) or convert the site to Astro SSR with real server-side sessions.

## Images

`scripts/download-images.mjs` downloads all Blogger-hosted images into
`public/blog-images/` and rewrites the Markdown to local `/blog-images/...`
paths. It is idempotent (URL→filename cache in `data/image-map.json`). Run with
`node --use-system-ca scripts/download-images.mjs`.

## Front matter shape

```yaml
title: "..."
description: "..."
pubDate: 2024-10-15T09:38:00.000-07:00
updatedDate: 2025-03-27T03:43:15.954-07:00
tags:
  - "gitlab"
originalUrl: "https://cloudnetes.blogspot.com/2024/10/secret-detection-in-gitlab.html"
```
