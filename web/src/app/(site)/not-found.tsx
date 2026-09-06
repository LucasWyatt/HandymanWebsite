import { MainLayout } from '@/components/templates/MainLayout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-neutral-600 mb-8 max-w-md">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page may have been moved or doesn&apos;t exist.
          </p>
          <div className="space-x-4">
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/services" className="btn-secondary">
              View Services
            </Link>
          </div>
          <div className="mt-8">
            <p className="text-sm text-neutral-500">
              Need help? Call us at{' '}
              <a href="tel:+15555550100" className="text-brand-600 font-medium">
                (555) 555-0100
              </a>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
