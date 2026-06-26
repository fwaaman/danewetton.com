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
- If Contentful has `Gallery Photo` entries marked visible, the homepage uses those instead.
- Journal posts live in `src/content/journal/`.
- Set `draft: true` on a journal post to keep it out of the build.
- Future-dated journal posts are also excluded from the build.
- CMS-uploaded journal media is stored in `public/journal-media/`.

## Contentful

Content is managed in [Contentful](https://app.contentful.com) (hosted — there is no
editor to run locally). The homepage gallery reads published `Gallery Photo` entries
through the Content Delivery API at build time.

### Content model

The homepage reads the `Gallery` content type (API identifier `gallery`), which has a
single field:

- `image` — Media, **many files** (an ordered list of image assets)

For each image asset, the **title** becomes the alt text and the **description** (if
set) becomes the caption. Photos appear in the order they sit in the `image` array.

To publish photos:

1. Create (or edit) a `Gallery` entry and add images to the `image` field.
2. Set each asset's **title** (alt text) — and optionally its description (caption).
3. **Publish** both the assets and the `Gallery` entry. The Delivery API only returns
   published content.

API credentials live under **Settings → API keys** (the Space ID and the Content
Delivery API access token).

### Environment variables

Copy `.env.example` to `.env` and fill in:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_DELIVERY_TOKEN`
- `CONTENTFUL_ENVIRONMENT` (defaults to `master`)

Set the same variables in Cloudflare Pages for production builds.

The homepage falls back to local files in `src/assets/photos/` until Contentful has
visible gallery entries (or if the variables are missing).

## Deployment

The site is configured for Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Cloudflare Pages config: `wrangler.toml`
- Static headers: `public/_headers`
