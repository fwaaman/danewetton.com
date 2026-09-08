/**
 * Central Data Utility
 *
 * This module provides a unified data layer that works with both:
 * - Astro Content Collections (default, works out-of-the-box)
 * - Sanity CMS (when USE_SANITY is true and credentials are configured)
 *
 * Toggle USE_SANITY to switch between data sources.
 * Components receive the same data shape regardless of the source.
 *
 * Collections supported:
 * - posts (blog)
 * - team (team members)
 * - gallery (photo galleries)
 * - store (products)
 * - legal (legal pages)
 */

import { getCollection, getEntry } from "astro:content";
import {
  sanityFetch,
  // Post queries
  allPostsQuery,
  postBySlugQuery,
  postsByTagQuery,
  allTagsQuery,
  relatedPostsQuery,
  // Team queries
  allTeamMembersQuery,
  teamMemberBySlugQuery,
  // Gallery queries
  allGalleryQuery,
  galleryBySlugQuery,
  // Product queries
  allProductsQuery,
  productBySlugQuery,
  // Legal queries
  allLegalPagesQuery,
  legalPageBySlugQuery,
  // Transforms
  transformPost,
  transformTeamMember,
  transformGallery,
  transformProduct,
  transformLegalPage,
} from "./sanity";

import type {
  SanityPost,
  SanityTeamMember,
  SanityGallery,
  SanityProduct,
  SanityLegalPage,
  Post,
  TeamMember,
  Gallery,
  Product,
  LegalPage,
} from "./sanity";

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Toggle to switch between data sources
 * - false (default): Use Astro Content Collections (works without Sanity)
 * - true: Use Sanity CMS (requires SANITY_PROJECT_ID)
 */
export const USE_SANITY = false;

// =============================================================================
// POSTS
// =============================================================================

export async function getAllPosts(): Promise<Post[]> {
  if (USE_SANITY) {
    const posts = await sanityFetch<SanityPost[]>(allPostsQuery);
    return posts.map(transformPost);
  }

  const posts = await getCollection("posts");
  return posts.map((post) => ({
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      team: post.data.team,
      tags: post.data.tags,
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt,
      },
    },
    body: "",
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (USE_SANITY) {
    const post = await sanityFetch<SanityPost | null>(postBySlugQuery, { slug });
    return post ? transformPost(post) : null;
  }

  const post = await getEntry("posts", slug);
  if (!post) return null;

  return {
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      team: post.data.team,
      tags: post.data.tags,
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt,
      },
    },
    body: "",
  };
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  if (USE_SANITY) {
    const posts = await sanityFetch<SanityPost[]>(postsByTagQuery, { tag });
    return posts.map(transformPost);
  }

  const posts = await getCollection("posts");
  const filtered = posts.filter((post) => post.data.tags.includes(tag));

  return filtered.map((post) => ({
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      team: post.data.team,
      tags: post.data.tags,
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt,
      },
    },
    body: "",
  }));
}

export async function getAllPostTags(): Promise<string[]> {
  if (USE_SANITY) {
    return sanityFetch<string[]>(allTagsQuery);
  }

  const posts = await getCollection("posts");
  const tags = posts.flatMap((post) => post.data.tags);
  return [...new Set(tags)] as string[];
}

export async function getRelatedPosts(slug: string, tags: string[]): Promise<Post[]> {
  if (USE_SANITY) {
    const posts = await sanityFetch<SanityPost[]>(relatedPostsQuery, { slug, tags });
    return posts.map(transformPost);
  }

  const posts = await getCollection("posts");
  const related = posts
    .filter(
      (post) =>
        post.id !== slug && post.data.tags.some((tag) => tags.includes(tag))
    )
    .slice(0, 3);

  return related.map((post) => ({
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      team: post.data.team,
      tags: post.data.tags,
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt,
      },
    },
    body: "",
  }));
}

// =============================================================================
// TEAM MEMBERS
// =============================================================================

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  if (USE_SANITY) {
    const members = await sanityFetch<SanityTeamMember[]>(allTeamMembersQuery);
    return members.map(transformTeamMember);
  }

  const members = await getCollection("team");
  return members.map((member) => ({
    slug: member.id,
    data: {
      name: member.data.name,
      role: member.data.role,
      bio: member.data.bio,
      image: {
        url: member.data.image.url,
        alt: member.data.image.alt,
      },
      socials: member.data.socials,
    },
  }));
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  if (USE_SANITY) {
    const member = await sanityFetch<SanityTeamMember | null>(teamMemberBySlugQuery, { slug });
    return member ? transformTeamMember(member) : null;
  }

  const member = await getEntry("team", slug);
  if (!member) return null;

  return {
    slug: member.id,
    data: {
      name: member.data.name,
      role: member.data.role,
      bio: member.data.bio,
      image: {
        url: member.data.image.url,
        alt: member.data.image.alt,
      },
      socials: member.data.socials,
    },
  };
}

