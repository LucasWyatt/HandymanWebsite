import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
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
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description for service cards (2-3 sentences)',
      validation: Rule => Rule.required().max(300),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      description: 'Intro paragraph for service page (40-70 words)',
      validation: Rule => Rule.required().min(40).max(450),
    }),
    defineField({
      name: 'typicalProblems',
      title: 'Typical Problems',
      type: 'array',
      of: [{ type: 'string' }],
      description: '5-7 common problems this service addresses',
      validation: Rule => Rule.required().min(5).max(7),
    }),
    defineField({
      name: 'ourApproach',
      title: 'Our Approach',
      type: 'array',
      of: [{ type: 'string' }],
      description: '3-5 points about how we handle this service',
      validation: Rule => Rule.required().min(3).max(5),
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Image',
      type: 'image',
      description:
        'Additional image to display after the Typical Problems section',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'faqs',
      title: 'Service FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: Rule => Rule.required(),
            }),
          ],
        },
      ],
      description: '3-5 frequently asked questions specific to this service',
      validation: Rule => Rule.min(3).max(5),
    }),
    defineField({
      name: 'gallery',
      title: 'Before/After Gallery',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'galleryImage' }],
        },
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      fields: [
        defineField({
          name: 'hasFixedPricing',
          title: 'Has Fixed Pricing',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'fixedPrice',
          title: 'Fixed Price',
          type: 'number',
          description: 'Fixed price if applicable',
          hidden: ({ parent }) => !parent?.hasFixedPricing,
        }),
        defineField({
          name: 'priceRange',
          title: 'Price Range',
          type: 'object',
          fields: [
            defineField({
              name: 'min',
              title: 'Minimum Price',
              type: 'number',
            }),
            defineField({
              name: 'max',
              title: 'Maximum Price',
              type: 'number',
            }),
          ],
          hidden: ({ parent }) => parent?.hasFixedPricing,
        }),
        defineField({
          name: 'pricingNotes',
          title: 'Pricing Notes',
          type: 'text',
          description: 'Additional pricing information or disclaimers',
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom SEO title (defaults to service title)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'SEO description for this service page',
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      description: 'Show on homepage featured services section',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order for displaying services (lower numbers first)',
      initialValue: 100,
    }),
    defineField({
      name: 'internalLinks',
      title: 'Related Services',
      type: 'array',
      description: 'Link to related services with custom SEO anchor text',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'service',
              title: 'Related Service',
              type: 'reference',
              to: [{ type: 'service' }],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'anchorText',
              title: 'SEO Anchor Text',
              type: 'string',
              description:
                'Keyword-rich text for the link (e.g., "professional bathroom tile repair")',
              validation: Rule => Rule.required().min(10).max(100),
            }),
            defineField({
              name: 'description',
              title: 'Relationship Description',
              type: 'text',
              description:
                'Optional: Brief explanation of how this service relates',
              validation: Rule => Rule.max(200),
            }),
          ],
          preview: {
            select: {
              title: 'anchorText',
              subtitle: 'service.title',
              description: 'description',
            },
            prepare(selection) {
              const { title, subtitle, description } = selection;
              return {
                title: title || 'No anchor text',
                subtitle: `→ ${subtitle || 'No service selected'}`,
                description: description || '',
              };
            },
          },
        },
      ],
      validation: Rule => Rule.max(6),
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
      subtitle: 'shortDescription',
      media: 'featuredImage',
      featured: 'featured',
      published: 'published',
    },
    prepare(selection) {
      const { title, subtitle, media, featured, published } = selection;
      return {
        title: `${featured ? '⭐ ' : ''}${title}${published ? '' : ' (Draft)'}`,
        subtitle: subtitle,
        media: media,
      };
    },
  },
});
