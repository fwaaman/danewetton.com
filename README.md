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
- Journal posts live in `src/content/journal/`.
- Set `draft: true` on a journal post to keep it out of the build.
- Future-dated journal posts are also excluded from the build.
- CMS-uploaded journal media is stored in `public/journal-media/`.

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
