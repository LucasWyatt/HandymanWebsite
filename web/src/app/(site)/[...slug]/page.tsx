import { MainLayout } from '@/components/templates/MainLayout';
import { client, urlFor } from '@/lib/sanity';
import {
  PAGE_BY_SLUG_QUERY,
  PAGES_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/lib/queries';
import { generateMetadata as genMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { Page, SiteSettings } from '../../../../sanity.types';

// Older page documents carry a flat `content` block array predating
// `contentSections`. Typed here so legacy documents still render.
type PageWithLegacyContent = Page & {
  content?: React.ComponentProps<typeof PortableText>['value'];
};

interface Props {
  params: Promise<{ slug: string[] }>;
}

async function getPageData(slug: string) {
  const [page, siteSettings] = await Promise.all([
    client.fetch<PageWithLegacyContent>(
      PAGE_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ['pages'], revalidate: 60 } }
    ),
    client.fetch<SiteSettings>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: ['site-settings'], revalidate: 60 } }
    ),
  ]);

  return { page, siteSettings };
}

export async function generateStaticParams() {
  const pages = await client.fetch<Page[]>(
    PAGES_QUERY,
    {},
    { next: { tags: ['pages'], revalidate: 60 } }
  );

  return pages.map(page => ({
    slug: [page.slug?.current || ''],
  }));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const slugString = resolvedParams.slug.join('/');
  const { page, siteSettings } = await getPageData(slugString);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return genMetadata(
    {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
    },
    siteSettings,
    `/${slugString}`
  );
}

// Counter for alternating image positions
let imageCounter = 0;

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      imageCounter++;
      const isEven = imageCounter % 2 === 0;
      const floatClass = isEven ? 'float-right ml-6' : 'float-left mr-6';

      // Get display options with defaults
      const displayOptions = value.displayOptions || {};
      const size = displayOptions.size || 'medium';
      const aspectRatio = displayOptions.aspectRatio || 'original';
      const cropMode = displayOptions.cropMode || 'crop';

      // Size configurations
      const sizeConfigs = {
        small: {
          width: 250,
          maxWidth: 'max-w-48 sm:max-w-64',
          sizes: '(max-width: 640px) 192px, 250px',
        },
        medium: {
          width: 400,
          maxWidth: 'max-w-xs sm:max-w-sm',
          sizes: '(max-width: 640px) 320px, 400px',
        },
        large: {
          width: 600,
          maxWidth: 'max-w-sm sm:max-w-md',
          sizes: '(max-width: 640px) 480px, 600px',
        },
      };
      const sizeConfig =
        sizeConfigs[size as keyof typeof sizeConfigs] || sizeConfigs.medium;

      // Aspect ratio configurations
      const aspectRatios: Record<string, { w: number; h: number } | null> = {
        original: null,
        square: { w: 1, h: 1 },
        landscape: { w: 4, h: 3 },
        wide: { w: 16, h: 9 },
        portrait: { w: 3, h: 4 },
        tall: { w: 9, h: 16 },
      };

      // Build Sanity URL
      let imageUrl = urlFor(value).width(sizeConfig.width);

      if (aspectRatio !== 'original' && aspectRatios[aspectRatio]) {
        const ratio = aspectRatios[aspectRatio]!;
        const height = Math.round((sizeConfig.width * ratio.h) / ratio.w);

        if (cropMode === 'crop') {
          imageUrl = imageUrl.height(height).fit('crop');
        } else if (cropMode === 'fill') {
          imageUrl = imageUrl.height(height).fit('fill');
        } else {
          imageUrl = imageUrl.height(height).fit('fillmax');
        }
      }

      const finalImageUrl = imageUrl.url();
      const imageHeight =
        aspectRatio === 'original'
          ? 0
          : aspectRatios[aspectRatio]
            ? Math.round(
                (sizeConfig.width * aspectRatios[aspectRatio]!.h) /
                  aspectRatios[aspectRatio]!.w
              )
            : 0;

      return (
        <div className={`${floatClass} ${sizeConfig.maxWidth} my-4`}>
          <div className="relative w-full">
            <Image
              src={finalImageUrl}
              alt={value.alt || ''}
              width={sizeConfig.width}
              height={imageHeight}
              sizes={sizeConfig.sizes}
              className="rounded-lg shadow-sm w-full h-auto"
            />
          </div>
          {value.caption && (
            <p className="text-sm text-neutral-600 mt-2 italic leading-tight">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    horizontalRule: ({ value }: { value: any }) => {
      const styles: Record<string, string> = {
        standard: 'border-t border-neutral-300',
        thick: 'border-t-4 border-neutral-400',
        dotted: 'border-t-2 border-dotted border-neutral-400',
      };
      const styleClass = styles[value.style || 'standard'] || styles.standard;

      return (
        <div className="clear-both">
          <hr className={`my-8 ${styleClass}`} />
        </div>
      );
    },
  },
  block: {
    normal: ({ children }: any) => (
      <p className="mb-4 text-neutral-700 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 clear-both text-neutral-900">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold mt-6 mb-3 clear-both text-neutral-900">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 clear-both text-neutral-900">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-neutral-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }: any) => {
      if (!value?.href) return <>{children}</>;
      return (
        <a
          href={value.href}
          className="text-blue-600 hover:text-blue-800 underline"
          target={value.href.startsWith('http') ? '_blank' : undefined}
          rel={
            value.href.startsWith('http') ? 'noopener noreferrer' : undefined
          }
        >
          {children}
        </a>
      );
    },
  },
};

