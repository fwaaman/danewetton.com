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

- Portfolio images live in `src/assets/photos/`.
- If Sanity has a `homepageGallery` document with visible photos, the homepage uses that curated order instead.
- Journal posts live in `src/content/journal/`.
- Set `draft: true` on a journal post to keep it out of the build.
- Future-dated journal posts are also excluded from the build.
- CMS-uploaded journal media is stored in `public/journal-media/`.

## Sanity

Sanity Studio is embedded at `/studio`.

Default build values:

- Project ID: `ovqshb4n`
- Dataset: `danewetton`

For production, set these in Cloudflare Pages if they change:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`

In Studio, create a `Homepage Gallery` document with a `photos` array. Each item should have:

- `image`
- `alt`
- `caption` optional
- `visible` boolean

The homepage falls back to local files in `src/assets/photos/` until Sanity has visible gallery images.

Sanity dependencies are listed in `package.json`. If they are not installed yet, run:

```sh
npm install
```

After the Studio first opens, Sanity may ask to add CORS origins. Add authenticated origins for:

- `http://localhost:4321`
- `https://danewetton.com`

## Deployment

The site is configured for Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Cloudflare Pages config: `wrangler.toml`
- Static headers: `public/_headers`

## CMS

The editor is served at `/admin` using Sveltia CMS. Before using it in production,
replace the placeholder `base_url` in `public/admin/config.yml` with the deployed
Cloudflare auth Worker URL for GitHub authentication.
