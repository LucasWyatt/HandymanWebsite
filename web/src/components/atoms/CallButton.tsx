import React, { AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CallButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  iconOnly?: boolean;
  phoneNumber?: string;
  children?: React.ReactNode;
}

export const CallButton = forwardRef<HTMLAnchorElement, CallButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      showIcon = true,
      iconOnly = false,
      phoneNumber = '+15555550100',
      children = '(555) 555-0100',
      ...props
    },
    ref
  ) => {
    return (
      <a
        href={`tel:${phoneNumber}`}
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
        aria-label="Call Hometown Handyman at (555) 555-0100"
        ref={ref}
        {...props}
      >
        {showIcon && (
          <svg
            className={cn('flex-shrink-0', {
              'w-3 h-3': size === 'sm',
              'w-4 h-4': size === 'md',
              'w-5 h-5': size === 'lg',
            })}
            fill="#C34B44" // Keep as hex for SVG compatibility
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )}
        {!iconOnly && children}
      </a>
    );
  }
);

CallButton.displayName = 'CallButton';
