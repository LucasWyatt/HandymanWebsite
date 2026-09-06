'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CallButton } from '@/components/atoms/CallButton';
import { EstimateButton } from '@/components/atoms/EstimateButton';
import { MobileDrawer } from '@/components/molecules/MobileDrawer';

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  // TODO: Uncomment when gallery images are added
  // { name: 'Gallery', href: '/gallery' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Service Area', href: '/service-area' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-site">
        <div className="flex items-center justify-between h-16">
          {/* Branding - Always on left */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/WordmarkOnly.svg"
                alt="Hometown Handyman"
                width={0}
                height={0}
                style={{ height: '2.5rem', width: 'auto' }}
              />
              <div className="hidden sm:block text-xl text-white leading-tight px-4 py-2 bg-gradient-to-br from-brand-600 to-brand-700 font-brand">
                <div>Home</div>
                <div className="whitespace-nowrap">Solutions</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-8 flex-shrink">
            {navigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-1 xl:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-brand-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"
                      style={{ bottom: '-1rem' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side - Navigation & CTA Buttons */}
          <div className="flex items-center">
            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 mr-4">
              <CallButton variant="outline" size="sm" />
              <EstimateButton variant="primary" size="sm" />
            </div>

            {/* Tablet CTA Buttons + Menu Button */}
            <div className="hidden md:flex lg:hidden items-center space-x-3 mr-4">
              <CallButton variant="outline" size="sm" />
              <EstimateButton variant="primary" size="sm" />
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-3 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile: Evenly spaced action buttons */}
            <div className="md:hidden flex items-center justify-end space-x-6 min-w-0 flex-1">
              <CallButton
                variant="outline"
                size="sm"
                showIcon={true}
                iconOnly={true}
                className="p-3"
              />
              <EstimateButton
                variant="primary"
                size="sm"
                showIcon={true}
                iconOnly={true}
                className="p-3"
              />
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-3 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navigation={navigation}
      />
    </header>
  );
}
