import groq from "groq";

/**
 * GROQ Queries for Sanity CMS
 *
 * Matches the 5 Content Collections:
 * - posts
 * - team
 * - gallery
 * - store (products)
 * - legal
 */

// =============================================================================
// POSTS
// =============================================================================

const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  pubDate,
  team,
  tags,
  image {
    asset->,
    alt
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(pubDate desc) {
    ${postFields},
    "body": pt::text(body)
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body
  }
`;

export const postsByTagQuery = groq`
  *[_type == "post" && $tag in tags] | order(pubDate desc) {
    ${postFields},
    "body": pt::text(body)
  }
`;

export const allTagsQuery = groq`
  array::unique(*[_type == "post" && defined(tags)].tags[])
`;

export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && count((tags)[@ in $tags]) > 0] | order(pubDate desc) [0...3] {
    ${postFields},
    "body": pt::text(body)
  }
`;

// =============================================================================
// TEAM MEMBERS
// =============================================================================

const teamMemberFields = groq`
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  image {
    asset->,
    alt
  },
  socials {
    twitter,
    website,
    linkedin,
    email
  }
`;

export const allTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(name asc) {
    ${teamMemberFields}
  }
`;

export const teamMemberBySlugQuery = groq`
  *[_type == "teamMember" && slug.current == $slug][0] {
    ${teamMemberFields}
  }
`;

// =============================================================================
// GALLERY
// =============================================================================

const galleryFields = groq`
  _id,
  category,
  title,
  "slug": slug.current,
  description,
  thumbnail {
    asset->,
    alt
  },
  images[] {
    asset->,
    alt
  }
`;

export const allGalleryQuery = groq`
  *[_type == "gallery"] | order(title asc) {
    ${galleryFields}
  }
`;

export const galleryBySlugQuery = groq`
  *[_type == "gallery" && slug.current == $slug][0] {
    ${galleryFields}
  }
`;

// =============================================================================
// PRODUCTS (STORE)
// =============================================================================

const productFields = groq`
  _id,
  title,
  "slug": slug.current,
  price,
  checkout,
  license,
  description,
  highlights,
  specifications[] {
    name,
    value
  },
  image {
    asset->,
    alt
  },
  images[] {
    asset->,
    alt
  },
  faq[] {
    question,
    answer
  }
`;

export const allProductsQuery = groq`
  *[_type == "product"] | order(title asc) {
    ${productFields}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productFields}
  }
`;

// =============================================================================
// LEGAL PAGES
// =============================================================================

const legalPageFields = groq`
  _id,
  page,
  "slug": slug.current,
  pubDate
`;

export const allLegalPagesQuery = groq`
  *[_type == "legalPage"] {
    ${legalPageFields}
  }
`;

export const legalPageBySlugQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0] {
    ${legalPageFields},
    body
  }
`;

// =============================================================================
// SITE SETTINGS
// =============================================================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    siteUrl,
    ogImage {
      asset->,
      alt
    },
    twitterHandle,
    navigation[] {
      label,
      href
    },
    footer {
      text,
      links[] {
        label,
        href
      }
    },
    socials[] {
      platform,
      url
    }
  }
`;
