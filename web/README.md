# Superloopy landing page

Static landing page payload for [Superloopy](https://github.com/beefiker/superloopy).
No build step. The page mirrors the local J-Vers clone payload (`index.html`, `_next/`, `uploads/`, `models/`, and `favicon/`), rewrites visible content for Superloopy, and adds only a first-hero override that mounts Blueyard's copied Nuxt/WebGL orbit runtime from `orbit.html`, `_nuxt/`, `webgl/`, `basis`, and `draco`.

## Deploy to Cloudflare Pages

### Option A — Wrangler (direct upload)

```
npm i -g wrangler          # if not installed
wrangler pages deploy web --project-name superloopy
```

(Run from the repo root. The first run creates the Pages project.)

### Option B — Connect the Git repo (auto-deploy on push)

In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**:

- **Build command:** *(leave empty)*
- **Build output directory:** `web`

Every push to `main` redeploys.

## Local preview

```
node scripts/serve-web.mjs
```

Use an HTTP server for preview. The server handles static files and maps J-Vers `/_next/image` requests back to local `web/uploads/` files, while the first hero mounts the copied Blueyard `landing-orb` scene.
