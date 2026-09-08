import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "c0y5atfc",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  studioHost: "lexington-starter",
});
