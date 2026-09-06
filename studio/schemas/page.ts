import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines (55-60 characters recommended)',
      validation: Rule => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description:
        'Description for search engines (150-160 characters recommended)',
      validation: Rule => Rule.max(2000),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
        }),
        defineField({
          name: 'ctaLink',
          title: 'CTA Button Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'contentSections',
      title: 'Page Content Sections',
      type: 'array',
      description: 'Add multiple content sections for better layout control',
      of: [
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title (Internal)',
              type: 'string',
              description:
                'Optional title for organizing sections in Studio (not displayed on site)',
            },
            {
              name: 'content',
              title: 'Section Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H2', value: 'h2' },
                    { title: 'H3', value: 'h3' },
                    { title: 'H4', value: 'h4' },
                    { title: 'Quote', value: 'blockquote' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Strong', value: 'strong' },
                      { title: 'Emphasis', value: 'em' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'Url',
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alt text',
                      description: 'Alternative text for accessibility',
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                      description: 'Optional image caption',
                    },
                    {
                      name: 'displayOptions',
                      type: 'object',
                      title: 'Display Options',
                      fields: [
                        {
                          name: 'size',
                          type: 'string',
                          title: 'Image Size',
                          options: {
                            list: [
                              { title: 'Small', value: 'small' },
                              { title: 'Medium', value: 'medium' },
                              { title: 'Large', value: 'large' },
                            ],
                          },
                          initialValue: 'medium',
                        },
                        {
                          name: 'aspectRatio',
                          type: 'string',
                          title: 'Aspect Ratio',
                          options: {
                            list: [
                              {
                                title: 'Original (No Crop)',
                                value: 'original',
                              },
                              { title: 'Square (1:1)', value: 'square' },
                              { title: 'Landscape (4:3)', value: 'landscape' },
                              { title: 'Wide (16:9)', value: 'wide' },
                              { title: 'Portrait (3:4)', value: 'portrait' },
                              { title: 'Tall (9:16)', value: 'tall' },
                            ],
                          },
                          initialValue: 'original',
                        },
                        {
                          name: 'cropMode',
                          type: 'string',
                          title: 'Cropping',
                          description:
                            'How to handle cropping when aspect ratio is applied',
                          options: {
                            list: [
                              {
                                title: 'Smart Crop (Recommended)',
                                value: 'crop',
                              },
                              { title: 'Fit (May add padding)', value: 'fit' },
                              { title: 'Fill & Crop', value: 'fill' },
                            ],
                          },
                          initialValue: 'crop',
                          hidden: ({ parent }) =>
                            parent?.aspectRatio === 'original',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'object',
                  name: 'horizontalRule',
                  title: 'Horizontal Rule',
                  fields: [
                    {
                      name: 'style',
                      title: 'Style',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Standard', value: 'standard' },
                          { title: 'Thick', value: 'thick' },
                          { title: 'Dotted', value: 'dotted' },
                        ],
                      },
                      initialValue: 'standard',
                    },
                  ],
                  preview: {
                    prepare() {
                      return {
                        title: 'Horizontal Rule',
                        subtitle: '—————————————————————',
                      };
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              content: 'content',
            },
            prepare(selection) {
              const { title, content } = selection;
              const blockCount = content?.length || 0;
              return {
                title: title || `Content Section`,
                subtitle: `${blockCount} content blocks`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      published: 'published',
    },
    prepare(selection) {
      const { title, slug, published } = selection;
      return {
        title: title,
        subtitle: `/${slug}${published ? '' : ' (Draft)'}`,
      };
    },
  },
});
