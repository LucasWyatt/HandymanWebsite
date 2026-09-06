import { MainLayout } from '@/components/templates/MainLayout';
import { EstimateForm } from '@/components/organisms/EstimateForm';
import { client } from '@/lib/sanity';
import { SITE_SETTINGS_QUERY } from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import type { SiteSettings } from '../../../../sanity.types';

async function getEstimateData() {
  const siteSettings = await client.fetch<SiteSettings>(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ['site-settings'], revalidate: 60 } }
  );

  return { siteSettings };
}

export async function generateMetadata() {
  const { siteSettings } = await getEstimateData();
  return genMetadata(
    {
      title: 'Request an Estimate - Hometown Handyman',
      description:
        'Request a free estimate for your home repair project. Professional handyman services in East Cincinnati.',
    },
    siteSettings,
    '/estimate'
  );
}

export default async function EstimatePage() {
  const { siteSettings } = await getEstimateData();

  return (
    <MainLayout>
      <div className="container-site py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Request an Estimate</h1>
            <p className="text-lg text-neutral-600 mb-4">
              Ready to get started on your home improvement project? Fill out
              the form below or call us directly.
            </p>
          </div>

          <EstimateForm className="mb-16" />

          {/* Alternative Contact Methods & Service Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">Prefer to Call?</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-medium text-neutral-800 w-20">
                    Phone:
                  </span>
                  <a
                    href={`tel:${siteSettings?.contactInfo?.phone || '+15555550100'}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {siteSettings?.contactInfo?.phone || '(555) 555-0100'}
                  </a>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-neutral-800 w-20">
                    Email:
                  </span>
                  <a
                    href={`mailto:${siteSettings?.contactInfo?.email || 'estimates@example.com'}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {siteSettings?.contactInfo?.email ||
                      'estimates@example.com'}
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Our Service Process
                </h3>
                <ol className="space-y-3 text-neutral-600">
                  <li className="flex">
                    <span className="font-semibold text-blue-600 mr-3">1.</span>
                    Submit form or contact us
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-blue-600 mr-3">2.</span>
                    Schedule a consultation
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-blue-600 mr-3">3.</span>
                    Receive your detailed estimate
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-blue-600 mr-3">4.</span>
                    Schedule your project
                  </li>
                </ol>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-neutral-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Service Areas</h2>

              <p className="text-neutral-600 mb-6">
                We proudly serve East Cincinnati neighborhoods including:
              </p>

              <ul className="grid grid-cols-1 gap-3 text-neutral-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Hyde Park
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Indian Hill
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Terrace Park
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Oakley
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Mount Lookout
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Surrounding East Side areas
                </li>
              </ul>

              <p className="text-sm text-neutral-500 mt-6">
                Not sure if we serve your area? Give us a call to discuss your
                project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
