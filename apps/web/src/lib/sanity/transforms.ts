import { getImageUrl } from "./image";
import type {
  SanityPost,
  SanityTeamMember,
  SanityGallery,
  SanityProduct,
  SanityLegalPage,
  SanityImage,
  Post,
  TeamMember,
  Gallery,
  Product,
  LegalPage,
  ImageWithAlt,
} from "./types";

/**
 * Transform Functions
 *
 * Convert Sanity document shapes to UI-friendly shapes
 * that match the original Astro Content Collection structure.
 */

// =============================================================================
// IMAGE HELPERS
// =============================================================================

function transformImage(image: SanityImage | undefined, fallbackAlt: string = ""): ImageWithAlt {
  return {
    url: getImageUrl(image?.asset),
    alt: image?.alt || fallbackAlt,
  };
}

function transformImageArray(images: SanityImage[] | undefined): ImageWithAlt[] {
  if (!images || images.length === 0) return [];
  return images.map((img, index) => transformImage(img, `Image ${index + 1}`));
}

// =============================================================================
// POST TRANSFORM
// =============================================================================

export function transformPost(post: SanityPost): Post {
  return {
    slug: post.slug,
    data: {
      title: post.title,
      description: post.description,
      pubDate: new Date(post.pubDate),
      team: post.team,
      tags: post.tags || [],
      image: transformImage(post.image, post.title),
    },
    body: typeof post.body === "string" ? post.body : "",
  };
}

// =============================================================================
// TEAM MEMBER TRANSFORM
// =============================================================================

export function transformTeamMember(member: SanityTeamMember): TeamMember {
  return {
    slug: member.slug,
    data: {
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: transformImage(member.image, member.name),
      socials: member.socials,
    },
  };
}

// =============================================================================
// GALLERY TRANSFORM
// =============================================================================

export function transformGallery(gallery: SanityGallery): Gallery {
  return {
    slug: gallery.slug,
    data: {
      category: gallery.category,
      title: gallery.title,
      description: gallery.description,
      thumbnail: transformImage(gallery.thumbnail, gallery.title),
      images: transformImageArray(gallery.images),
    },
  };
}

// =============================================================================
// PRODUCT TRANSFORM
// =============================================================================

export function transformProduct(product: SanityProduct): Product {
  return {
    slug: product.slug,
    data: {
      title: product.title,
      price: product.price,
      checkout: product.checkout,
      license: product.license,
      description: product.description,
      highlights: product.highlights || [],
      specifications: product.specifications,
      image: transformImage(product.image, product.title),
      images: transformImageArray(product.images),
      faq: product.faq,
    },
  };
}

// =============================================================================
// LEGAL PAGE TRANSFORM
// =============================================================================

export function transformLegalPage(page: SanityLegalPage): LegalPage {
  return {
    slug: page.slug,
    data: {
      page: page.page,
      pubDate: new Date(page.pubDate),
    },
    body: page.body,
  };
}
