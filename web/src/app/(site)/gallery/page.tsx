import { MainLayout } from '@/components/templates/MainLayout';
import { client, urlFor } from '@/lib/sanity';
import { GALLERY_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import Image from 'next/image';
import type { GalleryImage, SiteSettings } from '../../../../sanity.types';

async function getGalleryData() {
  const [images, siteSettings] = await Promise.all([
    client.fetch<GalleryImage[]>(
      GALLERY_QUERY,
      {},
      { next: { tags: ['gallery'], revalidate: 60 } }
    ),
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
  ]);

  return { images, siteSettings };
}

export async function generateMetadata() {
  const { siteSettings } = await getGalleryData();
  return genMetadata(
    {
      title: 'Project Gallery - Hometown Handyman',
      description:
        'View our completed home repair and improvement projects throughout East Cincinnati.',
    },
    siteSettings,
    '/gallery'
  );
}

export default async function GalleryPage() {
  const { images } = await getGalleryData();

  return (
    <MainLayout>
      <div className="container-site py-16">
        <h1 className="text-4xl font-bold mb-8">Project Gallery</h1>

        <div className="mb-12">
          <p className="text-lg text-neutral-600">
            See examples of our quality workmanship across East Cincinnati
            homes.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image: GalleryImage) => (
              <div
                key={image._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-1">
                  {image.beforeImage && (
                    <div className="aspect-square relative">
                      <Image
                        src={urlFor(image.beforeImage)
                          .width(200)
                          .height(200)
                          .url()}
                        alt={`Before: ${image.seoAlt || image.title}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Before
                      </div>
                    </div>
                  )}
                  {image.afterImage && (
                    <div className="aspect-square relative">
                      <Image
                        src={urlFor(image.afterImage)
                          .width(200)
                          .height(200)
                          .url()}
                        alt={`After: ${image.seoAlt || image.title}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        After
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                  <p className="text-neutral-600 text-sm mb-2">
                    {image.caption}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {image.service && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Service
                      </span>
                    )}
                    {image.neighborhood && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Neighborhood
                      </span>
                    )}
                  </div>

                  {image.projectDetails && (
                    <div className="text-xs text-neutral-500 space-y-1">
                      {image.projectDetails.duration && (
                        <p>Duration: {image.projectDetails.duration}</p>
                      )}
                      {image.projectDetails.customerSatisfaction && (
                        <p>
                          Rating:{' '}
                          {'⭐'.repeat(
                            image.projectDetails.customerSatisfaction
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="aspect-square bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400">Project Photo {i}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Sample Project
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      Project description will appear here.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-neutral-500 mt-8">
              Add gallery images in Sanity Studio to showcase your work!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
