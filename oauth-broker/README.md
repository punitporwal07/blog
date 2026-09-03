# OAuth broker for Decap CMS

A tiny Cloudflare Worker that completes the GitHub OAuth handshake for the
`/blog/admin/` editor. GitHub OAuth can't finish inside a static page, so this
Worker does the secret-side token exchange and hands the resulting token back to
the CMS popup via `postMessage`.

It has three routes:

- `/auth` — redirects to GitHub's consent screen (this is Decap's `auth_endpoint`).
- `/callback` — receives GitHub's `?code=...`, exchanges it for a token, returns
  it to the CMS window.
- `/` — health check.

## Deploy (one time, ~5 minutes)

Prereqs: a free [Cloudflare account](https://dash.cloudflare.com/sign-up) and
Node installed. On this corporate machine, prefix npx with the system-CA flag.

### 1. Create a GitHub OAuth App

GitHub → Settings → Developer settings → **OAuth Apps** → **New OAuth App**

- **Application name:** `cloudnetes CMS`
- **Homepage URL:** `https://punitporwal07.github.io/blog`
- **Authorization callback URL:** `https://<worker-name>.<your-subdomain>.workers.dev/callback`
  (you'll get the exact `*.workers.dev` URL after the first deploy — you can
  create the app now with a placeholder and edit this field afterward.)

Click **Register application**, then **Generate a new client secret**. Copy the
**Client ID** and **Client secret**.

### 2. Deploy the Worker

From this folder:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npx wrangler login          # opens a browser to authorize Cloudflare
npx wrangler deploy         # deploys worker.js; prints the workers.dev URL
```

Note the printed URL, e.g. `https://cloudnetes-cms-oauth.<subdomain>.workers.dev`.

### 3. Set the secrets

```powershell
npx wrangler secret put OAUTH_CLIENT_ID       # paste Client ID
npx wrangler secret put OAUTH_CLIENT_SECRET   # paste Client secret
```

### 4. Fix the callback URL

Go back to the GitHub OAuth App and set the **Authorization callback URL** to:

```
https://cloudnetes-cms-oauth.<subdomain>.workers.dev/callback
```

### 5. Point the CMS at the broker

In `../public/admin/config.yml`, set:

```yaml
backend:
  name: github
  repo: punitporwal07/blog
  branch: main
  base_url: https://cloudnetes-cms-oauth.<subdomain>.workers.dev
  auth_endpoint: /auth
```

Commit and push. Then open `https://punitporwal07.github.io/blog/admin/`, click
**Login with GitHub**, authorize, and publish.

## Notes

- The `ALLOWED_ORIGIN` var in `wrangler.toml` restricts which site the token is
  handed to. Keep it as your Pages origin.
- `SCOPE = "repo"` is required so the token can commit to the repo. If the repo
  is public you could narrow to `public_repo`.
- No secrets live in this folder — they're stored in Cloudflare via
  `wrangler secret put`.
