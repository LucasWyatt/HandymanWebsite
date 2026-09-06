import React, { AnchorHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EstimateButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  iconOnly?: boolean;
  href?: string;
  children?: React.ReactNode;
}

export const EstimateButton = forwardRef<
  HTMLAnchorElement,
  EstimateButtonProps
>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      showIcon = true,
      iconOnly = false,
      href = '/estimate',
      children = 'Request Estimate',
      ...props
    },
    ref
  ) => {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap',
          {
            'bg-cta-600 text-white hover:bg-cta-700 hover:text-white active:text-white focus:ring-cta-500':
              variant === 'primary',
            'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500':
              variant === 'secondary',
            'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500':
              variant === 'outline',
          },
          {
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm' && !iconOnly,
            'px-4 py-2 text-sm gap-2': size === 'md' && !iconOnly,
            'px-6 py-3 text-base gap-2': size === 'lg' && !iconOnly,
            'p-2': iconOnly && size === 'sm',
            'p-2.5': iconOnly && size === 'md',
            'p-3': iconOnly && size === 'lg',
          },
          className
        )}
        aria-label="Request a free estimate for home repair services"
        ref={ref}
        {...props}
      >
        {!iconOnly && children}
        {showIcon && (
          <svg
            className={cn('flex-shrink-0', {
              'w-3 h-3': size === 'sm',
              'w-4 h-4': size === 'md',
              'w-5 h-5': size === 'lg',
            })}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </Link>
    );
  }
);

EstimateButton.displayName = 'EstimateButton';
