import { Metadata } from 'next';
import type { SiteSettings as GeneratedSiteSettings } from '../../sanity.types';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
}

export function generateMetadata(
  seo?: SEOData,
  siteSettings?: GeneratedSiteSettings,
  path?: string
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const title = seo?.title || siteSettings?.title || 'Hometown Handyman';
  const description =
    seo?.description ||
    siteSettings?.description ||
    'Premium home repair and handyman services for East Cincinnati neighborhoods';

  return {
    title,
    description,
    keywords: seo?.keywords,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path || ''}`,
      siteName: 'Hometown Handyman',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}${path || ''}`,
    },
  };
}

export function generateLocalBusinessLD(siteSettings: GeneratedSiteSettings) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}#organization`,
    name: 'Hometown Handyman',
    description: siteSettings?.description,
    url: baseUrl,
    telephone: siteSettings?.contactInfo?.phone,
    email: siteSettings?.contactInfo?.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings?.contactInfo?.address?.street,
      addressLocality: siteSettings?.contactInfo?.address?.city,
      addressRegion: siteSettings?.contactInfo?.address?.state,
      postalCode: siteSettings?.contactInfo?.address?.zipCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.1031,
      longitude: -84.512,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Cincinnati',
        containedInPlace: {
          '@type': 'State',
          name: 'Ohio',
        },
      },
    ],
    serviceType: [
      'Home Repair',
      'Handyman Services',
      'Door Installation',
      'Trim Carpentry',
      'Drywall Repair',
      'Paint Repair',
      'Fixture Installation',
      'Tile Repair',
      'Caulk Repair',
      'Deck Repair',
      'Fence Repair',
      'Bathroom Refresh',
    ],
    paymentAccepted: ['Cash', 'Check', 'Credit Card'],
  };
}

export function generateFAQPageLD(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
