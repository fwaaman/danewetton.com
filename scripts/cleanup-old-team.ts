/**
 * Cleanup script to remove old team members that don't match current content
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

// Valid team member slugs from content collections
const validTeamSlugs = [
  "david-lee",
  "emma-carter", 
  "isaac-turner",
  "jordan-wells",
  "juliet-ramos",
  "leila-fernandez",
  "marco-bianchi",
  "maya-lombardi",
  "oliver-grant",
  "samuel-ortiz"
];

async function cleanup() {
  console.log("🧹 Cleaning up old team members...\n");

  // Get all team member documents
  const allTeam = await client.fetch(`*[_type == "teamMember"] { _id, name, "slug": slug.current }`);
  
  console.log(`Found ${allTeam.length} team members in Sanity`);

  for (const member of allTeam) {
    // Check if this is one of our migrated items
    if (member._id.startsWith("team-") && validTeamSlugs.includes(member.slug)) {
      console.log(`  ✓ Keeping: ${member.name} (${member._id})`);
    } else {
      console.log(`  ✗ Deleting: ${member.name} (${member._id})`);
      try {
        await client.delete(member._id);
        console.log(`    Deleted successfully`);
      } catch (error) {
        console.error(`    Failed to delete:`, error);
      }
    }
  }

  console.log("\n✅ Cleanup complete!");
}

cleanup();
