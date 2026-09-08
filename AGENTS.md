# AGENTS.md — Riflesso (Lexington Themes · Astro + Sanity)

**Riflesso** is a Lexington Themes starter oriented around a **visual portfolio / gallery-led marketing site**: the homepage highlights a hero video and a grid of gallery entries, with supporting **blog**, **team**, **store (product)**, and **legal** sections. Use it as a **multipage marketing / content site** with optional **Sanity CMS** behind the same components.

**Publisher:** [Lexington Themes](https://lexingtonthemes.com/) · **Theme:** [Riflesso template page](https://lexingtonthemes.com/templates/riflesso)

**Design rules:** [.cursor/skills/riflesso-design/SKILL.md](./.cursor/skills/riflesso-design/SKILL.md) - read before creating or changing any UI.  

---

## Tech stack (from manifests only)

| Area | Source | What’s in this repo |
|------|--------|---------------------|
| **Workspace** | Root `package.json` | `pnpm@9.15.0`; scripts: `dev`, `dev:web`, `dev:studio`, `build`, `build:web`, `build:studio`, `clean`, `migrate`, `seed:all`. Root devDeps: `@sanity/client`, `gray-matter`, `tsx`, `dotenv`. |
| **Web** | `apps/web/package.json` | `astro@^6.0.0`; `@astrojs/rss`, `@astrojs/sitemap`; `@tailwindcss/vite@^4.x`, `tailwindcss@^4.x`, `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwind-scrollbar-hide`; `@lexingtonthemes/seo`; `@sanity/client`, `@sanity/image-url`; `groq`; `@portabletext/to-html`, `@portabletext/types`; `reading-time` (listed; **no usage under `apps/web/src`** found); `sharp` (devDependency). |
| **Web config** | `apps/web/astro.config.mjs` | Vite plugin: `@tailwindcss/vite`; integration: `@astrojs/sitemap`; `site: "https://yourwebsite.com"`; `markdown` + top-level `shikiConfig` (Shiki theme `css-variables`, drafts); `experimental.svgo: true`. **No** `@astrojs/mdx` in dependencies or config. |
| **Studio** | `apps/studio/package.json` | `sanity@^5.16.0`; `react`, `react-dom`, `styled-components`; `@sanity/icons`, `@sanity/vision`. |
| **Studio config** | `apps/studio/sanity.config.ts` | `structureTool` (custom `structure` from `structure.ts`), `visionTool` only — no other plugins declared. |

---

## Monorepo layout (actual paths)

| Path | Role |
|------|------|
| `apps/web/src/pages/` | Astro routes |
| `apps/web/src/layouts/` | `BaseLayout`, `BlogLayout`, `TeamLayout`, `GalleryLayout`, `StoreLayout`, `LegalLayout` |
| `apps/web/src/components/` | UI including `components/fundations/` (Lexington base primitives — **keep this folder name spelling**) |
| `apps/web/src/content/` | Markdown for Content Collections (`team/`, `store/`, `gallery/`, `posts/`, `legal/`) |
| `apps/web/src/content.config.ts` | Collection definitions (Zod + `glob` loaders) |
| `apps/web/src/styles/global.css` | Tailwind v4 entry (`@import "tailwindcss"`, `@theme` tokens) |
| `apps/web/src/lib/data.ts` | Unified data API (`USE_SANITY` + collection vs GROQ branches) |
| `apps/web/src/lib/sanity/` | `client.ts`, `fetch.ts`, `queries.ts`, `transforms.ts`, `types.ts`, `image.ts`, `portableText.ts`, `index.ts` |
| `apps/web/src/images/` | Local images referenced from frontmatter (`/src/images/...` style paths in samples) |
| `apps/web/public/` | Static assets (e.g. `video/photoshoot.mp4`) |
| `apps/studio/schemas/` | Sanity document types + `siteSettings` |
| `apps/studio/structure.ts` | Studio sidebar structure |
| `scripts/migrate-to-sanity.ts` | Markdown → Sanity migration / `seed:all` |
| `scripts/clean.sh` | Invoked by `pnpm clean` |

`pnpm-workspace.yaml` includes `apps/*` and `packages/*`; **`packages/` is not present** in this checkout.

---

## Dual content model

### A) Astro Content Collections — `apps/web/src/content.config.ts`

Loader pattern: `glob({ pattern: "**/*.md", base: "./src/content/<name>", generateId: filename without extension })`.

Image fields use the collection `image` helper: `z.object({ url: image(), alt: z.string() })` (and arrays of the same shape where noted). Sample markdown uses **`url` paths under `/src/images/...`**, resolved against files in `apps/web/src/images/`.

| Collection | Folder | Required Zod fields (and notes) | Copy-this-file sample |
|------------|--------|--------------------------------|------------------------|
| `team` | `apps/web/src/content/team/` | `name`, `image.{url,alt}`; optional `role`, `bio`, `socials.{twitter,website,linkedin,email}` | `apps/web/src/content/team/david-lee.md` |
| `store` | `apps/web/src/content/store/` | `price`, `title`, `checkout`, `license`, `highlights` (array), `description`, `image`, `images` (array); optional `specifications`, `faq` | `apps/web/src/content/store/1.md` |
| `gallery` | `apps/web/src/content/gallery/` | `category`, `title`, `description`, `thumbnail`; optional `images` array | `apps/web/src/content/gallery/1.md` |
| `posts` | `apps/web/src/content/posts/` | `title`, `pubDate`, `description`, `team` (string slug), `image`, `tags` | `apps/web/src/content/posts/1.md` |
| `legal` | `apps/web/src/content/legal/` | `page`, `pubDate`; body is markdown (no image schema on the collection) | `apps/web/src/content/legal/privacy.md` |

**Not present in this repo:** separate collections for authors, podcast, jobs, or help center (despite older README prose elsewhere).

### B) Sanity CMS — `apps/web/src/lib/sanity/` + `apps/web/src/lib/data.ts`

| Sanity `_type` | Schema file | Aligns with collection |
|----------------|-------------|-------------------------|
| `post` | `apps/studio/schemas/post.ts` | `posts` |
| `teamMember` | `apps/studio/schemas/teamMember.ts` | `team` |
| `gallery` | `apps/studio/schemas/gallery.ts` | `gallery` |
| `product` | `apps/studio/schemas/product.ts` | `store` |
| `legalPage` | `apps/studio/schemas/legalPage.ts` | `legal` |
| `siteSettings` | `apps/studio/schemas/siteSettings.ts` | **No markdown collection** — singleton-style site config in Studio (navigation, footer object, socials, SEO fields). |

**Unified API:** `apps/web/src/lib/data.ts` exports getters (`getAllPosts`, `getPostBySlug`, team/gallery/product/legal equivalents) that switch on **`USE_SANITY`**. Sanity path: `sanityFetch` + queries in `queries.ts` + `transform*.ts` in `transforms.ts` + types in `types.ts`. Images: `image.ts` (`urlFor`, `getImageUrl`). Portable Text: `portableText.ts` (`portableTextToHtml`, `portableTextToPlainText`). **`siteSettingsQuery`** lives in `queries.ts` and is used by **`apps/web/src/components/fundations/head/Seo.astro`** (not wired through `data.ts`).

### Toggle / environment

- **Content vs Sanity for list/detail data:** `export const USE_SANITY` in **`apps/web/src/lib/data.ts`** (`true` / `false`). README documents this file as the switch; it is **not** an environment variable. *(The migration script prints “set in `.env`” — that message does not match the implementation.)*
- **`apps/web/.env` (from `.env.example`):** `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`; optional `SANITY_READ_TOKEN` (comment: draft/preview).
- **`apps/studio/.env` (from `.env.example`):** `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`.
- **Collections-only:** No need for Studio or migration to **edit markdown**. You still **instantiate a `@sanity/client` in `client.ts`** using `import.meta.env`; default SEO (`Seo.astro`) **always** calls `sanityFetch(siteSettingsQuery)`, so **production setups should plan for valid Sanity env + a `siteSettings` document** or adjust `Seo.astro` for a non-Sanity fallback.
- **Sanity mode:** Studio running/deployed, `.env` filled, `USE_SANITY = true`, content published in Sanity.

### Seeding / migration

- **`pnpm migrate`** (root) → `tsx scripts/migrate-to-sanity.ts`: reads markdown under `apps/web/src/content/`**, uploads images from `apps/web/src/images/`** per frontmatter paths, creates/updates Sanity documents (`post`, `teamMember`, `gallery`, `product`, `legalPage`). Requires **`SANITY_TOKEN` or `SANITY_WRITE_TOKEN`** plus **`SANITY_PROJECT_ID`** (loaded from `apps/web/.env`). Does **not** seed `siteSettings`.
- **`pnpm seed:all`** → `SEED_ALL=1` same script: deletes documents per type / id cleanup, waits 3s, then runs the same migration path (see README for the “one per type” intent).

Other files under `scripts/` (e.g. `verify-sanity-content.ts`, `cleanup-*.ts`) are **not** exposed as root `package.json` scripts; open the file for behavior.

---

## Routing (from `apps/web/src/pages/`)

Use this table; the README “Website Routes” section lists **authors / podcast / jobs / helpcenter** paths that **do not exist** in this tree.

| Pattern | File | Notes |
|---------|------|--------|
| `/` | `index.astro` | Gallery-led homepage |
| `/blog` | `blog/index.astro` | Blog index |
| `/blog/posts/*` | `blog/posts/[...slug].astro` | Rest slug |
| `/blog/tags` | `blog/tags/index.astro` | |
| `/blog/tags/:tag` | `blog/tags/[tag].astro` | Dynamic segment |
| `/team` | `team/index.astro` | |
| `/team/*` | `team/[...slug].astro` | Rest slug |
| `/gallery` | `gallery/index.astro` | |
| `/gallery/posts/*` | `gallery/posts/[...slug].astro` | Rest slug |
| `/store` | `store/index.astro` | |
| `/store/*` | `store/[...slug].astro` | Rest slug |
| `/legal/*` | `legal/[...slug].astro` | Rest slug |
| `/system/overview`, `/system/typography`, `/system/link`, `/system/colors`, `/system/buttons` | `system/*.astro` | Internal/system UI |
| `/studio` | `studio.astro` | |
| `/rss.xml` | `rss.xml.js` | Uses `@astrojs/rss`; globs `./blog/*.{md,mdx}` from `pages/` (**no such markdown files** beside `.astro` in `pages/blog/`) |
| 404 | `404.astro` | |

Dynamic segments: **`[...slug]`** (blog posts, team, store, gallery item, legal), **`[tag]`** (blog tags).

---

## Customization (real files)

| Concern | Where |
|---------|--------|
| **Site URL** | `apps/web/astro.config.mjs` → `site`; canonical URLs in `Seo.astro` also use `siteSettings.siteUrl` from Sanity when available |
| **Global SEO wrapper** | `components/fundations/head/Seo.astro` (`@lexingtonthemes/seo`), `BaseHead.astro`, `Meta.astro`, `Fonts.astro`, `Favicons.astro` |
| **Colors / type scale** | `src/styles/global.css` (`@theme`, fonts) |
| **Nav** | `components/global/Navigation.astro` (inline `navLinks`; README’s Studio “navigation” fields are schema-only until wired) |
| **Footer** | `components/global/Footer.astro` |
| **Shell** | `layouts/BaseLayout.astro` |

---

## Commands (pnpm)

| Command | Purpose |
|---------|--------|
| `pnpm install` | Workspace deps |
| `pnpm dev` | Parallel `dev` in packages (site + Studio when both define `dev`) |
| `pnpm dev:web` | Site only (`@lexington/web`) |
| `pnpm dev:studio` | Studio only |
| `pnpm build` / `pnpm build:web` / `pnpm build:studio` | Production builds |
| `pnpm clean` | `scripts/clean.sh` |
| `pnpm migrate` | Content → Sanity |
| `pnpm seed:all` | Reset + seed (see README) |

Day-to-day site work is usually **`pnpm dev:web`** from the repo root.

---

## Guardrails

- Do **not** rename **`fundations`** — many imports depend on it.
- Widening **Zod** collection schemas or **Sanity** schemas without updating **`data.ts`**, **`transforms.ts`**, **`types.ts`**, **`queries.ts`**, and consumers in **`pages/` / `layouts/`** breaks parity.
- Prefer **one shape** for the unified layer: markdown-normalized fields should match what `transform*.ts` produces.
- Keep **minimal diffs**; follow existing `@/` path aliases (`tsconfig` `paths`).

---

## Support & docs (README-aligned)

- **Documentation:** https://lexingtonthemes.com/documentation  
- **Support:** https://lexingtonthemes.com/legal/support/  
- **Changelog (theme):** https://lexingtonthemes.com/changelog/riflesso  

**Sanity:** README links to [sanity.io/manage](https://sanity.io/manage) and [Sanity Documentation](https://www.sanity.io/docs). Use those for project settings and product docs.

---

## Related repo docs

`README.md` (overview), `SEO.md`, `STARTING-UP.md` — may include prose that predates the current route/collection set; **trust `content.config.ts`, `pages/`, and Studio schemas** for structure.
