const projectId = import.meta.env.SANITY_PROJECT_ID || 'ovqshb4n';
const dataset = import.meta.env.SANITY_DATASET || 'danewetton';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-06-01';

export interface SanityGalleryPhoto {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface SanityGalleryResult {
  photos?: Array<{
    id?: string;
    src?: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
}

const galleryQuery = `*[_type == "homepageGallery"][0]{
  "photos": photos[visible != false && defined(image.asset)]{
    "id": coalesce(_key, image.asset->_id),
    alt,
    caption,
    "src": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }
}`;

const imageUrl = (src: string, width: number, quality: number) => {
  const url = new URL(src);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  return url.href;
};

export async function getHomepageGallery() {
  if (!projectId || !dataset) return [];

  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
  );
  endpoint.searchParams.set('query', galleryQuery);

  try {
    const response = await fetch(endpoint);
    if (!response.ok) return [];

    const payload = (await response.json()) as { result?: SanityGalleryResult | null };
    const photos = payload.result?.photos ?? [];

    return photos
      .filter((photo): photo is Required<Pick<typeof photo, 'id' | 'src'>> & typeof photo =>
        Boolean(photo.id && photo.src)
      )
      .map((photo) => ({
        id: photo.id,
        src: imageUrl(photo.src, 1200, 85),
        fullSrc: imageUrl(photo.src, 2400, 90),
        alt: photo.alt || '',
        caption: photo.caption,
        width: photo.width,
        height: photo.height,
      })) satisfies SanityGalleryPhoto[];
  } catch {
    return [];
  }
}
