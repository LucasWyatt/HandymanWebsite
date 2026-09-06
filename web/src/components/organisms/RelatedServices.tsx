import Link from 'next/link';
import type { Service } from '../../../sanity.types';

interface InternalLink {
  anchorText: string;
  description?: string;
  service: Pick<Service, '_id' | 'title' | 'shortDescription' | 'slug'>;
}

// The GROQ query dereferences internalLinks, so the generated (raw reference)
// shape has to be omitted before re-declaring it.
interface ExtendedService extends Omit<Service, 'internalLinks'> {
  internalLinks?: InternalLink[];
  secondaryImage?: Service['featuredImage'];
}

interface RelatedServicesProps {
  internalLinks: InternalLink[];
  className?: string;
}

export function RelatedServices({
  internalLinks,
  className = '',
}: RelatedServicesProps) {
  if (!internalLinks || internalLinks.length === 0) {
    return null;
  }

  return (
    <section className={`bg-neutral-50 p-6 rounded-lg ${className}`}>
      <h2 className="text-2xl font-semibold mb-6">Related Services</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {internalLinks.map(link => {
          const { service, anchorText, description } = link;

          if (!service?.slug?.current) {
            return null;
          }

          return (
            <div
              key={service._id}
              className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <Link
                  href={`/services/${service.slug.current}`}
                  aria-label={`Learn more about ${service.title} services in East Cincinnati`}
                  className="text-cta-600 font-semibold hover:text-cta-700 transition-colors"
                >
                  {anchorText}
                </Link>

                <h3 className="text-lg font-medium text-neutral-800">
                  {service.title}
                </h3>

                {description && (
                  <p className="text-sm text-neutral-600 italic">
                    {description}
                  </p>
                )}

                {service.shortDescription && (
                  <p className="text-sm text-neutral-600">
                    {service.shortDescription}
                  </p>
                )}

                <Link
                  href={`/services/${service.slug.current}`}
                  className="inline-flex items-center text-sm text-cta-600 hover:text-cta-700 transition-colors"
                  aria-label={`View details about ${service.title} services`}
                >
                  Learn more
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
