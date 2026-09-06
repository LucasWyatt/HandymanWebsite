import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Copy web/.env.example to ' +
      'web/.env.local and fill in your Sanity project ID. See SETUP.md.'
  );
}

const config = {
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
};

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function revalidateContent(type?: string) {
  try {
    const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`;

    await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REVALIDATE_SECRET}`,
      },
      body: JSON.stringify({ type }),
    });
  } catch (error) {
    console.error('Failed to revalidate:', error);
  }
}
