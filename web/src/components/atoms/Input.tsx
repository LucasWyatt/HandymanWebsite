import React, { forwardRef, InputHTMLAttributes, useId, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && value !== '';
    const shouldFloatLabel = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'peer block w-full px-3 pt-6 pb-2 border border-neutral-300 rounded-md shadow-sm bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cta-500 focus:border-cta-500 sm:text-sm transition-all duration-200',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          placeholder={label || ''}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none text-neutral-500',
              'peer-autofill:top-1 peer-autofill:text-xs peer-autofill:font-medium peer-autofill:text-neutral-600',
              shouldFloatLabel
                ? 'top-1 text-xs font-medium text-neutral-600'
                : 'top-4 text-sm'
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
