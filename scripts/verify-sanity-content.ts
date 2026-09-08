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

async function verify() {
  console.log("📊 Sanity Content Verification\n");

  const counts = await client.fetch(`{
    "posts": count(*[_type == "post"]),
    "team": count(*[_type == "teamMember"]),
    "gallery": count(*[_type == "gallery"]),
    "products": count(*[_type == "product"]),
    "legal": count(*[_type == "legalPage"])
  }`);

  console.log("Document counts:");
  console.log(`  Posts: ${counts.posts} (expected: 10)`);
  console.log(`  Team: ${counts.team} (expected: 10)`);
  console.log(`  Gallery: ${counts.gallery} (expected: 10)`);
  console.log(`  Products: ${counts.products} (expected: 6)`);
  console.log(`  Legal: ${counts.legal} (expected: 2)`);
  
  const allMatch = counts.posts === 10 && counts.team === 10 && counts.gallery === 10 && counts.products === 6 && counts.legal === 2;
  console.log(`\n${allMatch ? "✅ All counts match!" : "❌ Counts do not match expected values"}`);
}

verify();
