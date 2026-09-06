import { defineCliConfig } from 'sanity/cli';

// The Sanity CLI reads this file - not sanity.config.ts - for the project
// identifier. Without it, `sanity deploy`, `dataset import`, and `dataset
// export` all fail with "does not contain a project identifier".
//
// Set SANITY_STUDIO_PROJECT_ID in studio/.env (see SETUP.md).
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
