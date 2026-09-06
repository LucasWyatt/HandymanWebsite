import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'customerInitials',
      title: 'Customer Initials',
      type: 'string',
      description:
        'For privacy (e.g., "J.S.") - will be used if full name not desired',
      validation: Rule => Rule.max(10),
    }),
    defineField({
      name: 'useInitialsOnly',
      title: 'Use Initials Only',
      type: 'boolean',
      description: 'Display initials instead of full name for privacy',
      initialValue: false,
    }),
    defineField({
      name: 'review',
      title: 'Review Text',
      type: 'text',
      validation: Rule => Rule.required().min(20).max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5 stars)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'service',
      title: 'Service Provided',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'The service this testimonial is about',
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighborhood',
      type: 'reference',
      to: [{ type: 'neighborhood' }],
      description: 'Where the service was provided',
    }),
    defineField({
      name: 'projectValue',
      title: 'Project Value Range',
      type: 'string',
      options: {
        list: [
          { title: 'Under $500', value: 'under-500' },
          { title: '$500 - $1,000', value: '500-1000' },
          { title: '$1,000 - $2,500', value: '1000-2500' },
          { title: '$2,500 - $5,000', value: '2500-5000' },
          { title: 'Over $5,000', value: 'over-5000' },
        ],
      },
    }),
    defineField({
      name: 'projectDate',
      title: 'Project Completion Date',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Review Source',
      type: 'string',
      options: {
        list: [
          { title: 'Google Reviews', value: 'google' },
          { title: 'Direct Customer Feedback', value: 'direct' },
          { title: 'Nextdoor', value: 'nextdoor' },
          { title: 'Referral', value: 'referral' },
          { title: 'Email Follow-up', value: 'email' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Link to original review (if applicable)',
    }),
    defineField({
      name: 'verified',
      title: 'Verified Review',
      type: 'boolean',
      description: 'Has this review been verified as authentic?',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      description: 'Show in prominent testimonial sections',
      initialValue: false,
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Include in homepage testimonials carousel',
      initialValue: false,
    }),
    defineField({
      name: 'showOnServicePage',
      title: 'Show on Service Page',
      type: 'boolean',
      description: 'Display on related service page',
      initialValue: true,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Tags for categorization (quality, speed, professionalism, etc.)',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Key aspects mentioned in review (punctuality, cleanliness, quality, etc.)',
      validation: Rule => Rule.max(5),
    }),
    defineField({
      name: 'customerPhoto',
      title: 'Customer Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional customer photo (with permission)',
    }),
    defineField({
      name: 'permissionGranted',
      title: 'Publication Permission Granted',
      type: 'boolean',
      description: 'Customer has given permission to use this review',
      validation: Rule => Rule.required(),
      initialValue: false,
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      description:
        'Private notes about this testimonial (not displayed publicly)',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order for displaying testimonials (lower numbers first)',
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
      title: 'Featured & Rating',
      name: 'featuredAndRating',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'rating', direction: 'desc' },
        { field: 'projectDate', direction: 'desc' },
      ],
    },
    {
      title: 'Project Date (Newest)',
      name: 'projectDateDesc',
      by: [{ field: 'projectDate', direction: 'desc' }],
    },
    {
      title: 'Rating (Highest)',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Service & Date',
      name: 'serviceAndDate',
      by: [
        { field: 'service', direction: 'asc' },
        { field: 'projectDate', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      customerName: 'customerName',
      customerInitials: 'customerInitials',
      useInitialsOnly: 'useInitialsOnly',
      review: 'review',
      rating: 'rating',
      service: 'service.title',
      neighborhood: 'neighborhood.name',
      featured: 'featured',
      showOnHomepage: 'showOnHomepage',
      verified: 'verified',
      published: 'published',
    },
    prepare(selection) {
      const {
        customerName,
        customerInitials,
        useInitialsOnly,
        review,
        rating,
        service,
        neighborhood,
        featured,
        showOnHomepage,
        verified,
        published,
      } = selection;

      const displayName =
        useInitialsOnly && customerInitials
          ? customerInitials
          : customerName || 'Anonymous';

      const badges = [];
      if (featured) badges.push('⭐');
      if (showOnHomepage) badges.push('🏠');
      if (verified) badges.push('✓');
      if (!published) badges.push('(Draft)');

      const badgeText = badges.length > 0 ? ` ${badges.join(' ')}` : '';
      const stars = '★'.repeat(rating || 0);
      const serviceText = service ? ` • ${service}` : '';
      const locationText = neighborhood ? ` • ${neighborhood}` : '';

      return {
        title: `${stars} ${displayName}${badgeText}`,
        subtitle: `${review?.substring(0, 60)}...${serviceText}${locationText}`,
      };
    },
  },
});
