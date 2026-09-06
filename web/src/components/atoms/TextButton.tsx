import React, { AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  iconOnly?: boolean;
  phoneNumber?: string;
  message?: string;
  children?: React.ReactNode;
}

export const TextButton = forwardRef<HTMLAnchorElement, TextButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      showIcon = true,
      iconOnly = false,
      phoneNumber = '+15555550100',
      message,
      children = 'Text (555) 555-0100',
      ...props
    },
    ref
  ) => {
    const smsUrl = message
      ? `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
      : `sms:${phoneNumber}`;

    return (
      <a
        href={smsUrl}
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
        aria-label="Text Hometown Handyman at (555) 555-0100"
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
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>
        )}
        {!iconOnly && children}
      </a>
    );
  }
);

TextButton.displayName = 'TextButton';
