'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CallButton } from '@/components/atoms/CallButton';
import { EstimateButton } from '@/components/atoms/EstimateButton';

interface NavigationItem {
  name: string;
  href: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
}

export function MobileDrawer({
  isOpen,
  onClose,
  navigation,
}: MobileDrawerProps) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when drawer opens
      closeButtonRef.current?.focus();

      // Store the element that was focused before opening
      lastFocusableElementRef.current = document.activeElement as HTMLElement;
    } else {
      // Return focus to the element that opened the drawer
      if (lastFocusableElementRef.current) {
        lastFocusableElementRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus within the drawer
      if (event.key === 'Tab') {
        const focusableElements = drawerRef.current?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isClient) return null;

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        style={{ zIndex: 99998 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ zIndex: 99999 }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
            <button
              ref={closeButtonRef}
              type="button"
              className="p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none"
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex-1 py-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Hometown Handyman Wordmark - Home Link */}
            <Link
              href="/"
              className={`block px-4 py-4 mb-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 ${
                pathname === '/'
                  ? 'bg-brand-50 border-r-4 border-brand-600'
                  : 'hover:bg-neutral-50'
              }`}
              onClick={onClose}
            >
              <Image
                src="/WordmarkOnly.svg"
                alt="Hometown Handyman Home"
                width={120}
                height={32}
                style={{ height: '2rem', width: 'auto' }}
              />
            </Link>

            {/* Navigation Menu Items */}
            {navigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50 border-r-4 border-brand-600'
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="p-4 border-t border-neutral-200 space-y-3">
            <CallButton
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onClose}
            />
            <EstimateButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
}
