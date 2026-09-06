import { MainLayout } from '@/components/templates/MainLayout';
import { client } from '@/lib/sanity';
import { SITE_SETTINGS_QUERY } from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import type { SiteSettings } from '../../../../sanity.types';

async function getLegalData() {
  const siteSettings = await client.fetch<SiteSettings>(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ['site-settings'], revalidate: 60 } }
  );

  return { siteSettings };
}

export async function generateMetadata() {
  const { siteSettings } = await getLegalData();
  return genMetadata(
    {
      title: 'Legal Information - Hometown Handyman LLC',
      description:
        'Terms of service, privacy policy, and legal information for Hometown Handyman LLC.',
    },
    siteSettings,
    '/legal'
  );
}

export default async function LegalPage() {
  await getLegalData();

  return (
    <MainLayout>
      <div className="container-site py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Legal Information</h1>

          <div className="prose prose-lg max-w-none space-y-12">
            {/* Terms of Service */}
            <section>
              <h2 className="text-3xl font-semibold mb-6">Terms of Service</h2>

              <h3 className="text-xl font-semibold mb-4">Service Agreement</h3>
              <p className="text-neutral-600 mb-4">
                By engaging Hometown Handyman LLC for services, you agree to
                these terms:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-6">
                <li>
                  All work is performed by licensed and insured professionals
                </li>
                <li>Estimates are provided free of charge</li>
                <li>Materials and permits are additional charges</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Payment Terms</h3>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-6">
                <li>Payment is due upon completion of work</li>
                <li>We accept cash, check, and major credit cards</li>
                <li>For larger projects, a deposit may be required</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Warranty</h3>
              <p className="text-neutral-600 mb-6">
                We warrant our workmanship for one year from completion date.
                This warranty covers defects in our labor but does not cover
                normal wear, damage from misuse, or issues with materials not
                supplied by us.
              </p>
            </section>

            {/* Privacy Policy */}
            <section>
              <h2 className="text-3xl font-semibold mb-6">Privacy Policy</h2>

              <h3 className="text-xl font-semibold mb-4">
                Information We Collect
              </h3>
              <p className="text-neutral-600 mb-4">
                We collect information necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-6">
                <li>Contact information (name, phone, email, address)</li>
                <li>Project details and service requirements</li>
                <li>Payment information for completed work</li>
                <li>Photos of work areas (with your permission)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">
                How We Use Information
              </h3>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-6">
                <li>To schedule and perform requested services</li>
                <li>To communicate about your project</li>
                <li>To process payments</li>
                <li>To maintain service records</li>
                <li>To follow up on completed work</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">
                Information Sharing
              </h3>
              <p className="text-neutral-600 mb-6">
                We do not sell, rent, or share your personal information with
                third parties except as required by law or with service
                providers necessary to complete your work (such as material
                suppliers or subcontractors).
              </p>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-3xl font-semibold mb-6">
                Liability and Insurance
              </h2>

              <p className="text-neutral-600 mb-4">
                Hometown Handyman LLC maintains comprehensive liability
                insurance to protect both our business and our customers. Our
                insurance covers:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-6">
                <li>General liability for accidents and property damage</li>
                <li>Professional liability for workmanship issues</li>
                <li>Workers compensation for our employees</li>
              </ul>

              <p className="text-neutral-600 mb-6">
                Proof of insurance can be provided upon request. While we take
                every precaution to protect your property, you are encouraged to
                notify your homeowners insurance of any major work being
                performed.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-neutral-50 p-8 rounded-lg">
              <h2 className="text-3xl font-semibold mb-6">
                Questions About These Terms?
              </h2>
              <p className="text-neutral-600 mb-4">
                If you have questions about our terms of service, privacy
                policy, or legal information, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-medium">Hometown Handyman LLC</p>
                <p>
                  Phone:{' '}
                  <a href="tel:+15555550100" className="text-blue-600">
                    (555) 555-0100
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a href="mailto:info@example.com" className="text-blue-600">
                    info@example.com
                  </a>
                </p>
              </div>
              <p className="text-sm text-neutral-500 mt-6">
                Last updated: January 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
