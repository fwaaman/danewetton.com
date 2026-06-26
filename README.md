# danewetton.com

Astro portfolio and journal site for Dane Wetton.

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Content

Content is managed in [Sanity](https://www.sanity.io/manage) — a hosted editor you log
into from any device. Both the homepage gallery and the journal are read from Sanity at
build time, so publishing in Sanity (and triggering a rebuild) updates the live site.

- The homepage gallery reads the **Home Gallery** document (its `images` array, in order).
- Journal posts are **Journal Post** documents.
- A post is hidden until you **Publish** it in Sanity; future-dated posts stay hidden
  until their date arrives.
- The homepage falls back to local files in `src/assets/photos/` whenever the Sanity
  gallery is empty (or the env vars are missing), so it never renders blank.

### Content model

Two document types (defined in Sanity, project `ovqshb4n`):

- **Home Gallery** — an ordered `images` array; each image has optional `alt` and
  `caption`. Drag to reorder.
- **Journal Post** — `title`, `slug`, `date`, `excerpt`, optional `coverImage`, rich-text
  `body`, and `tags`.

### Environment variables

Copy `.env.example` to `.env` and fill in (neither value is secret — the dataset is public):

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET` (defaults to `production`)

Set the same variables in Cloudflare Pages for production builds.

## Deployment

The site is configured for Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Cloudflare Pages config: `wrangler.toml`
- Static headers: `public/_headers`

### Auto-rebuild on publish

The site is static, so it must rebuild to pick up Sanity edits. Wire that up once:

1. In Cloudflare Pages → the project → **Settings → Builds & deployments → Deploy hooks**,
   create a hook (e.g. "Sanity publish") and copy its URL.
2. In [Sanity Manage](https://www.sanity.io/manage) → project `ovqshb4n` → **API → Webhooks**,
   add a webhook pointing at that URL (method `POST`, dataset `production`).

After this, hitting **Publish** in Sanity triggers a fresh deploy automatically.
