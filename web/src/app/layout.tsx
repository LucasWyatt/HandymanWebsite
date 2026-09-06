import type { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Hometown Handyman | Home Repair & Handyman in East Cincinnati',
  description:
    'Premium home repair, installations, and light remodeling. Serving Hyde Park, Indian Hill, Terrace Park and nearby. Call (555) 555-0100.',
  keywords: [
    'handyman east cincinnati',
    'home repair hyde park',
    'door installation',
    'drywall repair',
    'tile repair',
    'deck repair',
    'bathroom refresh',
  ],
  authors: [{ name: 'Hometown Handyman' }],
  openGraph: {
    title: 'Hometown Handyman | East Cincinnati Home Repair',
    description:
      'Premium home repair and handyman services for East Cincinnati neighborhoods. Professional, reliable, warranty-backed work.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hometown Handyman',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hometown Handyman | East Cincinnati Home Repair',
    description:
      'Premium home repair and handyman services. Call (555) 555-0100 for Hyde Park, Indian Hill, Terrace Park area.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://example.com'),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
