# AGENTS.md — Riflesso (Lexington Themes)

**Riflesso** is a multipage Astro theme aimed at **editorial photography, creative studios, and a small product/store presence**: the home page leads with a hero video and a masonry-style gallery grid; **Magazine** (`/blog`) and **Studio** (`/studio`) carry editorial/marketing copy; **Store** lists product-style entries; **System** routes expose Lexington’s UI reference (colors, typography, buttons, links). The overall fit is **creative / editorial SaaS or portfolio marketing**, not a generic app shell.

**Design rules:** [.cursor/skills/riflesso-design/SKILL.md](./.cursor/skills/riflesso-design/SKILL.md) - read before creating or changing any UI.  

## Tech stack

From `package.json` and `astro.config.mjs`:

- **Astro** `^6.0.0`
- **Tailwind CSS** `^4.1.18` via **`@tailwindcss/vite`**
- Plugins: **`@tailwindcss/forms`**, **`@tailwindcss/typography`**, **`tailwind-scrollbar-hide`**
- **MDX**: `@astrojs/mdx` `^5.0.0`
- **RSS**: `@astrojs/rss` `^4.0.17` (`src/pages/rss.xml.js`)
- **Sitemap**: `@astrojs/sitemap` `^3.7.1`
- **SEO components**: `@lexingtonthemes/seo` `^0.1.0` (used in `src/components/fundations/head/Seo.astro`)
- **Content**: `astro:content`, Zod schemas from `astro/zod` in `src/content.config.ts` (no separate `zod` npm dependency)
- **Path alias**: `@/*` → `src/*` (`tsconfig.json`)

Repo package name (npm): `@lexington/rifelsso` (see `package.json`).

## Folder map

| Area | Path |
|------|------|
| Routes | `src/pages/` |
| Layouts | `src/layouts/` (`BaseLayout`, `BlogLayout`, `GalleryLayout`, `StoreLayout`, `TeamLayout`, `LegalLayout`) |
| UI | `src/components/` (`global/`, `fundations/`, `blog/`, `gallery/`, `store/`, `team/`, `assets/`) |
| Collections (Markdown) | `src/content/` (subfolders per collection — see below) |
| Global styles | `src/styles/global.css` |
| Processed images (import / `image()`) | `src/images/` (`assets/`, `blog/`, `gallery/`, `store/`, `team/`) |
| Static public files | `public/` (e.g. `public/video/photoshoot.mp4`, favicon assets referenced in `Favicons.astro`) |

**`fundations` spelling:** The theme intentionally uses `src/components/fundations/` (not “foundations”). Do not rename it without updating every import.

## Content collections (`src/content.config.ts`)

All collections use `glob` loaders for `**/*.{md,mdx}`. Image fields use the Content Layer **`image()`** helper — use paths Astro can resolve (this repo consistently uses strings like `/src/images/...` in frontmatter).

### `team` → `src/content/team/`

- **Required:** `name`, `image` (`url` via `image()`, `alt`)
- **Optional:** `role`, `bio`, `socials` (`twitter`, `website`, `linkedin`, `email` — all optional strings inside `socials`)
- **Template:** copy structure from `src/content/team/david-lee.md`

### `store` → `src/content/store/`

- **Required:** `price`, `title`, `checkout`, `license`, `highlights` (string array), `description`, `image` (`url` + `alt`), `images` (array of `{ url: image(), alt }`)
- **Optional:** `specifications` (`name`/`value` pairs), `faq` (`question`/`answer` pairs)
- **Template:** `src/content/store/1.md`

### `gallery` → `src/content/gallery/`

- **Required:** `category`, `title`, `description`, `thumbnail` (`url` + `alt`)
- **Optional:** `images` (array of `{ url: image(), alt }`)
- **Template:** `src/content/gallery/1.md`

### `posts` (blog) → `src/content/posts/`

- **Required:** `title`, `pubDate` (coerced date), `description`, `team` (**string id** matching a `team` entry, e.g. `david-lee`), `image` (`url` + `alt`), `tags` (string array)
- **Template:** `src/content/posts/1.md`

### `legal` → `src/content/infopages/`

