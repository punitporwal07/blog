// Minimal GitHub OAuth broker for Decap CMS, as a Cloudflare Worker.
//
// Decap (running on your static site) opens /auth?provider=github. This Worker
// redirects to GitHub's consent screen, GitHub calls back to /callback with a
// code, we exchange it for an access token, then hand the token back to the
// Decap window via postMessage. No token or secret is ever exposed to the
// browser except the final short-lived access token Decap needs to commit.
//
// Secrets (set with `wrangler secret put`):
//   OAUTH_CLIENT_ID      - GitHub OAuth App client id
//   OAUTH_CLIENT_SECRET  - GitHub OAuth App client secret
// Optional vars (wrangler.toml [vars]):
//   ALLOWED_ORIGIN       - your site origin, e.g. https://punitporwal07.github.io
//   SCOPE                - GitHub scope (default "repo")

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

function html(body) {
  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Page returned to the Decap popup. It posts the result to the opener window
// using the handshake protocol Decap expects, then closes.
function renderResult(status, contentObj, allowedOrigin) {
  const payload = `authorization:github:${status}:${JSON.stringify(contentObj)}`;
  const target = allowedOrigin ? JSON.stringify(allowedOrigin) : '"*"';
  return html(`<!doctype html><html><body><script>
    (function () {
      function send() {
        window.opener && window.opener.postMessage(${JSON.stringify(payload)}, ${target});
      }
      // Decap first pings us; reply once it does, then again to be safe.
      window.addEventListener("message", function () { send(); }, false);
      send();
      window.opener && window.opener.postMessage("authorizing:github", ${target});
    })();
  </script>Authentication ${status}. You can close this window.</body></html>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const allowedOrigin = env.ALLOWED_ORIGIN || "";
    const scope = env.SCOPE || "repo";

    // Step 1: kick off the OAuth dance.
    if (path === "/auth") {
      const redirectUri = `${url.origin}/callback`;
      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set("client_id", env.OAUTH_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", scope);
      authUrl.searchParams.set("state", crypto.randomUUID());
      return Response.redirect(authUrl.toString(), 302);
    }

    // Step 2: GitHub redirects back here with ?code=...
    if (path === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return renderResult("error", { message: "Missing code" }, allowedOrigin);
      }
      const resp = await fetch(GITHUB_TOKEN, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code,
        }),
      });
      const data = await resp.json();
      if (data.error || !data.access_token) {
        return renderResult(
          "error",
          { message: data.error_description || "Token exchange failed" },
          allowedOrigin
        );
      }
      return renderResult(
        "success",
        { token: data.access_token, provider: "github" },
        allowedOrigin
      );
    }

    if (path === "/") {
      return html("OAuth broker for Decap CMS is running.");
    }

    return new Response("Not found", { status: 404 });
  },
};
