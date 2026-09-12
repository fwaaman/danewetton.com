import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "danewetton",
  title: "Dane Wetton",

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || "c0y5atfc",
  dataset: import.meta.env.SANITY_STUDIO_DATASET || "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
