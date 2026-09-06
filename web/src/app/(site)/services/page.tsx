import { MainLayout } from '@/components/templates/MainLayout';
import { client, urlFor } from '@/lib/sanity';
import { SERVICES_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import Link from 'next/link';
import Image from 'next/image';
import type { Service, SiteSettings } from '../../../../sanity.types';

async function getServicesData() {
  const [services, siteSettings] = await Promise.all([
    client.fetch<Service[]>(
      SERVICES_QUERY,
      {},
      { next: { tags: ['services'], revalidate: 60 } }
    ),
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
  ]);

  return { services, siteSettings };
}

export async function generateMetadata() {
  const { siteSettings } = await getServicesData();
  return genMetadata(
    {
      title: 'Our Services - Hometown Handyman',
      description:
        'Professional home repair and handyman services including door installation, drywall repair, fixture installation, and more.',
    },
    siteSettings,
    '/services'
  );
}

export default async function ServicesPage() {
  const { services } = await getServicesData();

  return (
    <MainLayout>
      <div className="container-site py-16">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: Service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
              >
                {service.featuredImage && (
                  <div className="aspect-video relative">
                    <Image
                      src={urlFor(service.featuredImage)
                        .width(400)
                        .height(300)
                        .url()}
                      alt={service.title || 'Service'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    {service.shortDescription}
                  </p>

                  <div className="flex justify-end items-center">
                    <Link
                      href={`/services/${service.slug?.current || ''}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">
              No services found in Sanity CMS.
            </p>
            <p className="text-sm text-neutral-500">
              Add some services in your Sanity Studio to see them here!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
