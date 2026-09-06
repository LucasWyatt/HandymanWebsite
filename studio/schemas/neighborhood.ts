import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'neighborhood',
  title: 'Neighborhood',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Neighborhood Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'zipCodes',
      title: 'ZIP Codes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'ZIP codes served in this neighborhood',
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'priority',
      title: 'Priority Level',
      type: 'string',
      options: {
        list: [
          {
            title: 'Primary (Hyde Park, Indian Hill, Terrace Park)',
            value: 'primary',
          },
          {
            title: 'Secondary (Mount Lookout, Oakley, etc.)',
            value: 'secondary',
          },
          { title: 'Extended Service Area', value: 'extended' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'Brief description of the neighborhood and our services there',
    }),
    defineField({
      name: 'averageResponseTime',
      title: 'Average Response Time',
      type: 'string',
      description:
        'Typical response time for this area (e.g., "Same day", "Next day")',
    }),
    defineField({
      name: 'serviceRadius',
      title: 'Service Radius (miles)',
      type: 'number',
      description: 'Distance from neighborhood center we typically serve',
      validation: Rule => Rule.positive(),
    }),
    defineField({
      name: 'landmarks',
      title: 'Notable Landmarks',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Well-known places or landmarks in this neighborhood',
    }),
    defineField({
      name: 'testimonials',
      title: 'Neighborhood Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'customerName',
              title: 'Customer Name',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'review',
              title: 'Review Text',
              type: 'text',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'rating',
              title: 'Rating (1-5 stars)',
              type: 'number',
              validation: Rule => Rule.required().min(1).max(5),
            }),
            defineField({
              name: 'serviceProvided',
              title: 'Service Provided',
              type: 'string',
              description: 'What service was performed',
            }),
            defineField({
              name: 'date',
              title: 'Review Date',
              type: 'date',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'specialNotes',
      title: 'Special Notes',
      type: 'text',
      description:
        'Any special considerations for this neighborhood (parking, access, etc.)',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
        }),
      ],
      description:
        'Geographic coordinates for mapping and distance calculations',
    }),
    defineField({
      name: 'active',
      title: 'Active Service Area',
      type: 'boolean',
      description: 'Whether we currently serve this neighborhood',
      initialValue: true,
    }),
    defineField({
      name: 'showInFooter',
      title: 'Show in Footer',
      type: 'boolean',
      description:
        'Display this neighborhood in the website footer service areas section',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order for displaying neighborhoods (lower numbers first)',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: 'Priority & Name',
      name: 'priorityAndName',
      by: [
        { field: 'priority', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      priority: 'priority',
      zipCodes: 'zipCodes',
      active: 'active',
    },
    prepare(selection) {
      const { title, priority, zipCodes, active } = selection;
      const priorityEmoji: Record<string, string> = {
        primary: '🌟',
        secondary: '⭐',
        extended: '📍',
      };
      const zipCodeText = zipCodes ? zipCodes.join(', ') : 'No ZIP codes';

      return {
        title: `${priorityEmoji[priority as string] || '📍'} ${title}${active ? '' : ' (Inactive)'}`,
        subtitle: `${(priority as string)?.charAt(0).toUpperCase() + (priority as string)?.slice(1)} • ${zipCodeText}`,
      };
    },
  },
});
