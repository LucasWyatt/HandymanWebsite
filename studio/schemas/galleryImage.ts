import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      description: 'Concise caption describing the work performed',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'service',
      title: 'Related Service',
      type: 'reference',
      to: [{type: 'service'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighborhood',
      type: 'reference',
      to: [{type: 'neighborhood'}],
      description: 'Where this project was completed',
    }),
    defineField({
      name: 'projectDetails',
      title: 'Project Details',
      type: 'object',
      fields: [
        defineField({
          name: 'duration',
          title: 'Project Duration',
          type: 'string',
          description: 'How long the project took (e.g., "2 hours", "Half day")',
        }),
        defineField({
          name: 'materials',
          title: 'Materials Used',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Key materials or products used',
        }),
        defineField({
          name: 'challenges',
          title: 'Challenges Overcome',
          type: 'text',
          description: 'Any special challenges or techniques used',
        }),
        defineField({
          name: 'customerSatisfaction',
          title: 'Customer Satisfaction',
          type: 'number',
          description: 'Customer rating (1-5 stars)',
          validation: (Rule) => Rule.min(1).max(5),
        }),
      ],
    }),
    defineField({
      name: 'technicalDetails',
      title: 'Technical Details',
      type: 'object',
      fields: [
        defineField({
          name: 'workPerformed',
          title: 'Work Performed',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Specific tasks completed',
        }),
        defineField({
          name: 'tools',
          title: 'Tools Used',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Specialized tools or equipment used',
        }),
        defineField({
          name: 'warranty',
          title: 'Warranty Information',
          type: 'string',
          description: 'Warranty provided for this work',
        }),
      ],
    }),
    defineField({
      name: 'seoAlt',
      title: 'SEO Alt Text',
      type: 'string',
      description: 'Alt text for SEO and accessibility',
      validation: (Rule) => Rule.max(125),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show in featured gallery sections',
      initialValue: false,
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Include in homepage gallery carousel',
      initialValue: false,
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion Date',
      type: 'date',
      description: 'When the project was completed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tags for better searchability and filtering',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order for displaying images (lower numbers first)',
      initialValue: 100,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Completion Date (Newest)',
      name: 'completionDateDesc',
      by: [{field: 'completionDate', direction: 'desc'}],
    },
    {
      title: 'Featured & Sort Order',
      name: 'featuredAndSort',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
    {
      title: 'Service & Date',
      name: 'serviceAndDate',
      by: [
        {field: 'service', direction: 'asc'},
        {field: 'completionDate', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      service: 'service.title',
      neighborhood: 'neighborhood.name',
      media: 'afterImage',
      featured: 'featured',
      showOnHomepage: 'showOnHomepage',
      published: 'published',
    },
    prepare(selection) {
      const {title, service, neighborhood, media, featured, showOnHomepage, published} = selection
      const badges = []
      if (featured) badges.push('⭐')
      if (showOnHomepage) badges.push('🏠')
      if (!published) badges.push('(Draft)')
      
      const badgeText = badges.length > 0 ? ` ${badges.join(' ')}` : ''
      const locationText = neighborhood ? ` • ${neighborhood}` : ''
      
      return {
        title: `${title}${badgeText}`,
        subtitle: `${service || 'No service'}${locationText}`,
        media: media,
      }
    },
  },
})