import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'hometown-handyman',
  title: 'Hometown Handyman LLC',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('Pages')
              .schemaType('page')
              .child(S.documentTypeList('page').title('Pages')),
            S.listItem()
              .title('Services')
              .schemaType('service')
              .child(S.documentTypeList('service').title('Services')),
            S.listItem()
              .title('Neighborhoods')
              .schemaType('neighborhood')
              .child(S.documentTypeList('neighborhood').title('Neighborhoods')),
            S.divider(),
            S.listItem()
              .title('Gallery')
              .schemaType('galleryImage')
              .child(
                S.documentTypeList('galleryImage').title('Gallery Images')
              ),
            S.listItem()
              .title('FAQs')
              .schemaType('faq')
              .child(S.documentTypeList('faq').title('FAQs')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