export default async function DynamicPage({ params }: Props) {
  const resolvedParams = await params;
  const slugString = resolvedParams.slug.join('/');
  const { page } = await getPageData(slugString);

  if (!page) {
    notFound();
  }

  // Reset image counter for each page render
  imageCounter = 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      {page.hero && (
        <div className="relative bg-neutral-600 text-white py-16">
          {page.hero.backgroundImage && (
            <div className="absolute inset-0">
              <Image
                src={urlFor(page.hero.backgroundImage)
                  .width(1920)
                  .height(1080)
                  .url()}
                alt={page.hero.headline || page.title || ''}
                fill
                className="object-cover opacity-70"
                priority
              />
            </div>
          )}
          <div className="relative container-site text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {page.hero.headline || page.title}
            </h1>
            {page.hero.subheadline && (
              <p className="text-xl mb-8 text-neutral-200 max-w-2xl mx-auto">
                {page.hero.subheadline}
              </p>
            )}
            {page.hero.ctaText && page.hero.ctaLink && (
              <a
                href={page.hero.ctaLink}
                className="btn-primary text-lg px-8 py-3 rounded-lg inline-block"
              >
                {page.hero.ctaText}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="container-site py-16">
        {!page.hero && (
          <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        )}

        {/* Render new content sections if available, otherwise fall back to old content field */}
        {(page as any)?.contentSections?.length > 0 ? (
          <div className="space-y-12">
            {(page as any).contentSections.map(
              (section: any, sectionIndex: number) => {
                // Reset image counter for each section
                imageCounter = 0;

                // Separate content into images and text blocks
                const images: any[] = [];
                const textBlocks: any[] = [];

                section.content.forEach((block: any) => {
                  if (block._type === 'image') {
                    images.push(block);
                  } else {
                    textBlocks.push(block);
                  }
                });

                const shouldImageGoLeft = sectionIndex % 2 === 0;

                return (
                  <div
                    key={sectionIndex}
                    className={`flex flex-col gap-6 items-start ${shouldImageGoLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Image Div - 30% width */}
                    {images.length > 0 && (
                      <div className="w-full lg:w-[30%] flex-shrink-0 text-center">
                        {images.map((block, imgIndex) => {
                          // Get display options with defaults
                          const displayOptions = block.displayOptions || {};
                          const size = displayOptions.size || 'medium';
                          const aspectRatio =
                            displayOptions.aspectRatio || 'original';
                          const cropMode = displayOptions.cropMode || 'crop';

                          // Size configurations
                          const sizeConfigs = {
                            small: { width: 250 },
                            medium: { width: 400 },
                            large: { width: 600 },
                          };
                          const sizeConfig =
                            sizeConfigs[size as keyof typeof sizeConfigs] ||
                            sizeConfigs.medium;

                          // Aspect ratio configurations
                          const aspectRatios: Record<
                            string,
                            { w: number; h: number } | null
                          > = {
                            original: null,
                            square: { w: 1, h: 1 },
                            landscape: { w: 4, h: 3 },
                            wide: { w: 16, h: 9 },
                            portrait: { w: 3, h: 4 },
                            tall: { w: 9, h: 16 },
                          };

                          // Build Sanity URL
                          let imageUrl = urlFor(block).width(sizeConfig.width);

                          if (
                            aspectRatio !== 'original' &&
                            aspectRatios[aspectRatio]
                          ) {
                            const ratio = aspectRatios[aspectRatio]!;
                            const height = Math.round(
                              (sizeConfig.width * ratio.h) / ratio.w
                            );

                            if (cropMode === 'crop') {
                              imageUrl = imageUrl.height(height).fit('crop');
                            } else if (cropMode === 'fill') {
                              imageUrl = imageUrl.height(height).fit('fill');
                            } else {
                              imageUrl = imageUrl.height(height).fit('fillmax');
                            }
                          }

                          const finalImageUrl = imageUrl.url();
                          const imageHeight =
                            aspectRatio === 'original'
                              ? 0
                              : aspectRatios[aspectRatio]
                                ? Math.round(
                                    (sizeConfig.width *
                                      aspectRatios[aspectRatio]!.h) /
                                      aspectRatios[aspectRatio]!.w
                                  )
                                : 0;

                          return (
                            <div
                              key={imgIndex}
                              className="relative inline-block"
                            >
                              <Image
                                src={finalImageUrl}
                                alt={block.alt || 'Page image'}
                                width={sizeConfig.width}
                                height={imageHeight}
                                className="rounded-lg shadow-sm max-w-full h-auto"
                              />
                              {block.caption && (
                                <p className="text-sm text-neutral-600 mt-2 italic leading-tight">
                                  {block.caption}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Text Content Div - 70% width */}
                    {textBlocks.length > 0 && (
                      <div className="w-full lg:w-[70%] flex-1">
                        {textBlocks.map((block: any, index: number) => {
                          if (block._type === 'block') {
                            // Handle different heading styles
                            if (block.style === 'h2') {
                              return (
                                <h2
                                  key={index}
                                  className="text-3xl font-semibold mt-0 mb-4 text-neutral-900"
                                >
                                  {block.children
                                    ?.map((child: any) => child.text)
                                    .join('') || ''}
                                </h2>
                              );
                            }
                            if (block.style === 'h3') {
                              return (
                                <h3
                                  key={index}
                                  className="text-2xl font-semibold mt-6 mb-3 text-neutral-900"
                                >
                                  {block.children
                                    ?.map((child: any) => child.text)
                                    .join('') || ''}
                                </h3>
                              );
                            }
                            if (block.style === 'blockquote') {
                              return (
                                <blockquote
                                  key={index}
                                  className="border-l-4 border-blue-500 pl-4 italic text-lg my-6"
                                >
                                  {block.children
                                    ?.map((child: any) => child.text)
                                    .join('') || ''}
                                </blockquote>
                              );
                            }
                            // Normal paragraph
                            return (
                              <p
                                key={index}
                                className="text-neutral-700 mb-4 leading-relaxed"
                              >
                                {block.children?.map(
                                  (child: any, childIndex: number) => {
                                    let text: React.ReactNode =
                                      child.text || '';
                                    if (child.marks?.includes('strong')) {
                                      text = (
                                        <strong key={childIndex}>{text}</strong>
                                      );
                                    }
                                    if (child.marks?.includes('em')) {
                                      text = <em key={childIndex}>{text}</em>;
                                    }
                                    return text;
                                  }
                                )}
                              </p>
                            );
                          }
                          if (block._type === 'horizontalRule') {
                            const styles: Record<string, string> = {
                              standard: 'border-t border-neutral-300',
                              thick: 'border-t-4 border-neutral-400',
                              dotted:
                                'border-t-2 border-dotted border-neutral-400',
                            };
                            const styleClass =
                              styles[block.style || 'standard'] ||
                              styles.standard;
                            return (
                              <hr
                                key={index}
                                className={`my-8 ${styleClass}`}
                              />
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        ) : page.content ? (
          <div className="text-lg leading-relaxed text-neutral-800 max-w-none">
            <PortableText
              value={page.content}
              components={portableTextComponents}
            />
            <div className="clear-both"></div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}
