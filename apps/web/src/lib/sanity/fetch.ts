import { client, isSanityConfigured, previewClient } from "./client";

interface FetchOptions {
  preview?: boolean;
}

/**
 * Fetch data from Sanity with proper caching for Astro.
 * When Sanity is not configured, returns an empty result so build succeeds.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: FetchOptions = {}
): Promise<T> {
  if (!isSanityConfigured) {
    return [] as T;
  }
  const { preview = false } = options;
  const sanityClient = preview ? previewClient : client;
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err) {
    if (
      err &&
      typeof err.message === "string" &&
      err.message.includes("Dataset not found")
    ) {
      return [] as T;
    }
    throw err;
  }
}
