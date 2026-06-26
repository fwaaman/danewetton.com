const space = import.meta.env.CONTENTFUL_SPACE_ID;
const token = import.meta.env.CONTENTFUL_DELIVERY_TOKEN;
const environment = import.meta.env.CONTENTFUL_ENVIRONMENT || 'master';

export interface GalleryPhoto {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ContentfulAsset {
  sys: { id: string };
  fields?: {
    title?: string;
    description?: string;
    file?: {
      url?: string;
      details?: { image?: { width?: number; height?: number } };
    };
  };
}

interface AssetLink {
  sys: { id: string };
}

interface ContentfulEntry {
  sys: { id: string; createdAt: string };
  fields?: {
    // The "Gallery" content type stores an ordered array of image assets.
    image?: AssetLink[];
  };
}

interface ContentfulResponse {
  items?: ContentfulEntry[];
  includes?: { Asset?: ContentfulAsset[] };
}

// Contentful asset URLs come back protocol-relative (//images.ctfassets.net/...).
// Add the scheme and ask the Images API for an optimised WebP at the size we need.
const imageUrl = (url: string, width: number, quality: number) => {
  const base = url.startsWith('//') ? `https:${url}` : url;
  const out = new URL(base);
  out.searchParams.set('fm', 'webp');
  out.searchParams.set('w', String(width));
  out.searchParams.set('q', String(quality));
  return out.href;
};

export async function getHomepageGallery(): Promise<GalleryPhoto[]> {
  if (!space || !token) return [];

  const endpoint = new URL(
    `https://cdn.contentful.com/spaces/${space}/environments/${environment}/entries`
  );
  endpoint.searchParams.set('content_type', 'gallery');
  endpoint.searchParams.set('include', '2');
  endpoint.searchParams.set('limit', '50');
  endpoint.searchParams.set('order', 'sys.createdAt');

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as ContentfulResponse;
    const assets = new Map(
      (payload.includes?.Asset ?? []).map((asset) => [asset.sys.id, asset])
    );

    // Flatten every gallery entry's image array into one ordered list of photos.
    const photos: GalleryPhoto[] = [];
    for (const entry of payload.items ?? []) {
      for (const link of entry.fields?.image ?? []) {
        const asset = assets.get(link.sys.id);
        const url = asset?.fields?.file?.url;
        if (!url) continue;
        const dimensions = asset.fields?.file?.details?.image;
        photos.push({
          id: asset.sys.id,
          src: imageUrl(url, 1200, 85),
          fullSrc: imageUrl(url, 2400, 90),
          // Asset title → alt text; asset description → optional caption.
          alt: asset.fields?.title || '',
          caption: asset.fields?.description || undefined,
          width: dimensions?.width,
          height: dimensions?.height,
        });
      }
    }
    return photos;
  } catch {
    return [];
  }
}