- **Collection export name:** `legal` (folder on disk: `infopages`)
- **Required:** `page` (display title string), `pubDate` (coerced date)
- **Template:** `src/content/infopages/privacy.md`

There is **no** changelog content collection or `/changelog` route in this repo.

## Routing (content → URL)

Dynamic routes use **`[...slug].astro`**; slugs are **`entry.id`** derived from the content filename (e.g. `1.md` → id `1`, `david-lee.md` → `david-lee`).

| Collection | Index | Detail |
|------------|-------|--------|
| `posts` | `/blog` | `/blog/posts/{id}` |
| Tags | `/blog/tags` | `/blog/tags/{tag}` (`[tag].astro`, tag from frontmatter) |
| `store` | `/store` | `/store/{id}` (`trailingSlash: false` in `getStaticPaths`) |
| `gallery` | `/gallery` | `/gallery/posts/{id}` |
| `team` | `/team` | `/team/{id}` (`trailingSlash: false`) |
| `legal` | — | `/legal/{id}` (`trailingSlash: false`; files live in `src/content/infopages/`) |

**Other notable routes:** `/` (home), `/studio`, `/404`, `/rss.xml`, `/system/overview`, `/system/colors`, `/system/typography`, `/system/buttons`, `/system/link`.

Note: `src/pages/system/overview.astro` lists some **example** links (e.g. `/infopages/terms`); actual legal URLs are **`/legal/{slug}`** per `src/pages/legal/[...slug].astro`.

## Customization

- **Site URL / canonical domain:** `astro.config.mjs` → `site: 'https://yoursite.com'`. Feeds and `@astrojs/sitemap` use this. **`src/pages/rss.xml.js`** passes `context.site` for item links; title/description there are currently static strings—adjust if you rebrand.
- **Global SEO placeholder:** `src/components/fundations/head/Seo.astro` uses **`AstroSeo`** from `@lexingtonthemes/seo` with example URLs/title; replace with your production domain and per-page data when you wire real metadata.
- **Brand colors & typography:** `src/styles/global.css` — `@theme` block sets `--font-sans` (Hanken Grotesk) and `--color-accent-*` / `--color-base-*` tokens. **Fonts:** `src/components/fundations/head/Fonts.astro` (Google Fonts link).
- **Chrome / icons:** `src/components/fundations/head/Favicons.astro` + files under `public/` (as linked there).
- **Shell layout:** `src/layouts/BaseLayout.astro` imports `global.css`, `BaseHead`, `Navigation`, `Footer`. **Head stack:** `src/components/fundations/head/BaseHead.astro` composes `Seo`, `Meta`, `Fonts`, `Favicons`, `FuseJS` (site search script).
- **Nav:** `src/components/global/Navigation.astro` (`navLinks` array + overlay menu). **Footer:** `src/components/global/Footer.astro`.

## Commands

Per **`README.md`** (same as `package.json` scripts):

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server |
| `npm run build` | Production build → `./dist/` |
| `npm run preview` | Preview `./dist/` |
| `npm run astro ...` | Astro CLI |

**Requirements (README):** Node.js **18 or 20** (LTS), npm.

## Guardrails

- **Do not** rename `fundations` without a repo-wide import update.
- **Do not** widen or rename Zod fields in `src/content.config.ts` without updating **every** layout/page/component that reads `entry.data` (e.g. `BlogLayout` resolves `team` via `getEntry("team", frontmatter.team)` — that key must stay consistent).
- Keep **`image()`** fields valid; cards and layouts use `astro:assets` `Image` with `post.data.image.url` (or `thumbnail`) and will break if schemas and consuming code diverge.
- Prefer **minimal diffs** matching existing patterns (path alias `@/`, layout composition, `Wrapper`/`Text` from `fundations`).

## Lexington docs & support (from README)

- Theme: https://lexingtonthemes.com/templates/riflesso  
- Documentation: https://lexingtonthemes.com/documentation  
- Changelog (product page): https://lexingtonthemes.com/changelog/riflesso  
- Support: https://lexingtonthemes.com/legal/support/  
- Bundle / storefront: https://lexingtonthemes.com  

Publisher: https://lexingtonthemes.com/
