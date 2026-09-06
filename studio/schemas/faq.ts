import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
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
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H4', value: 'h4' },
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
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'Services', value: 'services' },
          { title: 'Scheduling', value: 'scheduling' },
          { title: 'Service Area', value: 'service-area' },
          { title: 'Insurance & Warranty', value: 'insurance-warranty' },
          { title: 'Materials & Permits', value: 'materials-permits' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for better searchability and filtering',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }],
        },
      ],
      description: 'Services this FAQ is most relevant to',
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'High (Top 5 FAQs)', value: 'high' },
          { title: 'Medium (Common questions)', value: 'medium' },
          { title: 'Low (Occasional questions)', value: 'low' },
        ],
      },
      initialValue: 'medium',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Include in homepage FAQ section',
      initialValue: false,
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When this FAQ was last reviewed/updated',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order for displaying FAQs (lower numbers first)',
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
      title: 'Priority & Sort Order',
      name: 'priorityAndSort',
      by: [
        { field: 'priority', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
    {
      title: 'Category & Sort Order',
      name: 'categoryAndSort',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
    {
      title: 'Last Updated',
      name: 'lastUpdated',
      by: [{ field: 'lastUpdated', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      priority: 'priority',
      showOnHomepage: 'showOnHomepage',
      published: 'published',
    },
    prepare(selection) {
      const { title, category, priority, showOnHomepage, published } =
        selection;
      const priorityEmoji: Record<string, string> = {
        high: '🔥',
        medium: '⭐',
        low: '📝',
      };

      return {
        title: `${priorityEmoji[priority as string] || '📝'} ${title}${showOnHomepage ? ' 🏠' : ''}${published ? '' : ' (Draft)'}`,
        subtitle: `${category?.charAt(0).toUpperCase() + category?.slice(1)} FAQ`,
      };
    },
  },
});
