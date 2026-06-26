import { toHTML } from '@portabletext/to-html';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
// Dated API version — locks query behaviour so a future Sanity change can't break the build.
const apiVersion = '2024-01-01';

// ── Low-level query helper ────────────────────────────────────────────────
// The dataset is public, so reads need no token. We hit the (non-CDN) API so a
// freshly published edit shows up the moment the site rebuilds. Any failure
// returns null and the pages fall back gracefully — a CMS hiccup never breaks a build.
async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  if (!projectId) return null;

  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
  );
  endpoint.searchParams.set('query', query);
  // GROQ params are passed as `$name`, JSON-encoded.
  for (const [key, value] of Object.entries(params)) {
    endpoint.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  try {
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: T };
    return payload.result ?? null;
  } catch {
    return null;
  }
}

// ── Images ────────────────────────────────────────────────────────────────
// Sanity stores an image as a reference string like "image-<id>-1200x800-jpg".
// That string carries the asset id, native dimensions and format, so we can
// build an optimised CDN URL (and read width/height) without expanding the asset.
interface SanityImage {
  _key?: string;
  alt?: string;
  caption?: string;
  asset?: { _ref?: string };
}

function refToParts(ref?: string) {
  if (!ref) return null;
  const match = ref.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, width, height, ext] = match;
  return { id, width: Number(width), height: Number(height), ext };
}

// Ask the Sanity CDN for an optimised image at the width we need. `auto=format`
// serves WebP/AVIF to browsers that support it; `fit=max` never upscales.
function imageUrl(image: SanityImage | undefined, width: number, quality = 85): string {
  const parts = refToParts(image?.asset?._ref);
  if (!parts) return '';
  const base = `https://cdn.sanity.io/images/${projectId}/${dataset}/${parts.id}-${parts.width}x${parts.height}.${parts.ext}`;
  const out = new URL(base);
  out.searchParams.set('w', String(width));
  out.searchParams.set('q', String(quality));
  out.searchParams.set('auto', 'format');
  out.searchParams.set('fit', 'max');
  return out.href;
}

function imageDimensions(image: SanityImage | undefined) {
  const parts = refToParts(image?.asset?._ref);
  return parts ? { width: parts.width, height: parts.height } : {};
}

// ── Homepage gallery ──────────────────────────────────────────────────────
export interface GalleryPhoto {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export async function getHomepageGallery(): Promise<GalleryPhoto[]> {
  const data = await sanityFetch<{ images?: SanityImage[] }>(
    `*[_type == "gallery"][0]{ images[]{ _key, alt, caption, asset } }`
  );
  if (!data?.images) return [];

  const photos: GalleryPhoto[] = [];
  for (const image of data.images) {
    const src = imageUrl(image, 1200, 85);
    if (!src) continue;
    const dimensions = imageDimensions(image);
    photos.push({
      id: image._key || src,
      src,
      fullSrc: imageUrl(image, 2400, 90),
      alt: image.alt || '',
      caption: image.caption || undefined,
      width: dimensions.width,
      height: dimensions.height,
    });
  }
  return photos;
}

// ── Journal ───────────────────────────────────────────────────────────────
interface JournalDoc {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags?: string[];
  coverImage?: SanityImage;
  body?: unknown[];
}

export interface JournalSummary {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  coverSrc?: string;
  coverAlt: string;
}

export interface JournalPost extends JournalSummary {
  bodyHtml: string;
}

const summaryFields = `
  title,
  "slug": slug.current,
  date,
  excerpt,
  tags,
  coverImage
`;

function toSummary(doc: JournalDoc): JournalSummary {
  const cover = imageUrl(doc.coverImage, 600, 80);
  return {
    title: doc.title,
    slug: doc.slug,
    date: doc.date,
    excerpt: doc.excerpt,
    tags: doc.tags ?? [],
    coverSrc: cover || undefined,
    coverAlt: doc.coverImage?.alt || '',
  };
}

// Render rich-text bodies to HTML. Inline images use the same CDN helper as the
// rest of the site; everything else (headings, lists, quotes, links) maps to the
// plain tags the .prose styles already target.
function renderBody(body: unknown[] | undefined): string {
  if (!body) return '';
  return toHTML(body as never, {
    components: {
      types: {
        image: ({ value }: { value: SanityImage }) => {
          const src = imageUrl(value, 1200, 85);
          if (!src) return '';
          const alt = (value.alt || '').replace(/"/g, '&quot;');
          return `<img src="${src}" alt="${alt}" loading="lazy" />`;
        },
      },
    },
  });
}

// Published posts only, newest first, future-dated posts hidden.
export async function getJournalPosts(): Promise<JournalSummary[]> {
  const docs = await sanityFetch<JournalDoc[]>(
    `*[_type == "journalPost" && date <= now()] | order(date desc){ ${summaryFields} }`
  );
  return (docs ?? []).map(toSummary);
}

export async function getJournalSlugs(): Promise<string[]> {
  const slugs = await sanityFetch<string[]>(
    `*[_type == "journalPost" && date <= now() && defined(slug.current)].slug.current`
  );
  return slugs ?? [];
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  const doc = await sanityFetch<JournalDoc | null>(
    `*[_type == "journalPost" && slug.current == $slug][0]{ ${summaryFields}, body }`,
    { slug }
  );
  if (!doc) return null;
  return { ...toSummary(doc), bodyHtml: renderBody(doc.body) };
}
