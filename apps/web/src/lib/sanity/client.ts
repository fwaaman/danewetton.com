import { createClient } from "@sanity/client";

// The project ID is public configuration; environment variables can override it.
const projectId =
  import.meta.env.SANITY_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  "c0y5atfc";

export const client = createClient({
  projectId,
  dataset: import.meta.env.SANITY_DATASET || "production",
  apiVersion: import.meta.env.SANITY_API_VERSION || "2026-09-08",
  useCdn: import.meta.env.PROD,
  token: import.meta.env.SANITY_READ_TOKEN,
});

export const previewClient = createClient({
  projectId,
  dataset: import.meta.env.SANITY_DATASET || "production",
  apiVersion: import.meta.env.SANITY_API_VERSION || "2026-09-08",
  useCdn: false,
  token: import.meta.env.SANITY_READ_TOKEN,
});

export const isSanityConfigured = Boolean(projectId);
