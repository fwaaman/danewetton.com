/**
 * Sanity Schema Index
 *
 * Exports all document schemas for this project.
 * Must match the 5 Content Collections + siteSettings singleton.
 *
 * Content Schemas (5):
 * - post (posts/)
 * - teamMember (team/)
 * - gallery (gallery/)
 * - product (store/)
 * - legalPage (legal/)
 *
 * Singleton:
 * - siteSettings
 */

import { post } from "./post";
import { teamMember } from "./teamMember";
import { gallery } from "./gallery";
import { product } from "./product";
import { legalPage } from "./legalPage";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  // Content Documents (5 - matches Content Collections)
  post,
  teamMember,
  gallery,
  product,
  legalPage,

  // Singleton
  siteSettings,
];
