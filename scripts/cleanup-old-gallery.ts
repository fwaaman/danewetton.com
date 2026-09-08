/**
 * Cleanup script to remove old gallery items that don't match current content
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

const webEnvPath = path.join(__dirname, "../apps/web/.env");
if (fs.existsSync(webEnvPath)) {
  config({ path: webEnvPath });
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// Valid gallery slugs from content collections
const validGallerySlugs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

async function cleanup() {
  console.log("🧹 Cleaning up old gallery items...\n");

  // Get all gallery documents
  const allGallery = await client.fetch(`*[_type == "gallery"] { _id, title, "slug": slug.current }`);
  
  console.log(`Found ${allGallery.length} gallery items in Sanity`);

  for (const item of allGallery) {
    // Check if this is one of our migrated items (id starts with "gallery-")
    if (item._id.startsWith("gallery-") && validGallerySlugs.includes(item.slug)) {
      console.log(`  ✓ Keeping: ${item.title} (${item._id})`);
    } else {
      console.log(`  ✗ Deleting: ${item.title} (${item._id})`);
      try {
        await client.delete(item._id);
        console.log(`    Deleted successfully`);
      } catch (error) {
        console.error(`    Failed to delete:`, error);
      }
    }
  }

  console.log("\n✅ Cleanup complete!");
}

cleanup();
