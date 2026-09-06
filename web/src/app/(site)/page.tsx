import { MainLayout } from '@/components/templates/MainLayout';
import { client, urlFor } from '@/lib/sanity';
import {
  SITE_SETTINGS_QUERY,
  SERVICES_QUERY,
  HOMEPAGE_TESTIMONIALS_QUERY,
  FAQS_QUERY,
} from '@/lib/queries';
import {
  generateMetadata as genMetadata,
  generateLocalBusinessLD,
} from '@/lib/metadata';
import Image from 'next/image';
import Link from 'next/link';
import { CallButton } from '@/components/atoms/CallButton';
import { EstimateButton } from '@/components/atoms/EstimateButton';
import type {
  Service,
  SiteSettings,
  Testimonial,
  Faq,
} from '../../../sanity.types';

async function getHomeData() {
  const [siteSettings, services, testimonials, faqs] = await Promise.all([
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
    client.fetch<Service[]>(
      SERVICES_QUERY,
      {},
      { next: { tags: ['services'], revalidate: 60 } }
    ),
    client.fetch<Testimonial[]>(
      HOMEPAGE_TESTIMONIALS_QUERY,
      {},
      { next: { tags: ['testimonials'], revalidate: 60 } }
    ),
    client.fetch<Faq[]>(
      `${FAQS_QUERY} | order(priority asc, sortOrder asc) [showOnHomepage == true][0...5]`,
      {},
      { next: { tags: ['faqs'], revalidate: 60 } }
    ),
  ]);

  const featuredCount =
    siteSettings?.homePageSettings?.featuredServicesCount || 3;
  return {
    siteSettings,
    services: services
      .filter((s: Service) => s.featured)
      .slice(0, featuredCount),
    testimonials,
    faqs,
  };
}

export async function generateMetadata() {
  const { siteSettings } = await getHomeData();
  return genMetadata(undefined, siteSettings, '/');
}

export default async function HomePage() {
  const { siteSettings, services, testimonials, faqs } = await getHomeData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateLocalBusinessLD(siteSettings)),
        }}
      />
      <MainLayout>
        <div className="relative bg-neutral-600 text-white py-20">
          {siteSettings?.homePageSettings?.heroBackgroundImage && (
            <div className="absolute inset-0">
              <Image
                src={urlFor(siteSettings.homePageSettings.heroBackgroundImage)
                  .width(1920)
                  .height(1080)
                  .url()}
                alt="Hometown Handyman"
                fill
                className="object-cover opacity-70"
                priority
              />
            </div>
          )}
          <div className="relative container-site text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {siteSettings?.homePageSettings?.heroHeadline ||
                siteSettings?.title ||
                'Your Home, Our Expertise'}
            </h1>
            <p className="text-xl mb-8 text-neutral-200 max-w-2xl mx-auto">
              {siteSettings?.homePageSettings?.heroSubheadline ||
                siteSettings?.description ||
                'Precision repairs, clean workspaces, on-time arrivals. Doors, trim, drywall, fixtures, tile/caulk, deck and fence repair, and light remodeling for East Side homes.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CallButton
                variant="secondary"
                size="lg"
                phoneNumber={siteSettings?.contactInfo?.phone || '+15555550100'}
              >
                Call {siteSettings?.contactInfo?.phone || '(555) 555-0100'}
              </CallButton>
              <EstimateButton variant="primary" size="lg" />
            </div>
          </div>
        </div>

        {/* Featured Services Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container-site">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.length > 0 ? (
                services.map(service => (
                  <div
                    key={service._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {service.featuredImage ? (
                      <div className="h-48 relative">
                        <Image
                          src={urlFor(service.featuredImage)
                            .width(400)
                            .height(300)
                            .url()}
                          alt={service.title || 'Service image'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-neutral-200 rounded-t-lg"></div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-neutral-600 mb-4">
                        {service.shortDescription}
                      </p>
                      <div className="flex justify-end">
                        <Link
                          href={`/services/${service.slug?.current || ''}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Learn More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
                    <h3 className="text-xl font-semibold mb-2">
                      Door & Trim Carpentry
                    </h3>
                    <p className="text-neutral-600">
                      Professional installation and repair of doors, trim, and
                      finish carpentry.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
                    <h3 className="text-xl font-semibold mb-2">
                      Drywall & Paint Repair
                    </h3>
                    <p className="text-neutral-600">
                      Expert drywall patching, texturing, and paint touch-ups
                      for seamless results.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
                    <h3 className="text-xl font-semibold mb-2">
                      Fixture Installations
                    </h3>
                    <p className="text-neutral-600">
                      Safe installation of lighting, plumbing fixtures, and home
                      accessories.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section className="py-16">
            <div className="container-site">
              <h2 className="text-3xl font-bold text-center mb-12">
                What Our Clients Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map(testimonial => {
                  const displayName =
                    testimonial.useInitialsOnly && testimonial.customerInitials
                      ? testimonial.customerInitials
                      : testimonial.customerName || 'Anonymous Customer';
                  const stars = '★'.repeat(testimonial.rating || 0);

                  return (
                    <div
                      key={testimonial._id}
                      className="bg-white p-6 rounded-lg shadow-sm border"
                    >
                      <div className="flex items-center mb-4">
                        {testimonial.customerPhoto && (
                          <div className="w-12 h-12 mr-4">
                            <Image
                              src={urlFor(testimonial.customerPhoto)
                                .width(48)
                                .height(48)
                                .url()}
                              alt={displayName || 'Customer'}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{displayName}</h3>
                          <div className="text-yellow-400 text-sm">{stars}</div>
                        </div>
                      </div>
                      <p className="text-neutral-600 mb-4 italic">
                        &ldquo;{testimonial.review}&rdquo;
                      </p>
                      <div className="text-sm text-neutral-500">
                        {testimonial.service &&
                          'title' in testimonial.service && (
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                              {String(testimonial.service.title)}
                            </span>
                          )}
                        {testimonial.neighborhood &&
                          'name' in testimonial.neighborhood && (
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                              {String(testimonial.neighborhood.name)}
                            </span>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Trust Chips Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container-site text-center">
            <h2 className="text-3xl font-bold mb-8">
              Why Choose Hometown Handyman?
            </h2>
            {siteSettings?.trustChips && siteSettings.trustChips.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {siteSettings.trustChips.map((chip, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  Insured
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  Licensed
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  1-Year Warranty
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  Local Phone Number
                </span>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container-site">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            {faqs.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map(faq => (
                  <div
                    key={faq._id}
                    className="bg-white p-6 rounded-lg shadow-sm border"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-neutral-800">
                      {faq.question}
                    </h3>
                    <div className="prose prose-neutral max-w-none">
                      {faq.answer?.map((block, index) => {
                        if (block._type === 'block') {
                          return (
                            <p
                              key={index}
                              className="text-neutral-600 leading-relaxed"
                            >
                              {block.children
                                ?.map(child => child.text)
                                .join('') || ''}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-neutral-600 mb-4">
                  FAQs marked for homepage display will appear here!
                </p>
              </div>
            )}

            <div className="text-center mt-8">
              <Link
                href="/faqs"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All FAQs →
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
