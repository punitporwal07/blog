// Reads the wrangler OAuth token from its config and asks the Cloudflare API
// for this account's workers.dev subdomain, then prints the broker URL.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ACCOUNT_ID = "1edf62d32cee2a156df012cb4bb637ce";
const WORKER = "cloudnetes-cms-oauth";

// wrangler stores creds here (seen in `whoami` output).
const cfgPath = join(
  homedir(),
  "AppData",
  "Roaming",
  "xdg.config",
  ".wrangler",
  "config",
  "default.toml"
);

const toml = readFileSync(cfgPath, "utf8");
const m = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
if (!m) {
  console.error("Could not find oauth_token in", cfgPath);
  process.exit(1);
}
const token = m[1];

const res = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/subdomain`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const data = await res.json();
if (!data.success) {
  console.error("API error:", JSON.stringify(data.errors));
  process.exit(1);
}
const sub = data.result?.subdomain;
console.log("SUBDOMAIN:", sub);
console.log("BROKER_URL: https://" + WORKER + "." + sub + ".workers.dev");
