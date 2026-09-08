/**
 * Sanity Library Index
 *
 * Exports all Sanity-related utilities for the 5 Content Collections:
 * - posts
 * - team
 * - gallery
 * - store (products)
 * - legal
 */

// Client and fetching
export { client, previewClient } from "./client";
export { sanityFetch } from "./fetch";

// Queries
export {
  // Posts
  allPostsQuery,
  postBySlugQuery,
  postsByTagQuery,
  allTagsQuery,
  relatedPostsQuery,
  // Team Members
  allTeamMembersQuery,
  teamMemberBySlugQuery,
  // Gallery
  allGalleryQuery,
  galleryBySlugQuery,
  // Products (Store)
  allProductsQuery,
  productBySlugQuery,
  // Legal Pages
  allLegalPagesQuery,
  legalPageBySlugQuery,
  // Site Settings
  siteSettingsQuery,
} from "./queries";

// Image handling
export { urlFor, getImageUrl } from "./image";

// Portable Text rendering
export { portableTextToHtml, portableTextToPlainText } from "./portableText";

// Types
export type {
  // Image types
  SanityImage,
  ImageWithAlt,
  // Post types
  SanityPost,
  Post,
  // Team Member types
  SanityTeamMember,
  TeamMember,
  // Gallery types
  SanityGallery,
  Gallery,
  // Product types
  SanityProduct,
  Product,
  // Legal Page types
  SanityLegalPage,
  LegalPage,
  // Site Settings
  SiteSettings,
} from "./types";

// Transforms
export {
  transformPost,
  transformTeamMember,
  transformGallery,
  transformProduct,
  transformLegalPage,
} from "./transforms";