// =============================================================================
// GALLERY
// =============================================================================

export async function getAllGallery(): Promise<Gallery[]> {
  if (USE_SANITY) {
    const items = await sanityFetch<SanityGallery[]>(allGalleryQuery);
    return items.map(transformGallery);
  }

  const items = await getCollection("gallery");
  return items.map((item) => ({
    slug: item.id,
    data: {
      category: item.data.category,
      title: item.data.title,
      description: item.data.description,
      thumbnail: {
        url: item.data.thumbnail.url,
        alt: item.data.thumbnail.alt,
      },
      images: item.data.images?.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
    },
  }));
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  if (USE_SANITY) {
    const item = await sanityFetch<SanityGallery | null>(galleryBySlugQuery, { slug });
    return item ? transformGallery(item) : null;
  }

  const item = await getEntry("gallery", slug);
  if (!item) return null;

  return {
    slug: item.id,
    data: {
      category: item.data.category,
      title: item.data.title,
      description: item.data.description,
      thumbnail: {
        url: item.data.thumbnail.url,
        alt: item.data.thumbnail.alt,
      },
      images: item.data.images?.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
    },
  };
}

// =============================================================================
// PRODUCTS (STORE)
// =============================================================================

export async function getAllProducts(): Promise<Product[]> {
  if (USE_SANITY) {
    const products = await sanityFetch<SanityProduct[]>(allProductsQuery);
    return products.map(transformProduct);
  }

  const products = await getCollection("store");
  return products.map((product) => ({
    slug: product.id,
    data: {
      title: product.data.title,
      price: product.data.price,
      checkout: product.data.checkout,
      license: product.data.license,
      description: product.data.description,
      highlights: product.data.highlights,
      specifications: product.data.specifications,
      image: {
        url: product.data.image.url,
        alt: product.data.image.alt,
      },
      images: product.data.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
      faq: product.data.faq,
    },
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (USE_SANITY) {
    const product = await sanityFetch<SanityProduct | null>(productBySlugQuery, { slug });
    return product ? transformProduct(product) : null;
  }

  const product = await getEntry("store", slug);
  if (!product) return null;

  return {
    slug: product.id,
    data: {
      title: product.data.title,
      price: product.data.price,
      checkout: product.data.checkout,
      license: product.data.license,
      description: product.data.description,
      highlights: product.data.highlights,
      specifications: product.data.specifications,
      image: {
        url: product.data.image.url,
        alt: product.data.image.alt,
      },
      images: product.data.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
      faq: product.data.faq,
    },
  };
}

// =============================================================================
// LEGAL PAGES
// =============================================================================

export async function getAllLegalPages(): Promise<LegalPage[]> {
  if (USE_SANITY) {
    const pages = await sanityFetch<SanityLegalPage[]>(allLegalPagesQuery);
    return pages.map(transformLegalPage);
  }

  const pages = await getCollection("legal");
  return pages.map((page) => ({
    slug: page.id,
    data: {
      page: page.data.page,
      pubDate: page.data.pubDate,
    },
  }));
}

export async function getLegalPageBySlug(slug: string): Promise<LegalPage | null> {
  if (USE_SANITY) {
    const page = await sanityFetch<SanityLegalPage | null>(legalPageBySlugQuery, { slug });
    return page ? transformLegalPage(page) : null;
  }

  const page = await getEntry("legal", slug);
  if (!page) return null;

  return {
    slug: page.id,
    data: {
      page: page.data.page,
      pubDate: page.data.pubDate,
    },
  };
}

// =============================================================================
// RAW CONTENT COLLECTION ACCESS (for rendering markdown)
// =============================================================================

/**
 * Get raw content collection entry for rendering
 * Use this when you need to call render(entry) for markdown content
 */
export async function getRawPostEntry(slug: string) {
  return getEntry("posts", slug);
}

export async function getRawTeamEntry(slug: string) {
  return getEntry("team", slug);
}

export async function getRawGalleryEntry(slug: string) {
  return getEntry("gallery", slug);
}

export async function getRawProductEntry(slug: string) {
  return getEntry("store", slug);
}

export async function getRawLegalEntry(slug: string) {
  return getEntry("legal", slug);
}
