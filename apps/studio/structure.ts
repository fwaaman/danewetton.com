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

      // Gallery
      S.listItem()
        .title("Gallery")
        .icon(ImagesIcon)
        .schemaType("gallery")
        .child(S.documentTypeList("gallery").title("Gallery")),

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

      // Site Settings (singleton)
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SITE_SETTINGS_ID)
            .title("Site Settings")
        ),
    ]);
