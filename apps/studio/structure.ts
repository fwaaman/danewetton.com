import type { StructureBuilder } from "sanity/structure";
import {
  DocumentIcon,
  UsersIcon,
  ImagesIcon,
  PackageIcon,
  DocumentTextIcon,
  CogIcon,
} from "@sanity/icons";

// Singleton document IDs
const SITE_SETTINGS_ID = "siteSettings";
const PHOTOS_PAGE_ID = "ec7a220f-6059-4630-b9b9-637ca7e9f808";

/**
 * Studio Structure
 *
 * Organizes content types in the Sanity Studio sidebar.
 * Matches the 5 Content Collections + Site Settings singleton.
 */
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Homepage slideshow (opens the singleton directly)
      S.listItem()
        .title("Homepage Photographs")
        .icon(ImagesIcon)
        .id("homepagePhotographs")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SITE_SETTINGS_ID)
            .title("Homepage Photographs")
        ),

      // The single Photos page gallery
      S.listItem()
        .title("Photos Page")
        .icon(ImagesIcon)
        .id("photosPage")
        .child(
          S.document()
            .schemaType("gallery")
            .documentId(PHOTOS_PAGE_ID)
            .title("Photos Page")
        ),

      S.divider(),

      // Blog Posts
      S.listItem()
        .title("Blog Posts")
        .icon(DocumentIcon)
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog Posts")),

      // Team Members
      S.listItem()
        .title("Team")
        .icon(UsersIcon)
        .schemaType("teamMember")
        .child(S.documentTypeList("teamMember").title("Team Members")),

      // Store / Products
      S.listItem()
        .title("Store")
        .icon(PackageIcon)
        .schemaType("product")
        .child(S.documentTypeList("product").title("Products")),

      // Legal Pages
      S.listItem()
        .title("Legal Pages")
        .icon(DocumentTextIcon)
        .schemaType("legalPage")
        .child(S.documentTypeList("legalPage").title("Legal Pages")),

      S.divider(),

      // Other site settings (singleton)
      S.listItem()
        .title("Other Site Settings")
        .icon(CogIcon)
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SITE_SETTINGS_ID)
            .title("Other Site Settings")
        ),
    ]);
