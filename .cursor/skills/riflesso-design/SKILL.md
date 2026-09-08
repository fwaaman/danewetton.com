---
name: riflesso-design
description: Riflesso's design system - typography, color, spacing, and component rules. Use whenever creating or modifying UI in this theme (new pages, sections, components) so the result matches Riflesso's visual language.
---

# Riflesso design system

Riflesso is a photography/portfolio theme where the images are the design: the
chrome around them is nearly invisible. Understated micro-typography, a
near-monochrome gray palette, square-edged full-bleed imagery, and huge
vertical breathing room. When you build new UI here, it should be
indistinguishable from the existing pages.

## Design personality

- Photography first: pages are dominated by edge-to-edge images and video;
  text is small, quiet labeling, never competing with the imagery.
- Radically understated headings: page `h1`s render at body size
  (`variant="textBase"` + `font-medium`) - the theme's confidence comes from
  restraint, not scale.
- Gallery-catalog feel: dense multi-column grids (up to `xl:grid-cols-5`)
  with large vertical gaps (`gap-y-24`) between rows.
- The one place type gets loud is the fullscreen overlay menu:
  `display2XL`, `uppercase`, `font-semibold`.

## Typography

Font is **Hanken Grotesk** (variable weight, Google Fonts, loaded in
`src/components/fundations/head/Fonts.astro`; `--font-sans` in
`src/styles/global.css`). No serif, no mono, no font-feature-settings.
Never introduce another font.

Always use the `Text` component (`@/components/fundations/elements/Text.astro`)
instead of raw tags with ad-hoc sizes. It has ten `display6XL`-`displayXS`
variants plus `textXL`-`textXS`, but the theme uses almost none of the display
range:

- Page title: `tag="h1" variant="textBase"` + `font-medium text-base-900`.
  Yes, body-size. Do not "upgrade" it to a display variant.
- Card title (gallery/store/blog cards): `tag="h3" variant="textSM"` +
  `font-medium tracking-tight text-black`.
- Descriptions / deks: `variant="textSM"` with
  `italic tracking-tighter text-base-600` (see `StoreLayout`, blog dek).
- Metadata, specs, roles: `variant="textXS"` in `text-base-600`.
- Overlay menu links only: `variant="display2XL"` +
  `font-semibold uppercase tracking-tight` - the single sanctioned use of
  display type and of `font-semibold`.
- Small nav/utility text is `text-xs uppercase font-medium` (see
  `Navigation.astro`).

Long-form intros may run a `textBase` statement column against `textSM`
support columns in a `lg:grid-cols-4` split (see `studio.astro`).

## Color system

Only two scales exist, defined as oklch tokens under `@theme` in
`src/styles/global.css`: the neutral **`base`** scale (50-950, cool gray) and
one **`accent`** scale (50-950, a saturated blue-violet). There are no other
hues - never use Tailwind default palette names (`gray`, `slate`, `indigo`...)
or hex values in markup.

Usage rules:

- Page background is white. Framing panels are `bg-base-100` (the homepage
  video sits in one); form fields sit on `bg-white` with `ring-base-200`.
- Text is `text-base-900` (or `text-black` on cards) for titles,
  `text-base-600` for everything secondary; hover flips between the two
  (`text-base-900 hover:text-base-600` and vice versa).
- **Accent is almost invisible in the UI**: it appears only on the Button
  `accent` variant and the search input focus ring. Color in this theme
  comes from the photography, not the palette. Don't paint sections or
  headings with `accent-*`.
