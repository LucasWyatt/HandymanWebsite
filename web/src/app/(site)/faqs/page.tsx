import { MainLayout } from '@/components/templates/MainLayout';
import { client } from '@/lib/sanity';
import { FAQS_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries';
import {
  generateMetadata as genMetadata,
  generateFAQPageLD,
} from '@/lib/metadata';
import type { Faq, SiteSettings } from '../../../../sanity.types';

async function getFAQsData() {
  const [faqs, siteSettings] = await Promise.all([
    client.fetch<Faq[]>(
      FAQS_QUERY,
      {},
      { next: { tags: ['faqs'], revalidate: 60 } }
    ),
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
  ]);

  return { faqs, siteSettings };
}

export async function generateMetadata() {
  const { siteSettings } = await getFAQsData();
  return genMetadata(
    {
      title: 'Frequently Asked Questions - Hometown Handyman',
      description:
        'Get answers to common questions about our home repair and handyman services.',
    },
    siteSettings,
    '/faqs'
  );
}

export default async function FAQsPage() {
  const { faqs } = await getFAQsData();

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateFAQPageLD(
                faqs.map((faq: Faq) => ({
                  question: faq.question || '',
                  answer: (faq.answer || [])
                    .map(block =>
                      block._type === 'block'
                        ? block.children?.map(child => child.text).join('') ||
                          ''
                        : ''
                    )
                    .join(' '),
                }))
              )
            ),
          }}
        />
      )}
      <MainLayout>
        <div className="container-site py-16">
          <h1 className="text-4xl font-bold mb-8">
            Frequently Asked Questions
          </h1>

          {faqs.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {/* Group FAQs by category */}
              {(['high', 'medium', 'low'] as const).map(priorityLevel => {
                const priorityFaqs = faqs.filter(
                  (faq: Faq) => faq.priority === priorityLevel
                );
                if (priorityFaqs.length === 0) return null;

                const priorityTitle = {
                  high: '🔥 Most Common Questions',
                  medium: '⭐ Common Questions',
                  low: '📝 Other Questions',
                }[priorityLevel];

                return (
                  <div key={priorityLevel} className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">
                      {priorityTitle}
                    </h2>
                    <div className="space-y-6">
                      {priorityFaqs.map((faq: Faq) => (
                        <div
                          key={faq._id}
                          className="bg-white p-6 rounded-lg shadow-sm border"
                        >
                          <h3 className="text-xl font-semibold mb-3 text-neutral-800">
                            {faq.question}
                          </h3>
                          <div className="prose prose-neutral max-w-none mb-4">
                            {(faq.answer || []).map((block, index: number) => {
                              if (block._type === 'block') {
                                return (
                                  <p
                                    key={index}
                                    className="text-neutral-600 leading-relaxed mb-2"
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

                          <div className="flex flex-wrap gap-2">
                            <span className="inline-block bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded">
                              {(faq.category || '').charAt(0).toUpperCase() +
                                (faq.category || '').slice(1)}
                            </span>
                            {(faq.relatedServices || []).map(service => (
                              <span
                                key={service._key || service._ref}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                Related Service
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-3 text-neutral-800">
                    What areas do you serve?
                  </h2>
                  <p className="text-neutral-600 leading-relaxed">
                    We focus on East Cincinnati neighborhoods including Hyde
                    Park, Indian Hill, Terrace Park, and surrounding areas.
                    Contact us to confirm service in your specific location.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-3 text-neutral-800">
                    How do you charge for your services?
                  </h2>
                  <p className="text-neutral-600 leading-relaxed">
                    We provide upfront estimates for larger projects and always
                    discuss pricing before beginning work. Contact us for a
                    personalized quote based on your specific needs.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-3 text-neutral-800">
                    Are you licensed and insured?
                  </h2>
                  <p className="text-neutral-600 leading-relaxed">
                    Yes, Hometown Handyman is fully licensed and insured for
                    your protection and peace of mind. We can provide proof of
                    insurance upon request.
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <p className="text-neutral-500 mb-4">
                  Add more FAQs in Sanity Studio to help your customers!
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 bg-neutral-50 p-8 rounded-lg text-center max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-neutral-600 mb-6">
              Don&apos;t see your question answered here? Give us a call and
              we&apos;ll be happy to help.
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
    </>
  );
}
