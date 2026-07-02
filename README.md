# danewetton.com

Astro photography portfolio and journal for Dane Wetton.

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Content

All content lives in this repo as files — there's no external CMS account or API
key. Edit it in two ways:

1. **Directly**, by editing the files under `src/content/` and `src/assets/` and
   committing/pushing as usual.
2. **Through the CMS UI** at `/admin` (Decap CMS) — a form-based editor that commits
   changes to this repo on your behalf, which triggers a rebuild the same as any
   other push. Requires the one-time setup below before it can log you in.

### Content model

- **Home** (`src/content/home/home.json`) — the homepage hero image.
- **Portfolio Gallery** (`src/content/gallery/gallery.json`) — the ordered list of
  photos on `/portfolio`. Each entry: `id` (controls order), `image`, `alt`,
  optional `caption`.
- **Journal** (`src/content/journal/*.md`) — one markdown file per post: `title`,
  `date`, `excerpt` (≤200 chars), optional `coverImage`/`coverAlt`, `tags`, and a
  markdown body. A post with a future `date` stays hidden until that date arrives.
- **About** (`src/content/about/about.md`) — `title`, optional `portrait`/
  `portraitAlt`, and a markdown bio.

Images referenced by content files live under `src/assets/{gallery,journal,home,about}/`
so Astro can optimize them at build time.

## Setting up the CMS login (one-time)

Decap CMS's GitHub login needs an OAuth token exchange, which needs a small server.
Rather than run one ourselves, this uses a **free Netlify project purely for that
login step** — the real site keeps deploying via Cloudflare Pages as it always has;
Netlify never serves any actual content.

1. **Create a GitHub OAuth App**: github.com/settings/developers → "New OAuth App".
   - Homepage URL: `https://danewetton.com`
   - Authorization callback URL: `https://<your-netlify-site>.netlify.app/callback`
     (you'll get the Netlify URL in the next step — come back and fill this in after)
   - Save the generated **Client ID** and **Client Secret**.
2. **Create a free Netlify site**: app.netlify.com → "Add new site" → you can deploy
   an empty/placeholder repo, or even drag-and-drop an empty folder — it just needs
   to exist so it has a `*.netlify.app` URL.
3. In that Netlify site: **Site configuration → Access control → OAuth** → install
   provider → **GitHub**, and paste in the Client ID/Secret from step 1.
4. Go back to the GitHub OAuth App and set the callback URL to
   `https://<your-netlify-site>.netlify.app/callback`.
5. Edit `public/admin/config.yml` in this repo and replace `base_url:
   https://REPLACE-ME.netlify.app` with your actual Netlify site URL, then commit.

After that, visiting `https://danewetton.com/admin` and clicking "Login with GitHub"
will work.

## Deployment

The site is configured for Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Cloudflare Pages config: `wrangler.toml`
- Static headers: `public/_headers`

Pushing to `main` on GitHub triggers a Cloudflare Pages build automatically (Git
integration, already connected — no local `wrangler` auth needed).
