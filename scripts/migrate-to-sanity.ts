/**
 * Migration Script: Content Collections → Sanity
 *
 * This script reads your existing markdown content and uploads it to Sanity,
 * including all images.
 *
 * Collections migrated:
 * - team/ → teamMember
 * - posts/ → post
 * - gallery/ → gallery
 * - store/ → product
 * - legal/ → legalPage
 *
 * Usage:
 *   cd scripts
 *   SANITY_WRITE_TOKEN=your-token npx tsx migrate-to-sanity.ts
 *
 * The script automatically reads SANITY_PROJECT_ID from apps/web/.env
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { config } from "dotenv";

// Load environment variables from apps/web/.env
const webEnvPath = path.join(__dirname, "../apps/web/.env");
if (fs.existsSync(webEnvPath)) {
  config({ path: webEnvPath });
}

// Sanity client configuration
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";

if (!projectId) {
  console.error("\n❌ Error: SANITY_PROJECT_ID is missing.");
  console.log("\nMake sure apps/web/.env exists with:");
  console.log("  SANITY_PROJECT_ID=your-project-id");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const WEB_PATH = path.join(__dirname, "../apps/web/src");
const CONTENT_PATH = path.join(WEB_PATH, "content");
const IMAGES_PATH = path.join(WEB_PATH, "images");

// Track uploaded images to avoid duplicates
const uploadedImages: Map<string, string> = new Map();

// =============================================================================
// HELPERS
// =============================================================================

function readMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content: body } = matter(content);
    const slug = path.basename(file, ".md");
    return { slug, frontmatter: data, body };
  });
}

async function uploadImage(imagePath: string, altText: string = "") {
  // Convert /src/images/... path to actual file path
  const relativePath = imagePath.replace(/^\/src\/images\//, "");
  const fullPath = path.join(IMAGES_PATH, relativePath);

  // Check if already uploaded
  if (uploadedImages.has(fullPath)) {
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: uploadedImages.get(fullPath),
      },
      alt: altText,
    };
  }

  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload("image", imageBuffer, {
      filename: path.basename(fullPath),
    });

    // Cache the uploaded image ID
    uploadedImages.set(fullPath, asset._id);

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: altText,
    };
  } catch (error) {
    console.error(`  ✗ Failed to upload image: ${fullPath}`, error);
    return null;
  }
}

async function uploadImageArray(images: Array<{ url: string; alt: string }> | undefined) {
  if (!images || images.length === 0) return [];

  const uploadedArray = [];
  for (const img of images) {
    const uploaded = await uploadImage(img.url, img.alt);
    if (uploaded) {
      uploadedArray.push(uploaded);
    }
  }
  return uploadedArray;
}

function markdownToPortableText(markdown: string) {
  const blocks: any[] = [];
  const lines = markdown.split("\n");
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join("\n").trim();
      if (text) {
        blocks.push({
          _type: "block",
          _key: Math.random().toString(36).substr(2, 9),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: Math.random().toString(36).substr(2, 9),
              text: text,
              marks: [],
            },
          ],
        });
      }
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).substr(2, 9),
        style: "h1",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).substr(2, 9),
            text: line.replace(/^# /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).substr(2, 9),
        style: "h2",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).substr(2, 9),
            text: line.replace(/^## /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).substr(2, 9),
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).substr(2, 9),
            text: line.replace(/^### /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("#### ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).substr(2, 9),
        style: "h4",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).substr(2, 9),
            text: line.replace(/^#### /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.trim() === "") {
      flushParagraph();
    } else if (line.startsWith("---")) {
      // Skip horizontal rules
      flushParagraph();
    } else if (!line.startsWith("![") && !line.startsWith("|")) {
      // Skip images and tables, add to paragraph
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  return blocks;
}

// =============================================================================
// TEAM MIGRATION
// =============================================================================

async function migrateTeam() {
  console.log("\n👥 Migrating Team Members...");
  const team = readMarkdownFiles(path.join(CONTENT_PATH, "team"));

  for (const member of team) {
    const { slug, frontmatter } = member;
    console.log(`  - ${frontmatter.name} (${slug})`);

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Create document
    const doc = {
      _type: "teamMember",
      _id: `team-${slug}`,
      name: frontmatter.name,
      slug: { _type: "slug", current: slug },
      role: frontmatter.role,
      bio: frontmatter.bio,
      image,
      socials: frontmatter.socials
        ? {
            twitter: frontmatter.socials.twitter !== "#_" ? frontmatter.socials.twitter : undefined,
            website: frontmatter.socials.website !== "#_" ? frontmatter.socials.website : undefined,
            linkedin: frontmatter.socials.linkedin !== "#_" ? frontmatter.socials.linkedin : undefined,
            email: frontmatter.socials.email !== "#_" ? frontmatter.socials.email : undefined,
          }
        : undefined,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.name}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.name}`, error);
    }
  }

  return team.length;
}

// =============================================================================
// POSTS MIGRATION
// =============================================================================

async function migratePosts() {
  console.log("\n📝 Migrating Posts...");
  const posts = readMarkdownFiles(path.join(CONTENT_PATH, "posts"));

  for (const post of posts) {
    const { slug, frontmatter, body } = post;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "post",
      _id: `post-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description,
      pubDate: new Date(frontmatter.pubDate).toISOString(),
      team: frontmatter.team,
      image,
      tags: frontmatter.tags || [],
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }

  return posts.length;
}

// =============================================================================
// GALLERY MIGRATION
// =============================================================================

async function migrateGallery() {
  console.log("\n🖼️ Migrating Gallery...");
  const gallery = readMarkdownFiles(path.join(CONTENT_PATH, "gallery"));

  for (const item of gallery) {
    const { slug, frontmatter } = item;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Upload thumbnail
    let thumbnail = null;
    if (frontmatter.thumbnail?.url) {
      thumbnail = await uploadImage(frontmatter.thumbnail.url, frontmatter.thumbnail.alt);
    }

    // Upload images array
    const images = await uploadImageArray(frontmatter.images);

    const doc = {
      _type: "gallery",
      _id: `gallery-${slug}`,
      category: frontmatter.category,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description,
      thumbnail,
      images: images.length > 0 ? images : undefined,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }

  return gallery.length;
}

// =============================================================================
// STORE/PRODUCTS MIGRATION
// =============================================================================

async function migrateStore() {
  console.log("\n🛒 Migrating Store Products...");
  const products = readMarkdownFiles(path.join(CONTENT_PATH, "store"));

  for (const product of products) {
    const { slug, frontmatter } = product;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Upload main image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Upload images array
    const images = await uploadImageArray(frontmatter.images);

    const doc = {
      _type: "product",
      _id: `product-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      price: frontmatter.price,
      checkout: frontmatter.checkout,
      license: frontmatter.license,
      description: frontmatter.description,
      highlights: frontmatter.highlights || [],
      specifications: frontmatter.specifications,
      image,
      images: images.length > 0 ? images : [],
      faq: frontmatter.faq,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }

  return products.length;
}

// =============================================================================
// LEGAL PAGES MIGRATION
// =============================================================================

async function migrateLegal() {
  console.log("\n⚖️ Migrating Legal Pages...");
  const pages = readMarkdownFiles(path.join(CONTENT_PATH, "legal"));

  for (const page of pages) {
    const { slug, frontmatter, body } = page;
    console.log(`  - ${frontmatter.page} (${slug})`);

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "legalPage",
      _id: `legal-${slug}`,
      page: frontmatter.page,
      slug: { _type: "slug", current: slug },
      pubDate: frontmatter.pubDate
        ? new Date(frontmatter.pubDate).toISOString()
        : new Date().toISOString(),
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.page}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.page}`, error);
    }
  }

  return pages.length;
}

// =============================================================================
// SEED:ALL — DELETE EXISTING THEN SEED (one document per content type)
// =============================================================================

const SANITY_TYPES = ["post", "teamMember", "gallery", "product", "legalPage"] as const;
const BATCH_SIZE = 25;

function getIdsToCreate(): string[] {
  const ids: string[] = [];
  const dirs: { dir: string; prefix: string }[] = [
    { dir: path.join(CONTENT_PATH, "posts"), prefix: "post-" },
    { dir: path.join(CONTENT_PATH, "team"), prefix: "team-" },
    { dir: path.join(CONTENT_PATH, "gallery"), prefix: "gallery-" },
    { dir: path.join(CONTENT_PATH, "store"), prefix: "product-" },
    { dir: path.join(CONTENT_PATH, "legal"), prefix: "legal-" },
  ];
  for (const { dir, prefix } of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const slug = path.basename(file, ".md");
      ids.push(`${prefix}${slug}`);
    }
  }
  return ids;
}

async function deleteAllByType(type: string): Promise<number> {
  const ids = await client.fetch<string[]>(`*[_type == $type]._id`, { type });
  if (ids.length === 0) return 0;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();
    batch.forEach((id) => tx.delete(id));
    await tx.commit();
  }
  return ids.length;
}

async function deleteByIds(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();
    batch.forEach((id) => tx.delete(id));
    await tx.commit();
  }
}

async function seedAll(): Promise<void> {
  console.log("🧹 seed:all — Clearing existing documents, then seeding one per content type...\n");

  if (!process.env.SANITY_TOKEN && !process.env.SANITY_WRITE_TOKEN) {
    console.error("\n❌ Error: SANITY_TOKEN or SANITY_WRITE_TOKEN is required for seed:all.");
    process.exit(1);
  }

  try {
    for (const type of SANITY_TYPES) {
      const count = await deleteAllByType(type);
      if (count > 0) console.log(`  Deleted ${count} document(s) of type "${type}".`);
    }

    const idsToCreate = getIdsToCreate();
    if (idsToCreate.length > 0) {
      await deleteByIds(idsToCreate);
      console.log(`  Deleted ${idsToCreate.length} document id(s) that will be re-created (id-based cleanup).`);
    }

    console.log("\n  Waiting 3 seconds for Sanity to apply mutations...");
    await new Promise((r) => setTimeout(r, 3000));

    console.log("\n  Seeding documents from content...\n");
    await migrate();
  } catch (error) {
    console.error("\n❌ seed:all failed:", error);
    process.exit(1);
  }
}

// =============================================================================
// MAIN MIGRATION
// =============================================================================

async function migrate() {
  console.log("🚀 Starting migration to Sanity...\n");
  console.log("Project ID:", projectId);
  console.log("Dataset:", dataset);

  if (!process.env.SANITY_TOKEN && !process.env.SANITY_WRITE_TOKEN) {
    console.error("\n❌ Error: SANITY_TOKEN or SANITY_WRITE_TOKEN environment variable is required.");
    console.log("\nTo get a token:");
    console.log("1. Go to https://www.sanity.io/manage → Your Project → API");
    console.log("2. Create a new token with 'Editor' permissions");
    console.log("3. Run: SANITY_TOKEN=your-token npx tsx migrate-to-sanity.ts");
    process.exit(1);
  }

  try {
    // Migrate all collections
    const teamCount = await migrateTeam();
    const postCount = await migratePosts();
    const galleryCount = await migrateGallery();
    const productCount = await migrateStore();
    const legalCount = await migrateLegal();

    console.log("\n" + "=".repeat(50));
    console.log("✅ Migration complete!");
    console.log("=".repeat(50));
    console.log("\nMigration Summary:");
    console.log(`  - Team Members: ${teamCount}`);
    console.log(`  - Blog Posts: ${postCount}`);
    console.log(`  - Gallery Items: ${galleryCount}`);
    console.log(`  - Products: ${productCount}`);
    console.log(`  - Legal Pages: ${legalCount}`);
    console.log(`  - Total Documents: ${teamCount + postCount + galleryCount + productCount + legalCount}`);
    console.log(`  - Images Uploaded: ${uploadedImages.size}`);

    console.log("\nNext steps:");
    console.log("1. Open Sanity Studio: cd apps/studio && pnpm dev");
    console.log("2. View your content at http://localhost:3333");
    console.log("3. Enable Sanity mode: Set USE_SANITY=true in apps/web/.env");
    console.log("4. Run the site: pnpm dev:web");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

const isSeedAll = process.env.SEED_ALL === "1" || process.argv.includes("--seed-all");
if (isSeedAll) {
  seedAll();
} else {
  migrate();
}
