import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Hometown Handyman LLC',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'Default meta description for the site',
      initialValue:
        'Premium home repair, installations, and light remodeling. Serving Hyde Park, Indian Hill, Terrace Park and nearby. Call (555) 555-0100.',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          initialValue: '(555) 555-0100',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          initialValue: 'hello@example.com',
          validation: Rule => Rule.required().email(),
        }),
        defineField({
          name: 'estimatesEmail',
          title: 'Estimates Email',
          type: 'string',
          initialValue: 'estimates@example.com',
          validation: Rule => Rule.required().email(),
        }),
        defineField({
          name: 'address',
          title: 'Business Address',
          type: 'object',
          fields: [
            defineField({
              name: 'street',
              title: 'Street Address',
              type: 'string',
              initialValue: '123 Main Street',
            }),
            defineField({
              name: 'city',
              title: 'City',
              type: 'string',
              initialValue: 'Cincinnati',
            }),
            defineField({
              name: 'state',
              title: 'State',
              type: 'string',
              initialValue: 'OH',
            }),
            defineField({
              name: 'zipCode',
              title: 'ZIP Code',
              type: 'string',
              initialValue: '12345',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'object',
      fields: [
        defineField({
          name: 'weekdays',
          title: 'Weekdays (Mon-Fri)',
          type: 'string',
          initialValue: '8:00 AM - 5:00 PM',
        }),
        defineField({
          name: 'saturday',
          title: 'Saturday',
          type: 'string',
          initialValue: 'By appointment',
        }),
        defineField({
          name: 'sunday',
          title: 'Sunday',
          type: 'string',
          initialValue: 'Closed',
        }),
        defineField({
          name: 'emergencyAvailable',
          title: 'Emergency Services Available',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'trustChips',
      title: 'Trust Chips',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Trust signals displayed on homepage',
      initialValue: [
        'Insured',
        'Cincinnati Contractor Registered',
        '1-Year Labor Warranty',
        'Local phone number',
      ],
    }),
    defineField({
      name: 'homePageSettings',
      title: 'Homepage Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'heroHeadline',
          title: 'Hero Headline',
          type: 'string',
          initialValue: 'Your Home, Our Expertise',
        }),
        defineField({
          name: 'heroSubheadline',
          title: 'Hero Subheadline',
          type: 'text',
          initialValue:
            'Precision repairs, clean workspaces, on-time arrivals. Doors, trim, drywall, fixtures, tile/caulk, deck and fence repair, and light remodeling for East Side homes.',
        }),
        defineField({
          name: 'heroBackgroundImage',
          title: 'Hero Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'featuredServicesCount',
          title: 'Featured Services Count',
          type: 'number',
          description: 'Number of services to show on homepage',
          initialValue: 3,
          validation: Rule => Rule.min(1).max(6),
        }),
      ],
    }),
    defineField({
      name: 'seoSettings',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'defaultTitle',
          title: 'Default Page Title',
          type: 'string',
          initialValue:
            'Hometown Handyman LLC | Home Repair & Handyman in East Cincinnati',
        }),
        defineField({
          name: 'titleSuffix',
          title: 'Title Suffix',
          type: 'string',
          description: 'Appended to page titles',
          initialValue: ' | Hometown Handyman LLC',
        }),
        defineField({
          name: 'ogImage',
          title: 'Default Open Graph Image',
          type: 'image',
          description: 'Default image for social media sharing',
        }),
      ],
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'object',
      fields: [
        defineField({
          name: 'primaryAreas',
          title: 'Primary Service Areas',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: ['Hyde Park', 'Indian Hill', 'Terrace Park'],
        }),
        defineField({
          name: 'secondaryAreas',
          title: 'Secondary Service Areas',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: [
            'Mount Lookout',
            'Oakley',
            'Columbia-Tusculum',
            'Mariemont',
            'Madeira',
            'Mount Adams',
            'Walnut Hills',
          ],
        }),
        defineField({
          name: 'notServedNote',
          title: 'Areas Not Served Note',
          type: 'string',
          initialValue:
            'We do not currently serve West Cincinnati neighborhoods',
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({
          name: 'googleBusinessProfile',
          title: 'Google Business Profile URL',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
        defineField({
          name: 'nextdoor',
          title: 'Nextdoor Profile URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'legalSettings',
      title: 'Legal Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'licenseNumber',
          title: 'Contractor License Number',
          type: 'string',
        }),
        defineField({
          name: 'insuranceInfo',
          title: 'Insurance Information',
          type: 'object',
          fields: [
            defineField({
              name: 'carrier',
              title: 'Insurance Carrier',
              type: 'string',
            }),
            defineField({
              name: 'policyNumber',
              title: 'Policy Number',
              type: 'string',
            }),
            defineField({
              name: 'coverage',
              title: 'Coverage Amount',
              type: 'string',
              initialValue: '$1M/$2M General Liability',
            }),
          ],
        }),
        defineField({
          name: 'warrantyTerms',
          title: 'Warranty Terms',
          type: 'text',
          initialValue: '1-Year Labor Warranty on all completed work',
        }),
      ],
    }),
    defineField({
      name: 'analyticsSettings',
      title: 'Analytics Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
        }),
        defineField({
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
        }),
        defineField({
          name: 'facebookPixelId',
          title: 'Facebook Pixel ID',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      };
    },
  },
});
