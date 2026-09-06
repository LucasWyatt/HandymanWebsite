'use client';

import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button onClick={() => reset()} className="btn-primary">
              Try again
            </button>
            <div className="mt-4">
              <Link href="/" className="text-brand-600 hover:text-brand-700">
                Go back to homepage
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
