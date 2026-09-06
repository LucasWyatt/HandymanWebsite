import { MainLayout } from '@/components/templates/MainLayout';
import { ServiceAreaMap } from '@/components/organisms/ServiceAreaMap';
import { client } from '@/lib/sanity';
import { NEIGHBORHOODS_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import type { Neighborhood, SiteSettings } from '../../../../sanity.types';

async function getServiceAreaData() {
  const [neighborhoods, siteSettings] = await Promise.all([
    client.fetch<Neighborhood[]>(
      NEIGHBORHOODS_QUERY,
      {},
      { next: { tags: ['neighborhoods'], revalidate: 60 } }
    ),
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
  ]);

  return { neighborhoods, siteSettings };
}

export async function generateMetadata() {
  const { siteSettings } = await getServiceAreaData();
  return genMetadata(
    {
      title: 'Service Area - Hometown Handyman',
      description:
        'We serve East Cincinnati neighborhoods including Hyde Park, Indian Hill, Terrace Park and surrounding areas.',
    },
    siteSettings,
    '/service-area'
  );
}

export default async function ServiceAreaPage() {
  const { neighborhoods } = await getServiceAreaData();

  return (
    <MainLayout>
      <div className="container-site py-16">
        <h1 className="text-4xl font-bold mb-8">Our Service Area</h1>

        <div className="mb-12">
          <p className="text-lg text-neutral-600 mb-6">
            We proudly serve East Cincinnati neighborhoods and surrounding
            areas. Our focus on local communities allows us to provide
            personalized service and maintain our reputation for quality work.
          </p>
        </div>

        <ServiceAreaMap neighborhoods={neighborhoods} />

        {neighborhoods.length > 0 ? (
          <div className="space-y-8">
            {/* Primary Areas */}
            {neighborhoods.filter((n: Neighborhood) => n.priority === 'primary')
              .length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  🌟 Primary Service Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {neighborhoods
                    .filter((n: Neighborhood) => n.priority === 'primary')
                    .map((neighborhood: Neighborhood) => (
                      <div
                        key={neighborhood._id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-blue-200"
                      >
                        <h3 className="text-xl font-semibold mb-3">
                          {neighborhood.name}
                        </h3>
                        {neighborhood.description && (
                          <p className="text-neutral-600 mb-3">
                            {neighborhood.description}
                          </p>
                        )}
                        <div className="text-sm text-neutral-500 space-y-1">
                          <p>
                            <strong>ZIP Codes:</strong>{' '}
                            {(neighborhood.zipCodes || []).join(', ')}
                          </p>
                          {neighborhood.averageResponseTime && (
                            <p>
                              <strong>Response Time:</strong>{' '}
                              {neighborhood.averageResponseTime}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Secondary Areas */}
            {neighborhoods.filter(
              (n: Neighborhood) => n.priority === 'secondary'
            ).length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  ⭐ Secondary Service Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {neighborhoods
                    .filter((n: Neighborhood) => n.priority === 'secondary')
                    .map((neighborhood: Neighborhood) => (
                      <div
                        key={neighborhood._id}
                        className="bg-white p-6 rounded-lg shadow-sm border"
                      >
                        <h3 className="text-xl font-semibold mb-3">
                          {neighborhood.name}
                        </h3>
                        {neighborhood.description && (
                          <p className="text-neutral-600 mb-3">
                            {neighborhood.description}
                          </p>
                        )}
                        <div className="text-sm text-neutral-500 space-y-1">
                          <p>
                            <strong>ZIP Codes:</strong>{' '}
                            {(neighborhood.zipCodes || []).join(', ')}
                          </p>
                          {neighborhood.averageResponseTime && (
                            <p>
                              <strong>Response Time:</strong>{' '}
                              {neighborhood.averageResponseTime}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Extended Areas */}
            {neighborhoods.filter(
              (n: Neighborhood) => n.priority === 'extended'
            ).length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  📍 Extended Service Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {neighborhoods
                    .filter((n: Neighborhood) => n.priority === 'extended')
                    .map((neighborhood: Neighborhood) => (
                      <div
                        key={neighborhood._id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200"
                      >
                        <h3 className="text-xl font-semibold mb-3">
                          {neighborhood.name}
                        </h3>
                        {neighborhood.description && (
                          <p className="text-neutral-600 mb-3">
                            {neighborhood.description}
                          </p>
                        )}
                        <div className="text-sm text-neutral-500 space-y-1">
                          <p>
                            <strong>ZIP Codes:</strong>{' '}
                            {(neighborhood.zipCodes || []).join(', ')}
                          </p>
                          {neighborhood.averageResponseTime && (
                            <p>
                              <strong>Response Time:</strong>{' '}
                              {neighborhood.averageResponseTime}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Hyde Park</h2>
              <p className="text-neutral-600">
                Historic neighborhood with beautiful homes requiring expert
                craftsmanship.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Indian Hill</h2>
              <p className="text-neutral-600">
                Upscale community where quality and attention to detail matter
                most.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Terrace Park</h2>
              <p className="text-neutral-600">
                Charming village homes that deserve careful, professional
                maintenance.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 bg-neutral-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Not Sure If We Serve Your Area?
          </h2>
          <p className="text-neutral-600 mb-6">
            Contact us to discuss your project. We&apos;re always happy to help
            East Cincinnati homeowners.
          </p>
          <a
            href="tel:+15555550100"
            className="btn-primary inline-block px-6 py-3 rounded-lg"
          >
            Call (555) 555-0100
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
