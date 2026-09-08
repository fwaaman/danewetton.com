import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * TypeScript Types for Sanity CMS
 *
 * Matches the 5 Content Collections:
 * - posts -> SanityPost, Post
 * - team -> SanityTeamMember, TeamMember
 * - gallery -> SanityGallery, Gallery
 * - store -> SanityProduct, Product
 * - legal -> SanityLegalPage, LegalPage
 */

// =============================================================================
// IMAGE TYPES
// =============================================================================

export interface SanityImage {
  asset: SanityImageSource;
  alt?: string;
}

export interface ImageWithAlt {
  url: string;
  alt: string;
}

// =============================================================================
// POST TYPES
// =============================================================================

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  team: string;
  tags: string[];
  image: SanityImage;
  body: PortableTextBlock[] | string;
}

export interface Post {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    team: string;
    tags: string[];
    image: ImageWithAlt;
  };
  body: string;
}

// =============================================================================
// TEAM MEMBER TYPES
// =============================================================================

export interface SanityTeamMember {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  image: SanityImage;
  socials?: {
    twitter?: string;
    website?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface TeamMember {
  slug: string;
  data: {
    name: string;
    role?: string;
    bio?: string;
    image: ImageWithAlt;
    socials?: {
      twitter?: string;
      website?: string;
      linkedin?: string;
      email?: string;
    };
  };
}

// =============================================================================
// GALLERY TYPES
// =============================================================================

export interface SanityGallery {
  _id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: SanityImage;
  images?: SanityImage[];
}

export interface Gallery {
  slug: string;
  data: {
    category: string;
    title: string;
    description: string;
    thumbnail: ImageWithAlt;
    images?: ImageWithAlt[];
  };
}

// =============================================================================
// PRODUCT TYPES (STORE)
// =============================================================================

export interface SanityProduct {
  _id: string;
  title: string;
  slug: string;
  price: string;
  checkout: string;
  license: string;
  description: string;
  highlights: string[];
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  image: SanityImage;
  images: SanityImage[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Product {
  slug: string;
  data: {
    title: string;
    price: string;
    checkout: string;
    license: string;
    description: string;
    highlights: string[];
    specifications?: Array<{
      name: string;
      value: string;
    }>;
    image: ImageWithAlt;
    images: ImageWithAlt[];
    faq?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// =============================================================================
// LEGAL PAGE TYPES
// =============================================================================

export interface SanityLegalPage {
  _id: string;
  page: string;
  slug: string;
  pubDate: string;
  body?: PortableTextBlock[];
}

export interface LegalPage {
  slug: string;
  data: {
    page: string;
    pubDate: Date;
  };
  body?: PortableTextBlock[];
}

// =============================================================================
// SITE SETTINGS TYPES
// =============================================================================

export interface SiteSettings {
  title?: string;
  description?: string;
  siteUrl?: string;
  ogImage?: SanityImage;
  twitterHandle?: string;
  navigation?: Array<{
    label: string;
    href: string;
  }>;
  footer?: {
    text?: string;
    links?: Array<{
      label: string;
      href: string;
    }>;
  };
  socials?: Array<{
    platform: string;
    url: string;
  }>;
}
