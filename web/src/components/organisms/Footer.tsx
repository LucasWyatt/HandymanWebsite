import Link from 'next/link';
import type { Service, Neighborhood } from '../../../sanity.types';

interface FooterService {
  _id: string;
  title: string;
  seoTitle?: string;
  slug: { current: string };
}

interface FooterNeighborhood {
  _id: string;
  name: string;
  slug: { current: string };
}

interface FooterProps {
  services?: FooterService[];
  neighborhoods?: FooterNeighborhood[];
}

export function Footer({ services = [], neighborhoods = [] }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Hometown Handyman LLC
            </h3>
            <p className="text-neutral-300 mb-4">
              Premium home repair, installations, and light remodeling for East
              Cincinnati neighborhoods.
            </p>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>123 Main Street</p>
              <p>Cincinnati, OH 12345</p>
              <a
                href="tel:+15555550100"
                className="phone-link text-brand-400 hover:text-brand-300"
              >
                (555) 555-0100
              </a>
              <p>
                <a
                  href="mailto:hello@example.com"
                  className="text-brand-400 hover:text-brand-300"
                >
                  hello@example.com
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Our Services
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              {services.slice(0, 6).map(service => (
                <li key={service._id}>
                  <Link
                    href={`/services/${service.slug.current}`}
                    className="hover:text-white"
                    title={service.seoTitle || service.title}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-brand-400 hover:text-brand-300"
                >
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Service Areas
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              {neighborhoods.slice(0, 6).map(area => (
                <li key={area._id}>
                  <Link
                    href={`/service-area#${area.slug.current}`}
                    className="hover:text-white"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/service-area"
                  className="text-brand-400 hover:text-brand-300"
                >
                  View all areas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/services" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/estimate" className="hover:text-white">
                  Request Estimate
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">
            © 2025 Hometown Handyman LLC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-neutral-400 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-neutral-400 hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
