import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="relative">
        <div className="flex items-start py-2">
          <input
            id={checkboxId}
            type="checkbox"
            className={cn(
              'h-4 w-4 text-brand-600 border-neutral-300 rounded focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 mt-0.5',
              error && 'border-red-300 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-3 block text-sm text-neutral-700 cursor-pointer leading-relaxed"
            >
              {label}
            </label>
          )}
        </div>
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

Checkbox.displayName = 'Checkbox';
