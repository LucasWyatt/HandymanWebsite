import { MainLayout } from '@/components/templates/MainLayout';
import { RelatedServices } from '@/components/organisms/RelatedServices';
import { client, urlFor } from '@/lib/sanity';
import { SERVICE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Service, SiteSettings } from '../../../../../sanity.types';

// The GROQ query dereferences internalLinks, so the generated (raw reference)
// shape has to be omitted before re-declaring it.
interface ExtendedService extends Omit<Service, 'internalLinks'> {
  internalLinks?: Array<{
    anchorText: string;
    description?: string;
    service: Pick<Service, '_id' | 'title' | 'shortDescription' | 'slug'>;
  }>;
  secondaryImage?: Service['featuredImage'];
}

async function getService(slug: string) {
  const [service, siteSettings] = await Promise.all([
    client.fetch<ExtendedService>(
      SERVICE_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ['services'], revalidate: 60 } }
    ),
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
  ]);

  return { service, siteSettings };
}

export async function generateStaticParams() {
  const services = await client.fetch(
    `*[_type == "service" && defined(slug.current)] { "slug": slug.current }`,
    {},
    { next: { tags: ['services'] } }
  );

  return services.map((service: { slug: string }) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { service, siteSettings } = await getService(resolvedParams.slug);

  if (!service) return {};

  return genMetadata(
    {
      title: service.seoTitle || `${service.title} - Hometown Handyman`,
      description: service.seoDescription || service.shortDescription,
    },
    siteSettings,
    `/services/${resolvedParams.slug}`
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { service } = await getService(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container-site py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{service.title}</h1>

          {service.featuredImage && (
            <div className="mb-8">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={urlFor(service.featuredImage)
                    .width(800)
                    .height(450)
                    .url()}
                  alt={service.title || 'Service'}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-neutral-600 mb-6">
              {service.shortDescription}
            </p>

            {service.introduction && (
              <p className="text-lg text-neutral-700 mb-6">
                {service.introduction}
              </p>
            )}

            {service.typicalProblems && service.typicalProblems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Common Problems We Solve
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {service.typicalProblems.map(
                    (problem: string, index: number) => (
                      <li key={index} className="text-neutral-600">
                        {problem}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {service.secondaryImage && (
              <div className="mb-8">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(service.secondaryImage)
                      .width(800)
                      .height(450)
                      .url()}
                    alt={`${service.title} secondary image` || 'Service image'}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {service.ourApproach && service.ourApproach.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {service.ourApproach.map(
                    (approach: string, index: number) => (
                      <li key={index} className="text-neutral-600">
                        {approach}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {service.faqs && service.faqs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {service.faqs.map((faq: any, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-neutral-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {service.internalLinks && service.internalLinks.length > 0 && (
            <RelatedServices
              internalLinks={service.internalLinks}
              className="mb-8"
            />
          )}

          <div className="bg-neutral-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Get a Quote</h2>
            <p className="text-neutral-600 mb-4">
              Contact us for a personalized quote based on your specific needs.
            </p>

            <div className="mt-6">
              <Link
                href="/estimate"
                className="btn-primary inline-block px-6 py-3 rounded-lg"
              >
                Request Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