- Primary action color is plain black (`bg-black`, Button `default`).
- No dark mode. (A single stray `dark:` class exists in `Footer.astro`;
  don't add more.)

## Layout and spacing

- Every section is `<section>` wrapping a `Wrapper`
  (`@/components/fundations/containers/Wrapper.astro`): `variant="standard"`
  (`2xl:max-w-7xl mx-auto px-4 w-full`) for pages, `variant="prose"` for
  markdown/legal bodies (a pre-styled `prose` block, `max-w-3xl`, black
  headings/links, `text-base-600` paragraphs).
- Page-level vertical padding lives on the Wrapper: `py-24 lg:pt-48` is the
  standard opening for nearly every page (`pt-48` appears on 11+ pages);
  the homepage uses `pb-24`, the footer `py-8`.
- Card grids are the theme's signature layout:
  `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-24 gap-4`
  (the homepage gallery widens to `gap-24`). Keep the huge `gap-y-24` row gap.
- Rhythm inside blocks: `mt-2` between a title and its meta line, `mt-4`
  between a heading and its grid, `mt-12` between major blocks
  (`StoreLayout`), `mt-24` before a full-bleed image break (`studio.astro`).
- Images and video run full-bleed and square: `class="w-full"` or
  `size-full`, `object-cover`, explicit `width`/`height`, capped with
  `lg:max-h-200` for hero images. Always `astro:assets` `<Image>`.
- Cards are made clickable with a stretched link:
  `<div class="relative">` + `<a class="absolute inset-0 z-10">` - copy that
  pattern rather than wrapping the card in an `<a>`.
- Sticky product info uses `lg:sticky lg:top-24 lg:self-start` next to a
  scrolling image column (`GalleryLayout`).

## Components

Reuse these before writing anything new:

- **Button** (`@/components/fundations/elements/Button.astro`): variants
  `default` (black, `hover:bg-base-700`), `accent` (accent-500), `muted`
  (`bg-base-200`), `none`; sizes `xxs`-`xl` with fixed heights (`h-7.5` to
  `h-13`); `isLink` + `href` renders an anchor; `iconOnly`/`onlyIconSize`
  for square icon buttons; `gap` prop (`xs`-`lg`) spaces icon slots.
  Buttons are **pill-shaped** (`rounded-full` is baked in) - never add
  radius or override it to square.
  **Width:** the component renders block-level `flex` and stretches to its
  container, so wrap standalone CTAs in a `flex` row (the store buy button
  sits in `<div class="flex">`); real pages use small sizes (`xs`) - buttons
  are rare and quiet in this theme, mostly confined to the store.
- **Text**: the only sanctioned type scale (see Typography).
- **Wrapper**: the only page-width container. Don't hand-roll
  `max-w-* mx-auto` wrappers.
- **Cards** (`GalleryCard`, `BlogCard`, `StoreCard`, `TeamCard`): image on
  top, `mt-2`, `textSM`/`textBase` `font-medium` title, `textXS` meta.
  Match one of these when adding a new card type.
- **Search** (`global/Search.astro`): FuseJS-powered, the one place with a
  `rounded-full` input and `rounded-lg` dropdown plus `shadow-sm`.
- Icons live in `fundations/icons/` as individual Astro components (`Plus`
  with a `size` prop); add new ones there rather than importing icon packs.
- FAQ/disclosure uses native `<details>`/`<summary>` - no JS component.

## Corners, borders, shadows

- Default is **no border radius anywhere** except: Button (`rounded-full`,
  built in), the search input (`rounded-full`), and the search dropdown
  (`rounded-lg`). That is the complete list in the codebase - never round
  images, cards, panels, or grids.
- Effectively **no shadows**: one `shadow-sm` on the search input is the
  only occurrence. Don't add drop shadows to cards or images.
- Borders are `ring-1 ring-base-200` (search) or `divide-y divide-base-200`
  for stacked lists; no heavy `border-2` styles.
- Motion is `transition duration-300` on hover color changes only; the
  overlay menu animates links with a small staggered translate script.

## Voice and copy

Copy is atmospheric and dryly witty - "quietly nostalgic", "We don't just
'take photos.' We build stories that stick", "Your favorite indie brand's
favorite indie brand". Titles are short evocative phrases ("Pastel cars in
quiet places", "Kickflips & Concrete"). Sentence case for UI copy, no
exclamation marks, no emoji; em dashes are at home here. Image `alt` text is
written as a real one-line scene description.

## Do / Don't

Do:

- Copy an existing page's structure (`py-24 lg:pt-48` opening, `mt-4` grid)
  before inventing a new layout.
- Keep headings body-sized; let images carry the visual weight.
- Use the stretched-link card pattern and `gap-y-24` grid rhythm.
- Keep text columns narrow (`max-w-xs`, `max-w-sm`) beside wide imagery.

Don't:

- Don't use display Text variants in page content - they belong to the
  overlay menu only.
- Don't round corners or add shadows to images, cards, or panels.
- Don't introduce new fonts, hues, gradients, or `dark:` styling.
- Don't use default Tailwind `gray`/`slate`/`zinc` - the neutral scale here
  is `base-*`.
- Don't scatter accent color around; primary buttons are black.
- Don't exceed `font-medium` outside the overlay menu.

## Quality check before finishing

1. Fonts, colors, and spacing all come from existing tokens and match a
   sibling page.
2. New grids read correctly at `sm`, `md`, `lg`, and `xl` breakpoints.
3. Headings use `Text` variants (body-sized for titles); buttons use
   `Button` variants.
4. No new dependencies, no unused imports, minimal diff.
